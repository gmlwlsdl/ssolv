import { Suspense } from 'react';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { validateTokenAndJoin } from '@/app/meetings/[token]/result/_utils/meetingValidation';
import OverviewSkeleton from '@/app/meetings/[token]/result/overview/_components/Skeleton';
import OverviewClient from '@/app/meetings/[token]/result/overview/OverviewClient';
import { ApiError } from '@/data/models/api';
import { getOverviewQueryOptions } from '@/data/queries/overviewQueries';
import { MeetingOverview } from '@/services/overview';
import { isAccessDenied } from '@/utils/errorGuards';

interface OverviewPageProps {
  params: Promise<{ token: string }>;
}

const OverviewPageContent = async ({ params }: OverviewPageProps) => {
  const queryClient = new QueryClient();

  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken);

  await validateTokenAndJoin(token); // TODO: 초대 토큰 검증 및 모임 참여 처리

  let apiError: ApiError | null = null;

  try {
    await queryClient.fetchQuery<MeetingOverview, ApiError>({
      ...getOverviewQueryOptions(token),
    });
  } catch (error) {
    apiError = error as ApiError;
  }

  if (apiError) {
    if (isAccessDenied(apiError)) {
      return redirect(`/?error=${apiError.code}`);
    } // TODO: 접근 불가 에러는 홈으로 리다이렉트

    return redirect('/'); // TODO: 기타 에러는 홈으로 리다이렉트
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OverviewClient />
    </HydrationBoundary>
  );
};

const OverviewPage = async ({ params }: OverviewPageProps) => {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewPageContent params={params} />
    </Suspense>
  );
};
export default OverviewPage;
