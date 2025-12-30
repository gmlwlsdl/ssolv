import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getOverview } from '@/app/_services/overview';

export const overviewQueryKeys = createQueryKeys('overview', {
  getOverview: (eventId: number) => [eventId],
});

export const getOverviewQueryOptions = (eventId: number) => ({
  queryKey: overviewQueryKeys.getOverview(eventId).queryKey,
  queryFn: () => getOverview(eventId),
});
