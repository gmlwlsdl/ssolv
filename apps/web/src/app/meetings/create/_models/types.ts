export interface CreateMeetingFormData {
  name: string;
  attendeeCount: number;
  station: Station | null;
  date: string | null;
  time: string | null;
}

export interface Station {
  id: number;
  name: string;
}

export interface CreateMeetingRequest {
  name: string;
  attendeeCount: number;
  stationId: number;
  endAt: string;
}

export interface CreateMeetingResponse {
  id: number;
  validateTokenUrl: string;
}
