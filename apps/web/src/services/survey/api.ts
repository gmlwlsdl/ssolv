import {
  FoodCategoryResponse,
  UpdateAttendeeProfileRequest,
  MeetingDetailResponse,
} from '@/app/meetings/[token]/survey/_models/types';
import { api } from '@/lib/api';

/**
 * 설문 관련 API 모듈
 */
export const surveyApi = {
  /** 음식 카테고리 조회 */
  getSurveyCategories: (query?: string) =>
    api.get<FoodCategoryResponse>('/survey-categories', {
      params: query ? { q: query } : undefined,
    }),

  /** 모임 상세 조회 (참가자 목록 포함) */
  getMeetingDetail: (token: string) => {
    return api.get<MeetingDetailResponse>(`/meetings/${token}`);
  },

  /** 참석자 프로필 확정 (닉네임 + 색상) */
  putAttendeeProfile: (token: string, body: UpdateAttendeeProfileRequest) => {
    return api.put(`/meetings/${token}/attendees`, body);
  },

  /** 설문 제출 (선호 음식 선택) */
  postSurveyResult: (token: string, selectedCategoryList: number[]) => {
    return api.post(`/meetings/${token}/surveys`, {
      selectedCategoryList,
    });
  },
} as const;
