import { api } from '@/lib/api';

export const withdraw = async () => {
  if (typeof window === 'undefined') return;

  try {
    await api.delete('/auth/withdraw');
    window.location.href = '/login';
  } catch (error) {
    console.error('회원탈퇴 실패:', error instanceof Error ? error.message : '알 수 없는 에러');
    throw error;
  }
};
