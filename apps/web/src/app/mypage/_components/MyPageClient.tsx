'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import TopNavigation from '@/components/layout/TopNavigation';
import { ConfirmModal, ErrorModal } from '@/components/ui/Modal';
import Toggle from '@/components/ui/Toggle';
import { UserProfile } from '@/data/models/member';
import { getNotificationSettingQueryOptions } from '@/data/queries/notificationQueries';
import { useDisclosure } from '@/hooks/useDisclosure';
import { logout, withdraw } from '@/services/auth';
import { updateNotificationSetting } from '@/services/notification';

const APP_VERSION = 'v1.0.0';
const SERVICE_EMAIL = 'ssolvofficial@gmail.com';

interface MyPageClientProps {
  profile: UserProfile;
}

/**
 * 마이페이지 클라이언트 컴포넌트
 *
 * @description 사용자 프로필, 알림 설정, 로그아웃, 회원탈퇴 등을 처리합니다.
 */
const MyPageClient = ({ profile }: MyPageClientProps) => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const { isOpen: showLogoutModal, handler: logoutModalHandler } = useDisclosure();
  const { isOpen: showWithdrawModal, handler: withdrawModalHandler } = useDisclosure();
  const { isOpen: showWithdrawErrorModal, handler: withdrawErrorModalHandler } = useDisclosure();

  const { data: notificationSetting } = useQuery({
    ...getNotificationSettingQueryOptions(),
  });

  useEffect(() => {
    if (notificationSetting !== undefined) {
      setNotificationEnabled(notificationSetting.notificationEnabled);
    }
  }, [notificationSetting]);

  /**
   * 알림 설정 토글 핸들러
   *
   * @description 낙관적 업데이트 후 API 호출, 실패 시 롤백합니다.
   * @param next - 변경할 알림 활성화 여부
   */
  const handleNotificationToggle = async (next: boolean) => {
    const prev = notificationEnabled;
    setNotificationEnabled(next);
    try {
      await updateNotificationSetting({ notificationEnabled: next });
    } catch (error) {
      setNotificationEnabled(prev);
      console.error('알림 설정 변경 실패:', error instanceof Error ? error.message : error);
    }
  };

  const handleLogout = async () => {
    logoutModalHandler.close();
    await logout();
  };

  const handleWithdraw = async () => {
    withdrawModalHandler.close();
    try {
      await withdraw();
    } catch {
      withdrawErrorModalHandler.open();
    }
  };

  return (
    <div className="no-scrollbar flex h-[100dvh] flex-col overflow-auto bg-neutral-100">
      {/* 상단 네비게이션 */}
      <TopNavigation
        title="마이페이지"
        showBackButton
        leftHref="/"
        leftAriaLabel="홈으로 돌아가기"
        className="bg-white text-neutral-800"
      />

      {/* 사용자 정보 */}
      <section className="flex flex-col gap-2 bg-white px-5 pt-[30px] pb-5">
        <p className="body-3 font-bold text-neutral-1500">{profile.nickname}</p>
        <p className="label-1 font-medium text-neutral-700">{profile.email}</p>
      </section>

      {/* 구분 영역 */}
      <div className="h-2" />

      {/* 설정 목록 */}
      <div className="bg-white">
        {/* 알림 설정 */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex w-full items-center justify-between border-b border-neutral-300 pb-5">
            <span className="body-3 font-medium text-neutral-1500">알림 설정</span>
            <Toggle
              checked={notificationEnabled}
              onChange={handleNotificationToggle}
              ariaLabel="알림 설정 토글"
            />
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex w-full items-center justify-between border-b border-neutral-300 pb-5">
            <span className="body-3 font-medium text-neutral-1500">버전 정보</span>
            <span className="label-1 font-medium text-neutral-600">{APP_VERSION}</span>
          </div>
        </div>

        {/* 서비스 문의 */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex w-full items-center justify-between border-b border-neutral-300 pb-5">
            <span className="body-3 font-medium text-neutral-1500">서비스 문의</span>
            <span className="label-1 font-medium text-neutral-600">{SERVICE_EMAIL}</span>
          </div>
        </div>

        {/* 개인정보 처리방침 */}
        <a
          href="/privacy"
          className="flex w-full cursor-pointer items-center justify-between px-5 pt-5"
        >
          <div className="flex w-full items-center border-b border-neutral-300 pb-5">
            <span className="body-3 font-medium text-neutral-1500">개인정보 처리방침</span>
          </div>
        </a>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={logoutModalHandler.open}
          className="flex w-full cursor-pointer items-center justify-between px-5 pt-5"
        >
          <div className="flex w-full items-center border-b border-neutral-300 pb-5">
            <span className="body-3 font-medium text-neutral-1500">로그아웃</span>
          </div>
        </button>

        {/* 회원탈퇴 */}
        <button
          type="button"
          onClick={withdrawModalHandler.open}
          className="flex w-full cursor-pointer items-center justify-between p-5"
        >
          <span className="body-3 font-medium text-neutral-1500">회원탈퇴</span>
        </button>
      </div>

      {/* 로그아웃 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="로그아웃 하시겠어요?"
        description={'로그아웃해도 해당 계정의 데이터는\n계속 저장되어 있습니다.'}
        confirmText="로그아웃"
        cancelText="취소"
        onConfirm={handleLogout}
        onCancel={logoutModalHandler.close}
      />

      {/* 회원탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={showWithdrawModal}
        title="정말 탈퇴하시겠어요?"
        description={'탈퇴 버튼 선택 시\n계정은 삭제되며 복구되지 않습니다.'}
        confirmText="탈퇴"
        cancelText="취소"
        onConfirm={handleWithdraw}
        onCancel={withdrawModalHandler.close}
      />

      {/* 회원탈퇴 실패 모달 */}
      <ErrorModal
        isOpen={showWithdrawErrorModal}
        title="탈퇴 처리 중 오류가 발생했어요"
        message="잠시 후 다시 시도해주세요."
        illustration="/images/modal/modal-error.svg"
        onClose={withdrawErrorModalHandler.close}
      />
    </div>
  );
};

export default MyPageClient;
