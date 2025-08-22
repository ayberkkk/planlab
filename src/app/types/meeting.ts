export type ParticipantStatus = 'pending' | 'accepted' | 'declined';

export interface Participant {
  id: string;
  name: string;
  email: string;
  role?: string;
  status: ParticipantStatus;
  joinedAt?: string;
  leftAt?: string;
}

export interface MeetingDuration {
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface MeetingNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Meeting {
  id: string;
  title: string;
  participantCount: number;
  dateTime: string;
  code: string;
  type: string;
  participants: Participant[];
  duration: MeetingDuration;
  notes?: MeetingNote[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    occurrences?: number;
  };
  createdAt: string;
  updatedAt: string;
}
