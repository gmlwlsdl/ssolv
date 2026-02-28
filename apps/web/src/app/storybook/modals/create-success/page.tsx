'use client';

import { useState } from 'react';

import CreateMeetingSuccessModal from '@/components/ui/Modal/CreateMeetingSuccessModal';

const CreateSuccessModalStoryPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">CreateMeetingSuccessModal</h1>
      <p className="mb-8 body-3 text-neutral-700">
        모임 생성 완료 후 표시. 카카오톡 공유 / URL 복사 액션 포함.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        모달 열기
      </button>

      <CreateMeetingSuccessModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CreateSuccessModalStoryPage;
