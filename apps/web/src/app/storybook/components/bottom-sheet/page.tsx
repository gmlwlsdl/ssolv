'use client';

import { useState } from 'react';

import BottomSheet from '@/components/ui/BottomSheet';

const BottomSheetStoryPage = () => {
  const [open, setOpen] = useState(false);
  const [showClose, setShowClose] = useState(true);
  const [title, setTitle] = useState('바텀시트 제목');

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">BottomSheet</h1>
      <p className="mb-6 body-3 text-neutral-700">
        하단에서 올라오는 시트. 90dvh 기본. 오버레이 클릭 또는 X 버튼으로 닫힘.
      </p>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-100 p-4">
        <label className="flex items-center gap-3">
          <span className="w-32 label-2 text-neutral-700">title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-2 py-1 label-2"
          />
        </label>
        <div className="flex items-center gap-3">
          <span className="w-32 label-2 text-neutral-700">showCloseButton</span>
          <button
            type="button"
            role="switch"
            aria-checked={showClose}
            onClick={() => setShowClose((v) => !v)}
            className={`relative h-6 w-10 rounded-full transition-colors ${showClose ? 'bg-orange-500' : 'bg-neutral-400'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${showClose ? 'left-[calc(100%-22px)]' : 'left-0.5'}`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        BottomSheet 열기
      </button>

      {open && (
        <BottomSheet title={title} showCloseButton={showClose} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3 py-2">
            <p className="body-3 text-neutral-1400">바텀시트 안에 들어오는 콘텐츠 영역입니다.</p>
            <p className="body-3 text-neutral-600">
              설문 내에서 추가 선택지나 안내 문구를 표시할 때 사용합니다.
            </p>
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

export default BottomSheetStoryPage;
