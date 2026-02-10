import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { api } from '@/lib/api/fetchWithToken';

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    await api.delete('/auth/withdraw');

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('회원탈퇴 처리 중 에러:', error);
    return NextResponse.json(
      { errorMessage: '회원탈퇴 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
