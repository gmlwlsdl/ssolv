'use client';

import useCopyClipBoard from '@/app/meetings/[token]/result/_hooks/useCopyClipBoard';

const InviteTopButton = () => {
  const { handleShareKakao } = useCopyClipBoard();

  return (
    <button
      type="button"
      onClick={handleShareKakao}
      className="cursor-pointer label-1 font-semibold text-neutral-800"
    >
      초대하기
    </button>
  );
};

export default InviteTopButton;
