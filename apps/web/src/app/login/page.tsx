import { cookies } from 'next/headers';
import Image from 'next/image';

import LoginButton from '@/app/login/_components/LoginButton';
import LoginErrorModal from '@/app/login/_components/LoginErrorModal';
import ReviewLoginButton from '@/app/login/_components/ReviewLoginButton';

import type { Provider } from '@/app/login/_components/LoginButton';

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) => {
  const { redirectTo, error } = await searchParams;
  const cookieStore = await cookies();
  const lastProvider = cookieStore.get('lastLoginProvider')?.value as Provider | undefined;

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center gathering-card">
      <div className="flex w-full max-w-[375px] flex-1 items-center justify-center">
        <main className="flex flex-col items-center gap-4">
          <Image
            src={'/images/brand/solv-wordmark.svg'}
            alt="Solv 워드마크 아이콘"
            width={219}
            height={73}
            priority
          />
          <p className="body-3 text-neutral-1200">바로 추천받는 우리 모임의 식당</p>
        </main>
      </div>

      <div className="flex w-full flex-col gap-3 px-5 pb-14">
        <ReviewLoginButton />
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

      {error && <LoginErrorModal errorType={error} />}
    </div>
  );
};

export default LoginPage;
