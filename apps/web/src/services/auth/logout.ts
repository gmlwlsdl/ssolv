import { FCM_TOKEN_STORAGE_KEY, deleteFcmToken } from '@/services/notification';

export const logout = async () => {
  if (typeof window === 'undefined') return;

  // 로그아웃 전 FCM 토큰 삭제
  const fcmToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  if (fcmToken) {
    try {
      await deleteFcmToken({ fcmToken });
    } catch {
      // FCM 토큰 삭제 실패해도 로그아웃 진행
    } finally {
      localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
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
