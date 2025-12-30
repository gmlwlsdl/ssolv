import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('로그아웃 처리 중 에러:', error);
    return NextResponse.json(
      { errorMessage: '로그아웃 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
