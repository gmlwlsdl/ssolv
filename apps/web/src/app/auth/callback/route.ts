import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// 유효한 리다이렉트 경로인지 확인 (Open Redirect 공격 방지)
const isValidRedirectUrl = (url: string | null): boolean => {
  if (!url) return false;
  if (!url.startsWith('/')) return false;

  const validPaths = ['/meetings'];
  return validPaths.some((path) => url.startsWith(path));
};

// 쿠키 설정 헬퍼
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

// 에러 리다이렉트 헬퍼
const redirectToLogin = (error: string) => {
  return NextResponse.redirect(`${BASE_URL}/login?error=${encodeURIComponent(error)}`, 303);
};

// 성공 리다이렉트 헬퍼
const redirectToDestination = (state: string | null) => {
  const redirectUrl = isValidRedirectUrl(state) ? state : '/';
  return NextResponse.redirect(`${BASE_URL}${redirectUrl}`, 303);
};

/**
 * 카카오 OAuth 콜백 처리 (GET)
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth 실패:', error);
    return redirectToLogin('oauth_failed');
  }

  if (!code) {
    console.error('code 파라미터 없음');
    return redirectToLogin('no_code');
  }

  try {
    const redirectUri = process.env.AUTH_REDIRECT_URL!;
    const url = new URL(`${BACKEND_API}/auth/kakao-login`);
    url.searchParams.set('code', code);
    url.searchParams.set('redirect_uri', redirectUri);

    const response = await fetch(String(url), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error('백엔드 에러 응답:', errorText);
      return redirectToLogin('backend_error');
    }

    const { data: { accessToken, refreshToken } = {} } = await response.json();

    if (!accessToken || !refreshToken) {
      console.error('토큰이 응답에 포함되지 않았습니다');
      return redirectToLogin('no_token');
    }

    await setAuthCookies(accessToken, refreshToken);
    return redirectToDestination(state);
  } catch (error) {
    console.error('카카오 로그인 처리 중 에러:', error);
    return redirectToLogin('server_error');
  }
};

/**
 * 애플 OAuth 콜백 처리 (POST - form_post)
 */
export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const code = formData.get('code') as string | null;
    const state = formData.get('state') as string | null;
    const user = formData.get('user') as string | null; // 최초 로그인 시에만 존재

    if (!code) {
      console.error('code 파라미터 없음');
      return redirectToLogin('no_code');
    }

    const redirectUri = process.env.AUTH_REDIRECT_URL!;
    const url = new URL(`${BACKEND_API}/auth/apple-login`);
    url.searchParams.set('code', code);
    url.searchParams.set('redirect_uri', redirectUri);
    if (user) {
      url.searchParams.set('user', user);
    }

    const response = await fetch(String(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error('[Apple Login] 백엔드 에러 응답:', errorText);
      console.error('[Apple Login] 응답 헤더:', Object.fromEntries(response.headers.entries()));
      return redirectToLogin(`backend_error_${response.status}`);
    }

    const { data: { accessToken, refreshToken } = {} } = await response.json();

    if (!accessToken || !refreshToken) {
      console.error('토큰이 응답에 포함되지 않았습니다');
      return redirectToLogin('no_token');
    }

    await setAuthCookies(accessToken, refreshToken);
    return redirectToDestination(state);
  } catch (error) {
    console.error('애플 로그인 처리 중 에러:', error);
    return redirectToLogin('server_error');
  }
};
