'use client';

import { useRouter } from 'next/navigation';

import { ActionButton } from '@/app/_components';
import FloatingActionButton from '@/app/_components/FloatingActionButton';
import JoinMeetingModal from '@/app/_components/JoinMeetingModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { useDisclosure } from '@/hooks/useDisclosure';

interface HomeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const HomeMenu = ({ isOpen, onClose, onToggle }: HomeMenuProps) => {
  const { isOpen: showComingSoonMadal, handler: comingSoonModalHandler } = useDisclosure();
  const { isOpen: showJoinMeetingModal, handler: joinMeetingModalHandler } = useDisclosure();

  const router = useRouter();

  const handleCreateMeeting = () => {
    router.push('/meetings/create');
    onClose();
  };

  const handleJoinMeeting = () => {
    onClose();
    joinMeetingModalHandler.open();
  };

  const handleComingSoon = () => {
    onClose();
    comingSoonModalHandler.open();
  };

  return (
    <>
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-9 bg-black/70"
          aria-hidden="true"
        />
      )}
      {isOpen && (
        <div className="fixed right-5 bottom-30 z-99 flex flex-col items-end gap-4">
          <ActionButton
            icon="/icons/people.svg"
            label="모임 생성하기"
            onClick={handleCreateMeeting}
          />
          <ActionButton
            icon="/icons/arrow-green.svg"
            label="초대받은 모임 참여하기"
            onClick={handleJoinMeeting}
          />
          <ActionButton
            icon="/icons/arrow.svg"
            label="내 취향으로 추천 받기"
            onClick={handleComingSoon}
          />
        </div>
      )}
      <FloatingActionButton isOpen={isOpen} onClick={onToggle} />
      <JoinMeetingModal isOpen={showJoinMeetingModal} onClose={joinMeetingModalHandler.close} />
      <ConfirmModal
        isOpen={showComingSoonMadal}
        title="해당 서비스는 준비중이에요!"
        description="많은 기대 부탁드립니다!"
        illustration="/images/modal/modal-coming-soon.svg"
        confirmText="확인"
        onConfirm={comingSoonModalHandler.close}
      />
    </>
  );
};

export default HomeMenu;
