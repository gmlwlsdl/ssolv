'use client';

import { useEffect } from 'react';

import Image from 'next/image';

import { HomeMenu } from '@/app/_components';
import { ErrorModal } from '@/components/ui/Modal';
import ComingSoonModal from '@/components/ui/Modal/ComingSoonModal';
import { getErrorConfig } from '@/data/constants/errorConfig';
import { useDisclosure } from '@/hooks/useDisclosure';
import { logout, withdraw } from '@/services/auth';

interface HomePageLayoutProps {
  children: React.ReactNode;
  errorCode?: string;
}

const HomePageLayout = ({ children, errorCode }: HomePageLayoutProps) => {
  const { isOpen: showErrorModal, handler: errorModalHandler } = useDisclosure();
  const { isOpen: showComingSoonMadal, handler: comingSoonModalHandler } = useDisclosure();
  const { isOpen: showHomeMenu, handler: homeMenuHandler } = useDisclosure();

  const error = errorCode ? getErrorConfig(errorCode) : null;

  useEffect(() => {
    if (errorCode) {
      errorModalHandler.open();
      window.history.replaceState({}, '', '/');
    }
  }, [errorCode, errorModalHandler]);

  const handleWithdraw = async () => {
    // TODO: 임시 confirm API 제거 필요
    const confirmed = confirm(
      '정말 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.'
    );

    if (!confirmed) return;

    try {
      await withdraw();
    } catch (error) {
      alert('탈퇴 처리 중 오류가 발생했습니다.');
      console.error('회원탈퇴 실패:', error instanceof Error ? error.message : '알 수 없는 에러');
    }
  };

  return (
    <div className="no-scrollbar flex h-[100dvh] flex-col overflow-auto bg-neutral-100">
      <ErrorModal
        isOpen={showErrorModal}
        title={error?.title ?? ''}
        message={error?.message ?? ''}
        onClose={errorModalHandler.close}
      />
      <ComingSoonModal isOpen={showComingSoonMadal} onClose={comingSoonModalHandler.close} />

      <button
        onClick={logout}
        className="absolute top-4 right-4 z-50 rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
      >
        로그아웃
      </button>
      <button
        onClick={handleWithdraw}
        className="absolute top-4 right-24 z-50 rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
      >
        회원탈퇴
      </button>

      <header className="flex items-center justify-between px-5 pt-9 pb-2 select-none">
        <Image src="/images/ssolv-wordmark.svg" alt="솔브 작은 로고" width={81} height={32} />
        <button onClick={comingSoonModalHandler.open} className="cursor-pointer">
          <Image src="/icons/profile.svg" alt="프로필 아이콘" width={32} height={32} />
        </button>
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
