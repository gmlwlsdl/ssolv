import { CreateMeetingRequest, CreateMeetingResponse } from '@/app/meetings/create/_models/types';
import { api } from '@/lib/api';
import { MeetingOverview } from '@/services/overview';

import { formatCreateMeetingResponse, formatMeetingResponse } from './format';

import type { MeetingResponse } from '@/data/models/meeting';

export const meetingsApi = {
  getMeetings: async () => {
    const response = await api.get<MeetingResponse[]>('/meetings');
    return response.map(formatMeetingResponse);
  },
  getMeetingHistory: (id: number) => api.get<MeetingOverview>(`/meetings/${id}/history`),
  createMeeting: async (form: CreateMeetingRequest) => {
    const response = await api.post<CreateMeetingResponse, CreateMeetingRequest>('/meetings', form);
    return formatCreateMeetingResponse(response);
  },
  joinMeeting: async (token: string) => api.post('/meetings/join', { token }),
  validateToken: (token: string) =>
    api.get<{ token: string }>(`/meetings/validate-invite`, {
      params: { token },
    }),
  getMeetingToken: (token: string) => api.get<{ token: string }>(`/meetings/${token}/invite-token`),
} as const;
