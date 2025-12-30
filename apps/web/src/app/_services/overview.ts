import { CuisineId } from '@/app/_constants/cuisine';
import { api } from '@/app/_lib/api';
import { AvatarVariantKey } from '@/app/_models/avator';

export interface MenuItem {
  id: number;
  name: string;
}
export interface CuisineCategory {
  id: CuisineId;
  name: string;
  leafCategoryList: MenuItem[];
}

export interface MeetingParticipant {
  userId: number;
  nickname: string;
  profileColor: AvatarVariantKey;
  selectedCategories: CuisineCategory[];
}

export interface MeetingInfo {
  id: number;
  title: string;
  hostUserId: number;
  totalParticipantCnt: number;
  isClosed: boolean;
  stationName: string;
  endAt: string;
}
export interface MeetingOverview {
  currentUserId: number;
  meetingInfo: MeetingInfo;
  participantList: MeetingParticipant[];
}

export const getOverview = async (meetingId: number): Promise<MeetingOverview> => {
  return api.get<MeetingOverview>(`/meetings/${meetingId}`);
};
