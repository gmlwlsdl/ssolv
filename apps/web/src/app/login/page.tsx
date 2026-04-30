import { cookies } from 'next/headers';

import LoginClient from '@/app/login/_components/LoginClient';
import LoginErrorModal from '@/app/login/_components/LoginErrorModal';

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
      <LoginClient
        redirectTo={redirectTo}
        lastProvider={lastProvider}
        isReviewEnabled={process.env.ENABLE_DEMO_LOGIN === 'true'}
      />
      {error && <LoginErrorModal errorType={error} />}
    </div>
  );
};

export default LoginPage;
