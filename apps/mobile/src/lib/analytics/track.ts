import amplitude from '../amplitude';

import { EVENT_NAMES } from './events';

import type { AppOpenProperties, PushOpenedProperties } from './events';

/**
 * 타입 안전한 앱 이벤트 트래킹 래퍼
 * amplitude.track()을 직접 호출하지 말고 이 래퍼를 사용
 */
export const track = {
  appOpen: (properties: AppOpenProperties) => {
    amplitude.track(EVENT_NAMES.APP_OPEN, properties);
  },

  pushOpened: (properties: PushOpenedProperties) => {
    amplitude.track(EVENT_NAMES.PUSH_OPENED, properties);
  },
} as const;
