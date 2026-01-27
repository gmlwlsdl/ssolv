'use client';

import { useEffect, useMemo, useTransition } from 'react';

import { useParams, useRouter } from 'next/navigation';

import useOverviewState from '@/app/meetings/[id]/result/overview/_hooks/useOverviewState';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { useCountdownDisplay } from '@/hooks/useCountdownDisplay';
import { MeetingOverview } from '@/services/overview';

const SurveyActionButton = ({ overview }: { overview: MeetingOverview }) => {
  const router = useRouter();
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();

  const { hasParticipated } = useOverviewState(overview);
  const { isClosed: isSurveyClosed, totalParticipantCnt, endAt } = overview.meetingInfo;
  const isEveryoneCompleted = overview.participantList.length === totalParticipantCnt;

  const countdown = useCountdownDisplay(new Date(endAt));

  const buttonState = useMemo(() => {
    if (!hasParticipated) {
      return { label: '설문 참여하기', path: `/meetings/${id}/survey` };
    }

    if (isSurveyClosed || isEveryoneCompleted) {
      return { label: '추천 결과 보기', path: `/meetings/${id}/result/analysis` };
    }

    return {
      label: (
        <>
          <span className="body-3 font-semibold text-white-alpha-5">설문 마감까지 </span>
          <span className="body-3 font-semibold">{countdown}</span>
        </>
      ),
      path: !hasParticipated ? `/meetings/${id}/survey` : null,
    };
  }, [hasParticipated, isSurveyClosed, isEveryoneCompleted, countdown, id]);

  const handleClick = () => {
    if (!buttonState.path) return;

    if (buttonState.path === `/meetings/${id}/result/analysis`) {
      startTransition(() => {
        router.push(`/meetings/${id}/result/analysis`);
      });
    } else {
      router.push(buttonState.path);
    }
  };

  useEffect(() => {
    if (isSurveyClosed || isEveryoneCompleted) {
      router.prefetch(`/meetings/${id}/result/analysis`);
    }
  }, [isSurveyClosed, isEveryoneCompleted, id, router]);

  return (
    <>
      {isPending && <Loading />}

      <div className="sticky bottom-0 px-5 py-3">
        <Button onClick={handleClick} disabled={isPending} theme={'orange'}>
          <span className="body-3 font-semibold text-white">{buttonState.label}</span>
        </Button>
      </div>
    </>
  );
};

export default SurveyActionButton;
