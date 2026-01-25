'use client';

import { useMemo } from 'react';

import { cn } from '@/app/_lib/cn';
import { MeetingOverview } from '@/app/_services/overview';
import useOverviewState from '@/app/events/[eventId]/overview/_hooks/useOverviewState';

interface SurveyStatusBannerProps {
  overview: MeetingOverview;
}

const SurveyStatusBanner = ({ overview }: SurveyStatusBannerProps) => {
  const { isEveryoneCompleted } = useOverviewState(overview);

  const isSurveyClosed = overview.meetingInfo.isClosed;

  const label = useMemo(() => {
    if (isSurveyClosed) return { label: '설문 기간이 종료됐어요', className: 'text-neutral-1400' };

    if (isEveryoneCompleted)
      return { label: '모두 설문을 완료했어요', className: 'text-neutral-1400' };

    return { label: '취향 설문 진행 중이에요', className: 'type-gradient' };
  }, [isSurveyClosed, isEveryoneCompleted]);

  return <p className={cn('heading-2 font-bold', label.className)}>{label.label}</p>;
};

export default SurveyStatusBanner;
