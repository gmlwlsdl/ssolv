'use client';

import { useState } from 'react';

import ErrorModal from '@/components/ui/Modal/ErrorModal';
import { ERROR_CONFIG } from '@/data/constants/errorConfig';

type ErrorKey = keyof typeof ERROR_CONFIG;

const ERROR_KEYS = Object.keys(ERROR_CONFIG) as ErrorKey[];

const ErrorModalStoryPage = () => {
  const [openKey, setOpenKey] = useState<ErrorKey | null>(null);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ErrorModal</h1>
      <p className="mb-8 body-3 text-neutral-700">
        에러 코드별 모달. ERROR_CONFIG의 모든 케이스를 커버.
      </p>

      <div className="flex flex-col gap-3">
        {ERROR_KEYS.map((key) => {
          const cfg = ERROR_CONFIG[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="label-2 font-semibold text-neutral-900">{cfg.code}</span>
                <span className="label-2 text-neutral-600">{cfg.title}</span>
              </div>
              <button
                onClick={() => setOpenKey(key)}
                className="rounded-lg bg-orange-500 px-4 py-2 label-2 font-semibold text-white"
              >
                열기
              </button>
            </div>
          );
        })}
      </div>

      {openKey !== null && (
        <ErrorModal
          isOpen
          title={ERROR_CONFIG[openKey].title}
          message={ERROR_CONFIG[openKey].message}
          illustration={ERROR_CONFIG[openKey].illustration}
          onClose={() => setOpenKey(null)}
        />
      )}
    </div>
  );
};

export default ErrorModalStoryPage;
