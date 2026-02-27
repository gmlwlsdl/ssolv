'use client';

import { useState } from 'react';

import ReviewModal from '@/components/ui/Modal/ReviewModal';

const SAMPLE_REVIEW =
  '음식 퀄리티가 굉장히 높았고, 특히 파스타 면의 탄력이 살아있어서 인상적이었습니다. 서비스도 친절했고 분위기도 아늑해서 다음에도 꼭 방문하고 싶습니다. 다만 주말 저녁에는 웨이팅이 길었던 점이 아쉬웠어요.';

type ModalState = { theme: 'light' | 'dark'; rating?: number } | null;

const ReviewModalStoryPage = () => {
  const [open, setOpen] = useState<ModalState>(null);

  const cases: { label: string; state: ModalState }[] = [
    { label: 'Light theme', state: { theme: 'light' } },
    { label: 'Light + Rating (4.5)', state: { theme: 'light', rating: 4.5 } },
    { label: 'Dark theme', state: { theme: 'dark' } },
    { label: 'Dark + Rating (5.0)', state: { theme: 'dark', rating: 5.0 } },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ReviewModal</h1>
      <p className="mb-8 body-3 text-neutral-700">
        리뷰 텍스트 + 별점 표시 모달. light / dark 테마 지원.
      </p>

      <div className="flex flex-col gap-3">
        {cases.map(({ label, state }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3"
          >
            <span className="label-2 font-medium text-neutral-900">{label}</span>
            <button
              onClick={() => setOpen(state)}
              className="rounded-lg bg-orange-500 px-4 py-2 label-2 font-semibold text-white"
            >
              열기
            </button>
          </div>
        ))}
      </div>

      {open !== null && (
        <ReviewModal
          isOpen
          theme={open.theme}
          reviewText={SAMPLE_REVIEW}
          rating={open.rating}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
};

export default ReviewModalStoryPage;
