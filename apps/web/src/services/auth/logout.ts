interface LogoutOptions {
  /** 로그아웃 전 실행할 정리 작업 (예: FCM 토큰 삭제). 실패해도 로그아웃은 진행됩니다. */
  onBeforeLogout?: () => Promise<void>;
}

/**
 * 로그아웃 처리
 *
 * @param options.onBeforeLogout - 로그아웃 전 실행할 정리 작업 (의존성 주입)
 *
 * @sideeffect 세션 쿠키 삭제, `/login`으로 리다이렉트
 */
export const logout = async ({ onBeforeLogout }: LogoutOptions = {}) => {
  if (typeof window === 'undefined') return;

  if (onBeforeLogout) {
    try {
      await onBeforeLogout();
    } catch {
      // 정리 실패해도 로그아웃 진행
    }
  }

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
