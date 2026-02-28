'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/ui/Modal/ConfirmModal';

type ModalCase = {
  label: string;
  title: string;
  description?: string;
  illustration?: string;
  confirmText?: string;
  cancelText?: string;
  hasCancel: boolean;
};

const CASES: ModalCase[] = [
  {
    label: '확인만',
    title: '확인 버튼만 있는 모달',
    description: '취소 없이 확인만 가능한 케이스입니다.',
    hasCancel: false,
  },
  {
    label: '확인 + 취소',
    title: '정말 나가시겠어요?',
    description: '변경사항이 저장되지 않을 수 있습니다.',
    confirmText: '나가기',
    cancelText: '취소',
    hasCancel: true,
  },
  {
    label: '로그아웃',
    title: '로그아웃 하시겠어요?',
    confirmText: '로그아웃',
    cancelText: '취소',
    hasCancel: true,
  },
  {
    label: '회원탈퇴',
    title: '정말 탈퇴하시겠어요?',
    description: '탈퇴 시 모든 데이터가 삭제되며\n복구할 수 없습니다.',
    confirmText: '탈퇴하기',
    cancelText: '취소',
    hasCancel: true,
  },
  {
    label: '생성 취소',
    title: '모임 생성을 취소할까요?',
    description: '입력한 정보가 모두 사라져요.',
    confirmText: '취소하기',
    cancelText: '계속 만들기',
    hasCancel: true,
  },
];

const ConfirmModalStoryPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="p-6">
      <h1 className="mb-1 heading-4 font-bold text-neutral-1600">ConfirmModal</h1>
      <p className="mb-8 body-3 text-neutral-700">
        확인/취소 액션을 받는 공통 모달. 일러스트, 설명 텍스트 모두 optional.
      </p>

      <div className="flex flex-col gap-3">
        {CASES.map((c, i) => (
          <div
            key={c.label}
            className="flex items-center justify-between rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3"
          >
            <span className="label-2 font-medium text-neutral-900">{c.label}</span>
            <button
              onClick={() => setOpenIndex(i)}
              className="rounded-lg bg-orange-500 px-4 py-2 label-2 font-semibold text-white"
            >
              열기
            </button>
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <ConfirmModal
          isOpen
          title={CASES[openIndex].title}
          description={CASES[openIndex].description}
          illustration={CASES[openIndex].illustration}
          confirmText={CASES[openIndex].confirmText}
          cancelText={CASES[openIndex].cancelText}
          onConfirm={() => setOpenIndex(null)}
          onCancel={CASES[openIndex].hasCancel ? () => setOpenIndex(null) : undefined}
        />
      )}
    </div>
  );
};

export default ConfirmModalStoryPage;
