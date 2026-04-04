'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';

const ReviewLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleReviewLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // TODO: 앱 심사용 로그인 API 구현 예정
      await fetch('/api/auth/review', { method: 'POST' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReviewLogin}
      disabled={isLoading}
      className={cn(
        'flex h-[62px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-red-500 body-3 font-semibold text-white transition-all duration-200',
        isLoading && 'cursor-not-allowed opacity-60'
      )}
    >
      {isLoading ? 'Loading...' : 'Enter Review Mode'}
    </button>
  );
};

export default ReviewLoginButton;
