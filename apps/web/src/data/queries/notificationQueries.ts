import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getNotificationSetting } from '@/services/notification';

export const notificationQueryKeys = createQueryKeys('notification', {
  getSetting: null,
});

export const getNotificationSettingQueryOptions = () => ({
  queryKey: notificationQueryKeys.getSetting.queryKey,
  queryFn: () => getNotificationSetting(),
});
