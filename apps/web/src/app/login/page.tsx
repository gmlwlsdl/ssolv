import Image from 'next/image';

import LoginButton from '@/app/login/_components/LoginButton';

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ redirectTo?: string }> }) => {
  const { redirectTo } = await searchParams;

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center px-5 gathering-card">
      <main className="flex flex-col justify-between gap-6 pt-15 pb-10">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={'/images/momuzzi-wordmark.svg'}
            alt="모무찌 워드마크 아이콘"
            width={174}
            height={74}
            priority
          />
          <p className="body-3 text-neutral-1200">바로 추천받는 우리 모임의 식당</p>
        </div>

        <Image
          src={'/images/momuzzi-group.svg'}
          alt="모무찌 그룹 아이콘"
          width={240}
          height={262}
          priority
        />
      </main>

      <LoginButton redirectTo={redirectTo} />
    </div>
  );
};

export default LoginPage;
