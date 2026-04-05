import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL!;

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ errorMessage: '인증 토큰이 없습니다' }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_API}/auth/withdraw`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('회원탈퇴 백엔드 응답 실패:', response.status);
      return NextResponse.json(
        { errorMessage: '회원탈퇴 처리 중 오류가 발생했습니다' },
        { status: response.status }
      );
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('lastLoginProvider');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('회원탈퇴 처리 중 에러:', error);
    return NextResponse.json(
      { errorMessage: '회원탈퇴 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
