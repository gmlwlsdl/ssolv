import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;

export const POST = async () => {
  try {
    const response = await fetch(`${BACKEND_API}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'demo-login 실패' }, { status: response.status });
    }

    const body = await response.json();
    const { accessToken, refreshToken, userProfile } = body?.data ?? {};

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: '토큰이 응답에 없습니다' }, { status: 500 });
    }

    const cookieStore = await cookies();

    if (userProfile) {
      cookieStore.set('userProfile', JSON.stringify(userProfile), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 604800,
      });
    }

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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
};
