'use client';

import { useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import LoginButton from '@/app/login/_components/LoginButton';
import ReviewLoginButton from '@/app/login/_components/ReviewLoginButton';

import type { Provider } from '@/app/login/_components/LoginButton';

const TAP_THRESHOLD = 7;
const TAP_RESET_MS = 2500;

interface LoginContentProps {
  redirectTo?: string;
  lastProvider?: Provider;
  isReviewEnabled: boolean;
}

const LoginClient = ({ redirectTo, lastProvider, isReviewEnabled }: LoginContentProps) => {
  const [isReviewMode, setIsReviewMode] = useState(false);
  const tapCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = useCallback(() => {
    if (!isReviewEnabled || isReviewMode) return;

    tapCountRef.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (tapCountRef.current >= TAP_THRESHOLD) {
      tapCountRef.current = 0;
      setIsReviewMode(true);
      return;
    }

    timerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_RESET_MS);
  }, [isReviewEnabled, isReviewMode]);

  return (
    <>
      <div className="flex w-full max-w-[375px] flex-1 items-center justify-center">
        <main className="flex flex-col items-center gap-4">
          <div role="presentation" onClick={handleLogoTap} onKeyDown={handleLogoTap}>
            <Image
              src="/images/brand/solv-wordmark.svg"
              alt="Solv 워드마크 아이콘"
              width={219}
              height={73}
              priority
            />
          </div>
          <p className="body-3 text-neutral-1200">바로 추천받는 우리 모임의 식당</p>
        </main>
      </div>

      <div className="flex w-full flex-col gap-3 px-5 pb-14">
        {isReviewMode && <ReviewLoginButton />}
        <LoginButton
          provider="kakao"
          redirectTo={redirectTo}
          isLastUsed={lastProvider === 'kakao'}
        />
        <LoginButton
          provider="apple"
          redirectTo={redirectTo}
          isLastUsed={lastProvider === 'apple'}
        />
      </div>
    </>
  );
};

export default LoginClient;
