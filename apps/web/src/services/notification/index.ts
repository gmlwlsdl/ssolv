import { api } from '@/lib/api';

import type {
  DeleteFcmTokenRequest,
  NotificationSetting,
  RegisterFcmTokenRequest,
  UpdateNotificationSettingRequest,
} from '@/data/models/notification';

/** localStorage에 FCM 토큰을 저장할 때 사용하는 키 */
export const FCM_TOKEN_STORAGE_KEY = 'fcmToken';

/**
 * FCM 토큰 등록
 *
 * @param body - FCM 토큰 및 플랫폼 정보
 */
export const registerFcmToken = async (body: RegisterFcmTokenRequest): Promise<void> => {
  return api.post<void, RegisterFcmTokenRequest>('/notifications/fcm-tokens', body);
};

/**
 * FCM 토큰 삭제
 *
 * @param body - 삭제할 FCM 토큰
 */
export const deleteFcmToken = async (body: DeleteFcmTokenRequest): Promise<void> => {
  return api.delete<void>('/notifications/fcm-tokens', { body });
};

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
