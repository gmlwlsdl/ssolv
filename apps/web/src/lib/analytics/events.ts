/**
 * Amplitude 이벤트 정의
 *
 * 이벤트명은 snake_case, 도메인 행동 기준 (UI 기준 금지)
 * 이벤트 타입: session / page / interaction / conversion
 *
 * @see 이벤트 설계 문서 참조
 */

// ─── Page View ───────────────────────────────────────────────

export const PAGE_TYPES = {
  login: 'login',
  home: 'home',
  meeting_create: 'meeting_create',
  meeting_room: 'meeting_room',
  survey: 'survey',
  recommendation: 'recommendation',
  restaurant_list: 'restaurant_list',
} as const;

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];

export interface PageViewProperties {
  page_type: PageType;
  meeting_id?: string;
}

// ─── Interaction ─────────────────────────────────────────────

export interface LoginClickedProperties {
  login_method: string;
}

export interface MeetingCreateClickedProperties {
  source_page: PageType;
}

export interface MeetingJoinClickedProperties {
  source_page: PageType;
}

export interface RecommendationStartClickedProperties {
  source_page: PageType;
}

export interface ActiveMeetingOpenedProperties {
  meeting_id: string;
}

export interface MeetingCreateSubmittedProperties {
  meeting_type: string;
}

// ─── Event Names ─────────────────────────────────────────────

export const EVENT_NAMES = {
  // page
  PAGE_VIEW: 'page_view',

  // interaction
  LOGIN_CLICKED: 'login_clicked',
  MEETING_CREATE_CLICKED: 'meeting_create_clicked',
  MEETING_JOIN_CLICKED: 'meeting_join_clicked',
  RECOMMENDATION_START_CLICKED: 'recommendation_start_clicked',
  ACTIVE_MEETING_OPENED: 'active_meeting_opened',
  MEETING_CREATE_SUBMITTED: 'meeting_create_submitted',

  // conversion
  LOGIN_COMPLETED: 'login_completed',
  MEETING_CREATED: 'meeting_created',
  SURVEY_COMPLETED: 'survey_completed',
} as const;
