'use client';

import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  // TODO: 임시 UI
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // 쿠키 삭제 확인 및 UI 갱신을 위해 새로고침
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 z-50 rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
    >
      로그아웃
    </button>
  );
};
