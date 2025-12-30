import { api } from '@/app/_lib/api';
import { Station } from '@/app/meetings/create/_models/types';

export const stationsApi = {
  getStations: () => api.get<Station[]>('/stations'),
} as const;
