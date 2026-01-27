'use client';

import { Copy } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import useCopyClipBoard from '@/app/meetings/[id]/result/_hooks/useCopyClipBoard';
import { cn } from '@/lib/cn';

interface PersonaEmptyCardProps {
  className?: string;
}

const PersonaEmptyCard = ({ className }: PersonaEmptyCardProps) => {
  const { id } = useParams();
  const { handleCopyUrl, handleShareKakao } = useCopyClipBoard({ meetingId: Number(id) || 0 });

  return (
    <div
      data-id="empty-card"
      className={cn(
        'flex w-11/12 shrink-0 flex-col items-center rounded-[1.25rem] bg-white px-5 pt-4',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <div className="px-4 py-6">
          <Image
            src={'/images/overview-loveletter.svg'}
            alt="참여 독려를 위한 하트 편지 아이콘"
            width={63.94}
            height={50.11}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-center subheading-1 font-bold whitespace-pre-line text-neutral-1600">
            {`아직 참여하지 않은 \n 멤버가 있나요?`}
          </p>
          <p className="text-center label-2 font-medium whitespace-pre-line text-neutral-1400">
            {`더 많은 멤버가 취향 설문에 참여하도록\n 지금 링크를 공유해보세요!`}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-row items-center gap-4">
        <button
          type="button"
          className="flex w-23 cursor-pointer flex-col items-center gap-3 py-8"
          onClick={handleShareKakao}
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#FEE500]">
            <Image src={'/icons/kakao-icon.svg'} alt="kakao-icon" width={28} height={28} />
          </div>
          <span className="label-1 font-medium text-neutral-1000">카카오톡</span>
        </button>
        <button
          type="button"
          className="flex w-23 cursor-pointer flex-col items-center gap-3 py-3"
          onClick={handleCopyUrl}
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-neutral-200">
            <Copy className="h-7 w-7 text-neutral-1300" strokeWidth={1.73} absoluteStrokeWidth />
          </div>
          <span className="label-1 font-medium text-neutral-1000">URL 복사</span>
        </button>
      </div>
    </div>
  );
};

export default PersonaEmptyCard;
