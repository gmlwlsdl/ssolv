'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseModal from '@/components/ui/Modal/BaseModal';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const extractMeetingToken = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Full URL: .../meetings/TOKEN/... 형태에서 token 추출
  const urlMatch = trimmed.match(/\/meetings\/([^/?#]+)/);
  if (urlMatch) return urlMatch[1];

  // 그 외 입력은 token 자체로 간주
  return trimmed;
};

const JoinMeetingModal = ({ isOpen, onClose }: JoinMeetingModalProps) => {
  const [link, setLink] = useState('');
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    const token = extractMeetingToken(link);
    if (!token) {
      setHasError(true);
      return;
    }
    router.push(`/meetings/${token}/result/overview`);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setLink('');
    setHasError(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    if (hasError) setHasError(false);
  };

  const handleClear = () => {
    setLink('');
    if (hasError) setHasError(false);
  };

  const isEmpty = !link.trim();

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} showCloseButton>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="body-2 font-semibold text-neutral-1600">초대받은 모임 참여하기</h3>
          <p className="body-3 font-medium text-neutral-800">모임 링크를 붙여넣어 주세요</p>
        </div>
        <Input
          value={link}
          onChange={handleChange}
          onClear={handleClear}
          placeholder="모임 링크 붙여넣기"
          hasError={hasError}
          errorMessage="올바른 모임 링크를 입력해주세요"
        />
        <div className="flex gap-[11px]">
          <Button theme="gray" className="flex-1 py-[14px]" onClick={handleClose}>
            취소
          </Button>
          <Button
            className="flex-1 py-[14px]"
            status={isEmpty ? 'disabled' : 'normal'}
            onClick={handleConfirm}
          >
            참여하기
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default JoinMeetingModal;
