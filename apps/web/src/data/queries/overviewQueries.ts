import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getOverview } from '@/services/overview';

export const overviewQueryKeys = createQueryKeys('overview', {
  getOverview: (token: string) => [token],
});

export const getOverviewQueryOptions = (token: string) => ({
  queryKey: overviewQueryKeys.getOverview(token).queryKey,
  queryFn: () => getOverview(token),
});
