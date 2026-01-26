'use client';

import { useEffect, useMemo, useTransition } from 'react';

import { useParams, useRouter } from 'next/navigation';

import Button from '@/app/_components/ui/Button';
import Loading from '@/app/_components/ui/Loading';
import { useCountdownDisplay, useIsSurveyClosingSoon } from '@/app/_hooks/useCountdownDisplay';
import { MeetingOverview } from '@/app/_services/overview';
import useOverviewState from '@/app/events/[eventId]/overview/_hooks/useOverviewState';

const SurveyActionButton = ({ overview }: { overview: MeetingOverview }) => {
  const router = useRouter();
  const { eventId } = useParams();
  const [isPending, startTransition] = useTransition();

  const { hasParticipated } = useOverviewState(overview);
  const { isClosed: isSurveyClosed, totalParticipantCnt, endAt } = overview.meetingInfo;
  const isEveryoneCompleted = overview.participantList.length === totalParticipantCnt;

  const countdown = useCountdownDisplay(new Date(endAt));
  const isLessThanOneHour = useIsSurveyClosingSoon(new Date(endAt));

  const buttonState = useMemo(() => {
    if ((countdown === '종료됨' || isLessThanOneHour) && overview.participantList.length === 0) {
      return { label: '종료됨', path: null };
    }

    if (isSurveyClosed || isEveryoneCompleted || isLessThanOneHour) {
      return { label: '추천 결과 보기', path: `/events/${eventId}/analysis` };
    }

    return {
      label: (
        <>
          <span className="body-3 font-semibold text-white-alpha-5">설문 마감까지 </span>
          <span className="body-3 font-semibold">{countdown}</span>
        </>
      ),
      path: !hasParticipated ? `/meetings/${eventId}/survey` : null,
    };
  }, [hasParticipated, isSurveyClosed, isEveryoneCompleted, countdown, eventId, isLessThanOneHour]);

  const handleClick = () => {
    if (!buttonState.path) return;

    if (buttonState.path === `/events/${eventId}/analysis`) {
      startTransition(() => {
        router.push(`/events/${eventId}/analysis`);
      });
    } else {
      router.push(buttonState.path);
    }
  };

  useEffect(() => {
    if (isSurveyClosed || isEveryoneCompleted || isLessThanOneHour) {
      router.prefetch(`/events/${eventId}/analysis`);
    }
  }, [isSurveyClosed, isEveryoneCompleted, eventId, router, isLessThanOneHour]);

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
