import { api } from '@/lib/api';

export const withdraw = async () => {
  if (typeof window === 'undefined') return;

  try {
    await api.delete('/api/v1/auth/withdraw');
  } catch (error) {
    console.error('회원탈퇴 중 에러:', error);
    throw error;
  } finally {
    window.location.href = '/login';
  }
};
