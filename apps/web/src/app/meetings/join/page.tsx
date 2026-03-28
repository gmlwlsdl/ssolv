'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import CreatePageLayout from '@/app/meetings/create/_components/CreatePageLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const extractMeetingToken = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const urlMatch = trimmed.match(/\/meetings\/([^/?#]+)/);
  if (urlMatch) return urlMatch[1];

  return trimmed;
};

const JoinMeetingPage = () => {
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
    <CreatePageLayout
      badge="모임 참여하기"
      badgeVariant="orange"
      heading={`초대받은 모임의 링크를 입력하여\n모임에 합류할 수 있어요.`}
      onBack={() => router.back()}
    >
      <div className="pb-safe-bottom flex flex-1 flex-col justify-between pb-6">
        <div className="flex flex-col gap-2">
          <p className="label-2 font-medium text-neutral-800">초대받은 모임 링크</p>
          <Input
            value={link}
            onChange={handleChange}
            onClear={handleClear}
            placeholder="https://www.ssolv.site/"
            hasError={hasError}
            errorMessage="올바른 모임 링크를 입력해주세요"
          />
        </div>
        <Button
          className="w-full py-[14px]"
          status={isEmpty ? 'disabled' : 'normal'}
          onClick={handleConfirm}
        >
          모임 참여하기
        </Button>
      </div>
    </CreatePageLayout>
  );
};

export default JoinMeetingPage;
