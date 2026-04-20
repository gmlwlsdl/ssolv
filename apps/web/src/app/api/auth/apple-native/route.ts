import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { LOGIN_ERROR_TYPES } from '@/data/constants/errorCodes';

import type { ApiErrorResponse } from '@/data/models/api';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const isValidRedirectUrl = (url: string | null): boolean => {
  if (!url) return false;
  if (!url.startsWith('/')) return false;
  return ['/meetings'].some((path) => url.startsWith(path));
};

const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 604800,
  });
};

const setUserProfileCookie = async (profile: {
  email: string;
  nickname: string;
  profileImage: string;
}) => {
  const cookieStore = await cookies();
  cookieStore.set('userProfile', JSON.stringify(profile), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 604800,
  });
};

/**
 * 네이티브 iOS Sign in with Apple 처리
 * expo-apple-authentication.signInAsync()가 반환한 authorizationCode를 백엔드에 전달
 * 네이티브 앱에서는 redirect_uri가 빈 값 (Apple 공식 문서 기준)
 */
export const POST = async (request: NextRequest) => {
  try {
    const { authorizationCode, identityToken, user, state } = (await request.json()) as {
      authorizationCode: string | null;
      identityToken: string | null;
      user: string | null;
      state: string | null;
    };

    if (!authorizationCode) {
      return NextResponse.json({ error: LOGIN_ERROR_TYPES.SERVER_ERROR }, { status: 400 });
    }

    const url = new URL(`${BACKEND_API}/auth/apple-login`);
    url.searchParams.set('code', authorizationCode);
    url.searchParams.set('redirect_uri', '');
    if (user) url.searchParams.set('user', user);
    if (identityToken) url.searchParams.set('identity_token', identityToken);

    const response = await fetch(String(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let errorCode: string | undefined;
      try {
        const body = (await response.json()) as ApiErrorResponse;
        errorCode = body.error?.code;
      } catch {
        // ignore parse error
      }
      console.error('[Apple Native] 백엔드 에러:', errorCode);
      return NextResponse.json({ error: LOGIN_ERROR_TYPES.AUTH_FAILED }, { status: 400 });
    }

    const { data: { accessToken, refreshToken, userProfile } = {} } = await response.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: LOGIN_ERROR_TYPES.SERVER_ERROR }, { status: 500 });
    }

    await setAuthCookies(accessToken, refreshToken);
    if (userProfile) await setUserProfileCookie(userProfile);

    const cookieStore = await cookies();
    cookieStore.set('lastLoginProvider', 'apple', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    const redirectPath = isValidRedirectUrl(state) ? state! : '/';
    return NextResponse.json({ success: true, redirectUrl: `${BASE_URL}${redirectPath}` });
  } catch (error) {
    console.error('[Apple Native] 처리 중 에러:', error);
    return NextResponse.json({ error: LOGIN_ERROR_TYPES.SERVER_ERROR }, { status: 500 });
  }
};
