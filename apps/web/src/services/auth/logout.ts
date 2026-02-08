export const logout = async () => {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('로그아웃 중 에러:', error instanceof Error ? error.message : '알 수 없는 에러');
  } finally {
    window.location.href = '/login';
  }
};
