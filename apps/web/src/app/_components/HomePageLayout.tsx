'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { HomeMenu } from '@/app/_components';
import { ErrorModal } from '@/components/ui/Modal';
import { getErrorConfig } from '@/data/constants/errorConfig';
import { useDisclosure } from '@/hooks/useDisclosure';

interface HomePageLayoutProps {
  children: React.ReactNode;
  errorCode?: string;
}

const HomePageLayout = ({ children, errorCode }: HomePageLayoutProps) => {
  const { isOpen: showErrorModal, handler: errorModalHandler } = useDisclosure();
  const { isOpen: showHomeMenu, handler: homeMenuHandler } = useDisclosure();

  const error = errorCode ? getErrorConfig(errorCode) : null;

  useEffect(() => {
    if (errorCode) {
      errorModalHandler.open();
      window.history.replaceState({}, '', '/');
    }
  }, [errorCode, errorModalHandler]);

  return (
    <div className="no-scrollbar flex h-[100dvh] flex-col overflow-auto bg-neutral-100">
      <ErrorModal
        isOpen={showErrorModal}
        title={error?.title ?? ''}
        message={error?.message ?? ''}
        onClose={errorModalHandler.close}
      />

      <header className="flex items-center justify-between px-5 pt-9 pb-2 select-none">
        <Image src="/images/ssolv-wordmark.svg" alt="솔브 작은 로고" width={81} height={32} />
        <Link href="/mypage" aria-label="마이페이지">
          <Image src="/icons/profile.svg" alt="프로필 아이콘" width={32} height={32} />
        </Link>
      </header>
      <main>{children}</main>

      <HomeMenu
        isOpen={showHomeMenu}
        onClose={homeMenuHandler.close}
        onToggle={homeMenuHandler.toggle}
      />
    </div>
  );
};

export default HomePageLayout;
