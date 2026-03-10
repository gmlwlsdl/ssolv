'use client';

import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button';

const ErrorBoundary = ({ reset: _ }: { reset: () => void }) => {
  return (
    <main className="flex h-[100dvh] flex-col select-none">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5">
        <Image src="/images/error-page.svg" alt="" width={100} height={100} />
        <div className="flex w-full flex-col gap-1 text-center">
          <h3 className="body-1 font-semibold text-neutral-1600">서버 연결에 실패했어요</h3>
          <p className="body-3 font-medium text-neutral-800">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
      <div className="px-5 pt-3 pb-6">
        <Link href="/">
          <Button className="w-full py-[14px]">홈으로 가기</Button>
        </Link>
      </div>
    </main>
  );
};

export default ErrorBoundary;
