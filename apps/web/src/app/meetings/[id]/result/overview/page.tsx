import { Suspense } from 'react';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { validateTokenAndJoin } from '@/app/meetings/[id]/result/_utils/meetingValidation';
import OverviewSkeleton from '@/app/meetings/[id]/result/overview/_components/Skeleton';
import OverviewClient from '@/app/meetings/[id]/result/overview/OverviewClient';
import { ApiError } from '@/data/models/api';
import { getOverviewQueryOptions } from '@/data/queries/overviewQueries';
import { MeetingOverview } from '@/services/overview';
import { isAccessDenied } from '@/utils/errorGuards';

interface OverviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

const OverviewPageContent = async ({ params, searchParams }: OverviewPageProps) => {
  const queryClient = new QueryClient();

  const { id } = await params;
  const { token } = await searchParams;

  if (token) {
    await validateTokenAndJoin(id, token);
  } // TODO: 초대 토큰 검증 및 모임 참여 처리

  let apiError: ApiError | null = null;

  try {
    await queryClient.fetchQuery<MeetingOverview, ApiError>({
      ...getOverviewQueryOptions(Number(id)),
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

const OverviewPage = async ({ params, searchParams }: OverviewPageProps) => {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
};
export default OverviewPage;
