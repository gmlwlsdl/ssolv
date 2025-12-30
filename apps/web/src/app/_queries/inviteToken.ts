import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getInviteToken } from '@/app/_lib/inviteToken';

export const inviteTokenQueryKeys = createQueryKeys('inviteToken', {
  getInviteToken: (meetingId: number) => [meetingId],
});

export const getInviteTokenQueryOptions = (meetingId: number) => ({
  queryKey: inviteTokenQueryKeys.getInviteToken(meetingId).queryKey,
  queryFn: () => getInviteToken(meetingId),
});
