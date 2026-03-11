import { api } from '@/lib/api';

import type {
  NotificationSetting,
  UpdateNotificationSettingRequest,
} from '@/data/models/notification';

/**
 * 알림 설정 조회
 *
 * @returns 알림 설정 정보
 */
export const getNotificationSetting = async (): Promise<NotificationSetting> => {
  return api.get<NotificationSetting>('/notifications/settings');
};

/**
 * 알림 설정 수정
 *
 * @param body - 수정할 알림 설정
 */
export const updateNotificationSetting = async (
  body: UpdateNotificationSettingRequest
): Promise<void> => {
  return api.patch<void, UpdateNotificationSettingRequest>('/notifications/settings', body);
};
