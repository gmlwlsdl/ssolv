'use client';

import { useState } from 'react';

import ChipGroupMultiSelect from '@/app/meetings/[token]/survey/_components/ui/ChipGroupMultiSelect';

import type { ChipOption } from '@/app/meetings/[token]/survey/_components/ui/ChipGroupMultiSelect';

const CUISINE_OPTIONS: ChipOption[] = [
  { id: 'any', label: '다 괜찮아요', variant: 'any' },
  { id: 'korean', label: '한식', variant: 'cuisine' },
  { id: 'japanese', label: '일식', variant: 'cuisine' },
  { id: 'western', label: '양식', variant: 'cuisine' },
  { id: 'chinese', label: '중식', variant: 'cuisine' },
  { id: 'bunsik', label: '분식', variant: 'cuisine' },
  { id: 'vietnamese', label: '베트남 음식', variant: 'cuisine' },
  { id: 'mexican', label: '멕시칸', variant: 'cuisine' },
  { id: 'indian', label: '인도 음식', variant: 'cuisine' },
  { id: 'southeast', label: '기타 해외 음식', variant: 'cuisine' },
];

const EXCLUSIVE_IDS = ['any'] as const;

const ChipGroupStoryPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedIdsSurvey, setSelectedIdsSurvey] = useState<string[]>(['korean']);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ChipGroupMultiSelect</h1>
      <p className="mb-8 body-3 text-neutral-700">
        음식 취향 선택 그룹. 최대 5개 선택 / &apos;다 괜찮아요&apos;는 단독 배타 선택.
      </p>

      <div className="flex flex-col gap-10">
        {/* Empty state */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">Default (empty)</p>
          <ChipGroupMultiSelect
            options={CUISINE_OPTIONS}
            selectedIds={selectedIds}
            exclusiveIds={EXCLUSIVE_IDS}
            onChange={setSelectedIds}
          />
          <p className="mt-3 label-2 text-neutral-500">
            선택됨: {selectedIds.length > 0 ? selectedIds.join(', ') : '없음'}
          </p>
        </div>

        {/* Pre-selected */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">
            With pre-selection (unselectedVariant: survey)
          </p>
          <ChipGroupMultiSelect
            options={CUISINE_OPTIONS}
            selectedIds={selectedIdsSurvey}
            exclusiveIds={EXCLUSIVE_IDS}
            onChange={setSelectedIdsSurvey}
            unselectedVariant="survey"
          />
          <p className="mt-3 label-2 text-neutral-500">
            선택됨: {selectedIdsSurvey.length > 0 ? selectedIdsSurvey.join(', ') : '없음'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChipGroupStoryPage;
