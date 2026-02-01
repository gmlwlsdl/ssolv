'use client';

import { withdraw } from '@/services/auth';

const WithdrawButton = () => {
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
      className="px-4 py-2 text-sm text-red-600 transition-colors hover:text-red-800"
    >
      회원탈퇴
    </button>
  );
};

export default WithdrawButton;
