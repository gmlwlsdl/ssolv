'use client';

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import PersonaCardSwiper from '@/app/meetings/[id]/result/overview/_components/persona/PersonaCardSwiper';
import OverviewSkeleton from '@/app/meetings/[id]/result/overview/_components/Skeleton';
import SurveyActionButton from '@/app/meetings/[id]/result/overview/_components/SurveyActionButton';
import SurveyStatusBanner from '@/app/meetings/[id]/result/overview/_components/SurveyStatusBanner';
import CreateMeetingSuccessModal from '@/components/ui/Modal/CreateMeetingSuccessModal';
import ParticipantProgressIndicator from '@/components/ui/ParticipantProgressIndicator';
import { ApiError } from '@/data/models/api';
import { getOverviewQueryOptions } from '@/data/queries/overviewQueries';
import { useDisclosure } from '@/hooks/useDisclosure';
import { MeetingOverview } from '@/services/overview';

const OverviewClient = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { id } = params;
  const created = searchParams.get('created');
  const token = searchParams.get('token');

  const { isOpen: modalOpen, handler: modalHandler } = useDisclosure();

  const {
    data: overview,
    isPending,
    error,
  } = useQuery<MeetingOverview, ApiError>({
    ...getOverviewQueryOptions(Number(id)),
    retry: false,
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (created) {
      modalHandler.open();
      router.replace(`/meetings/${id}/overview?token=${token}`);
    }
  }, [created, id, router, token, modalHandler]);

  if (isPending) return <OverviewSkeleton />;
  if (error) {
    throw error;
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="flex w-full flex-col items-center gap-3 px-5 py-4">
          <SurveyStatusBanner overview={overview} />
          <div className="flex w-full px-4">
            <ParticipantProgressIndicator
              surveyCompletedParticipants={overview.participantList.length}
              totalParticipants={overview.meetingInfo.totalParticipantCnt}
              isSurveyClosed={overview.meetingInfo.isClosed}
              className="w-full pt-10"
            />
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col">
          <PersonaCardSwiper overview={overview} />
        </div>
        <SurveyActionButton overview={overview} />
      </div>
      <CreateMeetingSuccessModal isOpen={modalOpen} onClose={modalHandler.close} />
    </>
  );
};

export default OverviewClient;
