import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ERROR_CODES, LOGIN_ERROR_TYPES } from '@/data/constants/errorCodes';

import type { ApiErrorResponse } from '@/data/models/api';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

/** 인증 실패(401)로 분류되는 에러 코드 목록 */
const AUTH_FAILED_CODES = [
  ERROR_CODES.KAKAO_INVALID_GRANT, // O001
  ERROR_CODES.KAKAO_AUTH_FAILED, // O002
  ERROR_CODES.APPLE_INVALID_GRANT, // O011
  ERROR_CODES.APPLE_AUTH_FAILED, // O012
  ERROR_CODES.APPLE_INVALID_ID_TOKEN, // O018
  ERROR_CODES.APPLE_TOKEN_VERIFICATION_FAILED, // O019
] as const;

/** 백엔드 에러 코드(O001~O019) → 클라이언트 에러 타입으로 변환 */
const resolveLoginErrorType = (errorCode?: string): string => {
  if (errorCode === ERROR_CODES.ALREADY_REGISTERED_WITH_OTHER_LOGIN) {
    return LOGIN_ERROR_TYPES.EMAIL_CONFLICT;
  }

  if (errorCode === ERROR_CODES.KAKAO_RATE_LIMIT_EXCEEDED) {
    return LOGIN_ERROR_TYPES.RATE_LIMITED;
  }

  if (errorCode && AUTH_FAILED_CODES.includes(errorCode as (typeof AUTH_FAILED_CODES)[number])) {
    return LOGIN_ERROR_TYPES.AUTH_FAILED;
  }

  return LOGIN_ERROR_TYPES.SERVER_ERROR;
};

/** 백엔드 에러 응답에서 에러 코드를 안전하게 추출 */
const parseBackendError = async (response: Response): Promise<{ code?: string; raw: unknown }> => {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    return { code: body.error?.code, raw: body };
  } catch {
    return { code: undefined, raw: null };
  }
};

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

/** 로그인 응답에서 사용자 프로필 정보를 쿠키에 저장 */
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
    maxAge: 604800, // refreshToken과 동일한 수명
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

/** 백엔드 로그인 응답을 처리하는 공통 핸들러 */
const handleLoginResponse = async (response: Response, state: string | null, provider: string) => {
  if (!response.ok) {
    const { code, raw } = await parseBackendError(response);
    console.error(`[${provider}] 백엔드 에러 응답:`, raw);
    const errorType = resolveLoginErrorType(code);
    return redirectToLogin(errorType);
  }

  const { data: { accessToken, refreshToken, userProfile } = {} } = await response.json();

  if (!accessToken || !refreshToken) {
    console.error(`[${provider}] 토큰이 응답에 포함되지 않았습니다`);
    return redirectToLogin(LOGIN_ERROR_TYPES.SERVER_ERROR);
  }

  await setAuthCookies(accessToken, refreshToken);
  if (userProfile) {
    await setUserProfileCookie(userProfile);
  }

  const cookieStore = await cookies();
  cookieStore.set('lastLoginProvider', provider.toLowerCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30일
  });

  return redirectToDestination(state);
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
    console.error('[Kakao] OAuth 실패:', error);
    return redirectToLogin(LOGIN_ERROR_TYPES.OAUTH_FAILED);
  }

  if (!code) {
    console.error('[Kakao] code 파라미터 없음');
    return redirectToLogin(LOGIN_ERROR_TYPES.SERVER_ERROR);
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

    return await handleLoginResponse(response, state, 'Kakao');
  } catch (error) {
    console.error('[Kakao] 로그인 처리 중 에러:', error);
    return redirectToLogin(LOGIN_ERROR_TYPES.SERVER_ERROR);
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
      console.error('[Apple] code 파라미터 없음');
      return redirectToLogin(LOGIN_ERROR_TYPES.SERVER_ERROR);
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

    return await handleLoginResponse(response, state, 'Apple');
  } catch (error) {
    console.error('[Apple] 로그인 처리 중 에러:', error);
    return redirectToLogin(LOGIN_ERROR_TYPES.SERVER_ERROR);
  }
};
