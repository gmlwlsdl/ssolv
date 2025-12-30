import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;

/**
 * 카카오 OAuth 콜백 처리
 * - 클라이언트에게 파라미터로 code를 받아 백엔드에 전달
 * - 백엔드로부터 받은 토큰을 httpOnly 쿠키로 설정
 * - 클라이언트로 httpOnly 쿠키 전송 (Set-Cookies)
 */

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const redirectUrl = searchParams.get('redirect_uri');

  if (!code) {
    return NextResponse.json({ errorMessage: 'code 파라미터가 없습니다' }, { status: 400 });
  }

  if (!redirectUrl) {
    return NextResponse.json({ errorMessage: 'redirect_uri 파라미터가 없습니다' }, { status: 400 });
  }

  try {
    const url = new URL(`${BACKEND_API}/auth/kakao-login`);
    url.searchParams.set('code', code);
    url.searchParams.set('redirect_uri', redirectUrl);

    const response = await fetch(String(url), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error('백엔드 에러 응답:', errorText);
      return NextResponse.json(
        { error: '백엔드 인증에 실패했습니다', details: errorText },
        { status: response.status }
      );
    }

    const { data: { accessToken, refreshToken } = {} } = await response.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { errorMessage: '토큰이 응답에 포함되지 않았습니다' },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 로컬 환경: http
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('카카오 로그인 처리 중 에러:', error);
    return NextResponse.json(
      { errorMessage: '로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
};
