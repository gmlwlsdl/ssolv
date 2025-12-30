import { MeetingInfo, Participant } from '@/app/_models/meeting';

export interface Meeting extends MeetingInfo {
  participantList: Participant[];
}
