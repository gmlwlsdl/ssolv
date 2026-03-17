/**
 * 앱 네이티브 이벤트 정의
 * 웹뷰 밖에서 발생하는 이벤트만 포함
 */

export const EVENT_NAMES = {
  APP_OPEN: 'app_open',
  PUSH_OPENED: 'push_opened',
} as const;

export interface AppOpenProperties {
  is_cold_start: boolean;
}

export interface PushOpenedProperties {
  push_type: string;
  meeting_id?: string;
}
