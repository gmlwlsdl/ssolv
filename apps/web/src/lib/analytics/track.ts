/**
 * 타입 안전한 이벤트 트래킹 래퍼
 *
 * 사용법:
 *   import { track } from '@/lib/analytics/track';
 *   track.pageView({ page_type: 'home' });
 *   track.loginClicked({ login_method: 'kakao' });
 */
import amplitude from '@/lib/amplitude';

import {
  EVENT_NAMES,
  type ActiveMeetingOpenedProperties,
  type LoginClickedProperties,
  type MeetingCreateClickedProperties,
  type MeetingCreateSubmittedProperties,
  type MeetingJoinClickedProperties,
  type PageViewProperties,
  type RecommendationStartClickedProperties,
} from './events';

export const track = {
  // ─── Page ────────────────────────────────────────────────────

  pageView: (properties: PageViewProperties) => {
    amplitude.track(EVENT_NAMES.PAGE_VIEW, properties);
  },

  // ─── Interaction ─────────────────────────────────────────────

  loginClicked: (properties: LoginClickedProperties) => {
    amplitude.track(EVENT_NAMES.LOGIN_CLICKED, properties);
  },

  meetingCreateClicked: (properties: MeetingCreateClickedProperties) => {
    amplitude.track(EVENT_NAMES.MEETING_CREATE_CLICKED, properties);
  },

  meetingJoinClicked: (properties: MeetingJoinClickedProperties) => {
    amplitude.track(EVENT_NAMES.MEETING_JOIN_CLICKED, properties);
  },

  recommendationStartClicked: (properties: RecommendationStartClickedProperties) => {
    amplitude.track(EVENT_NAMES.RECOMMENDATION_START_CLICKED, properties);
  },

  activeMeetingOpened: (properties: ActiveMeetingOpenedProperties) => {
    amplitude.track(EVENT_NAMES.ACTIVE_MEETING_OPENED, properties);
  },

  meetingCreateSubmitted: (properties: MeetingCreateSubmittedProperties) => {
    amplitude.track(EVENT_NAMES.MEETING_CREATE_SUBMITTED, properties);
  },

  // ─── Conversion ──────────────────────────────────────────────

  loginCompleted: () => {
    amplitude.track(EVENT_NAMES.LOGIN_COMPLETED);
  },

  meetingCreated: () => {
    amplitude.track(EVENT_NAMES.MEETING_CREATED);
  },

  surveyCompleted: () => {
    amplitude.track(EVENT_NAMES.SURVEY_COMPLETED);
  },
} as const;
