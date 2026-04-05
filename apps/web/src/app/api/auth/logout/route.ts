import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { api } from '@/lib/api/fetchWithToken';

export async function POST() {
  try {
    const cookieStore = await cookies();

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('백엔드 로그아웃 요청 실패:', error);
      // 백엔드 요청 실패시에도 클라이언트 로그아웃은 계속 진행
    }

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
