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
 * @returns 등록 결과
 *
 * @todo 엔드포인트 미확정 - 백엔드 확정 후 경로 업데이트 필요
 */
export const registerFcmToken = async (body: RegisterFcmTokenRequest): Promise<void> => {
  // TODO: 엔드포인트 미확정 - 백엔드 확정 후 경로 업데이트 필요
  return api.post<void, RegisterFcmTokenRequest>('/device-tokens', body);
};

/**
 * FCM 토큰 삭제
 *
 * @param body - 삭제할 FCM 토큰
 * @returns 삭제 결과
 *
 * @todo 엔드포인트 미확정 - 백엔드 확정 후 경로 업데이트 필요
 */
export const deleteFcmToken = async (body: DeleteFcmTokenRequest): Promise<void> => {
  // TODO: 엔드포인트 미확정 - 백엔드 확정 후 경로 업데이트 필요
  return api.delete<void>('/device-tokens', { body });
};

/**
 * 알림 설정 조회
 *
 * @returns 알림 설정 정보
 *
 * @todo 백엔드 미완성 - 개발 완료 후 확인 필요
 */
export const getNotificationSetting = async (): Promise<NotificationSetting> => {
  // TODO: 백엔드 미완성 - 개발 완료 후 확인 필요
  return api.get<NotificationSetting>('/members/me/notification-setting');
};

/**
 * 알림 설정 수정
 *
 * @param body - 수정할 알림 설정
 * @returns 수정된 알림 설정 정보
 *
 * @todo 백엔드 미완성 - 개발 완료 후 확인 필요
 */
export const updateNotificationSetting = async (
  body: UpdateNotificationSettingRequest
): Promise<NotificationSetting> => {
  // TODO: 백엔드 미완성 - 개발 완료 후 확인 필요
  return api.patch<NotificationSetting, UpdateNotificationSettingRequest>(
    '/members/me/notification-setting',
    body
  );
};
