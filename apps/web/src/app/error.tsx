'use client';

import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button';

const ErrorBoundary = ({ reset }: { reset: () => void }) => {
  return (
    <main className="flex h-[100dvh] flex-col select-none">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h3 className="body-1 font-semibold text-neutral-1600">서버 연결에 실패했어요.</h3>
          <p className="body-3 whitespace-pre text-neutral-800">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 pt-3 pb-6">
        <Link href="/">
          <Button theme="orange">홈으로 가기</Button>
        </Link>
      </div>
    </main>
  );
};

export default ErrorBoundary;
