export const withdraw = async () => {
  if (typeof window === 'undefined') return;

  try {
    const response = await fetch('/api/auth/withdraw', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.errorMessage ?? '회원탈퇴 처리 중 오류가 발생했습니다');
    }

    const { redirectUrl } = await response.json();
    window.location.href = redirectUrl ?? '/login';
  } catch (error) {
    console.error('회원탈퇴 실패:', error instanceof Error ? error.message : '알 수 없는 에러');
    throw error;
  }
};
