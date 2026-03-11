/** FCM 디바이스 플랫폼 */
export type FcmPlatform = 'ios' | 'android';

/** FCM 토큰 등록 요청 */
export interface RegisterFcmTokenRequest {
  /** FCM 디바이스 토큰 */
  fcmToken: string;
  /** 디바이스 플랫폼 */
  platform: FcmPlatform;
}

/** FCM 토큰 삭제 요청 */
export interface DeleteFcmTokenRequest {
  /** FCM 디바이스 토큰 */
  fcmToken: string;
}

/** 알림 설정 */
export interface NotificationSetting {
  /** 알림 활성화 여부 */
  notificationEnabled: boolean;
}

/** 알림 설정 수정 요청 */
export interface UpdateNotificationSettingRequest {
  /** 알림 활성화 여부 */
  notificationEnabled: boolean;
}
