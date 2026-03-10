'use client';

import { useState } from 'react';

import Loading from '@/components/ui/Loading';

const LoadingStoryPage = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">Loading</h1>
      <p className="mb-4 body-3 text-neutral-700">
        전체 화면 Fixed 오버레이 로딩 스피너. 아래 버튼으로 미리보기.
      </p>

      <div className="mb-6 rounded-xl border border-neutral-300 bg-neutral-100 p-4">
        <p className="label-2 text-neutral-600">
          컴포넌트:{' '}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-[11px]">{'<Loading />'}</code>
        </p>
        <p className="mt-1 label-2 text-neutral-600">Props: 없음 (standalone)</p>
      </div>

      <button
        onClick={() => setShow(true)}
        className="rounded-xl bg-orange-500 px-6 py-3 body-3 font-semibold text-white"
      >
        Loading 오버레이 열기
      </button>

      {show && (
        <button
          type="button"
          onClick={() => setShow(false)}
          className="cursor-pointer"
          aria-label="로딩 닫기"
        >
          <Loading />
          <p className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-white px-4 py-2 label-2 shadow-lg">
            클릭하면 닫힙니다
          </p>
        </button>
      )}
    </div>
  );
};

export default LoadingStoryPage;
