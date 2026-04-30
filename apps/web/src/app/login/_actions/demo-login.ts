'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;

export const demoLogin = async () => {
  if (process.env.ENABLE_DEMO_LOGIN !== 'true') {
    throw new Error('Demo login not available');
  }

  const response = await fetch(`${BACKEND_API}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Demo login failed');
  }

  const body = await response.json();
  const { accessToken, refreshToken, userProfile } = body?.data ?? {};

  if (!accessToken || !refreshToken) {
    throw new Error('토큰이 응답에 없습니다');
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

  redirect('/');
};
