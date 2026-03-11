import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getNotificationSetting } from '@/services/notification';

export const notificationQueryKeys = createQueryKeys('notification', {
  getSetting: null,
});

const STALE_TIME = 60 * 1000;

export const getNotificationSettingQueryOptions = () => ({
  queryKey: notificationQueryKeys.getSetting.queryKey,
  queryFn: () => getNotificationSetting(),
  staleTime: STALE_TIME,
});
