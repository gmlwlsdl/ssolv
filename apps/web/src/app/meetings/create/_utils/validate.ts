import { MEMBERS_SIZE } from '@/app/meetings/create/_models/constants';
import { CreateMeetingFormData } from '@/app/meetings/create/_models/types';

export const validateForm = (formData: CreateMeetingFormData): boolean => {
  const hasValidName = formData.name.trim().length > 0;
  const hasValidMembers = formData.attendeeCount >= MEMBERS_SIZE.MIN;
  const hasValidStation = formData.station !== null;
  const hasValidDateTime = formData.date && formData.time;

  return !!(hasValidName && hasValidMembers && hasValidStation && hasValidDateTime);
};
