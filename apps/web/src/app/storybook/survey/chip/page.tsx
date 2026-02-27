'use client';

import { useState } from 'react';

import Chip from '@/app/meetings/[token]/survey/_components/ui/Chip';

const ChipStoryPage = () => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Chip</h1>
      <p className="mb-8 body-3 text-neutral-700">
        설문에서 선택지를 나타내는 칩. selected / disabled / orderBadge 상태 지원.
      </p>

      <div className="flex flex-col gap-8">
        {/* Interactive */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">Interactive</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              label="한식"
              selected={selected}
              onClick={() => setSelected((v) => !v)}
              orderBadge={selected ? 1 : 0}
            />
          </div>
          <p className="mt-2 label-2 text-neutral-500">클릭하여 선택/해제 전환</p>
        </div>

        {/* States */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">States</p>
          <div className="flex flex-wrap gap-2">
            <Chip label="Unselected" selected={false} onClick={() => {}} />
            <Chip label="Selected" selected onClick={() => {}} />
            <Chip label="With Badge" selected orderBadge={2} onClick={() => {}} />
            <Chip label="Disabled" disabled onClick={() => {}} />
          </div>
        </div>

        {/* Variants */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">Variant: any</p>
          <div className="flex flex-wrap gap-2">
            <Chip label="다 괜찮아요" variant="any" selected={false} onClick={() => {}} />
            <Chip label="다 괜찮아요" variant="any" selected onClick={() => {}} />
          </div>
        </div>

        {/* unselectedVariant */}
        <div>
          <p className="mb-3 label-1 font-semibold text-neutral-700">unselectedVariant: survey</p>
          <div className="flex flex-wrap gap-2">
            <Chip
              label="설문 스타일"
              selected={false}
              unselectedVariant="survey"
              onClick={() => {}}
            />
            <Chip
              label="설문 스타일 (선택됨)"
              selected
              unselectedVariant="survey"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChipStoryPage;
