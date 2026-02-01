'use client';

import { withdraw } from '@/services/auth';

export const WithdrawButton = () => {
  // TODO: 임시 UI
  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      '정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.'
    );

    if (!confirmed) return;

    try {
      await withdraw();
    } catch (error) {
      alert('탈퇴 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleWithdraw}
      className="rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
    >
      회원탈퇴
    </button>
  );
};

export default WithdrawButton;
