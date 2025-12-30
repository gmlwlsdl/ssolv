'use client';

import { useState } from 'react';

import { Pencil } from 'lucide-react';
import Image from 'next/image';

import { AVATAR_OPTIONS } from '@/app/survey/_models/avatarOptions';

import ProfileSelectModal from './ProfileSelectModal';

interface ProfileSelectorProps {
  value?: string;
  onChange: (avatar: string) => void;
  lockedKeys?: string[];
}

/**
 * ProfileSelector
 * - 프로필 이미지 클릭 + 수정 버튼 클릭 → 모두 모달 열기
 */
const ProfileSelector = ({
  value = 'default',
  onChange,
  lockedKeys = [],
}: ProfileSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selected = AVATAR_OPTIONS.find((a) => a.key === value) ?? AVATAR_OPTIONS[0];

  const openModal = () => setIsModalOpen(true);

  return (
    <div className="flex w-full justify-center py-5">
      {/* 프로필 전체 클릭 가능 */}
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        className="relative flex cursor-pointer items-center justify-center rounded-full p-5 transition-all hover:opacity-90"
        style={{ backgroundColor: selected.bgColor, width: 100, height: 100 }}
      >
        <Image src={selected.src} alt={selected.key} width={60} height={60} />

        {/* 수정 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 프로필 div의 클릭 이벤트 버블링 방지
            openModal();
          }}
          className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#686F7A] hover:opacity-80"
        >
          <Pencil size={16} color="white" />
        </button>
      </div>

      {/* 프로필 선택 모달 */}
      {isModalOpen && (
        <ProfileSelectModal
          open={isModalOpen}
          lockedKeys={lockedKeys}
          onClose={() => setIsModalOpen(false)}
          onSelect={(key) => {
            onChange(key);
            setIsModalOpen(false);
          }}
          selectedKey={value}
        />
      )}
    </div>
  );
};

export default ProfileSelector;
