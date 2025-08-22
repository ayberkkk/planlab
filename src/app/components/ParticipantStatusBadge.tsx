"use client";

import { ParticipantStatus } from '../types/meeting';

interface ParticipantStatusBadgeProps {
  status: ParticipantStatus;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
  declined: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const statusText = {
  pending: 'Beklemede',
  accepted: 'Katılıyor',
  declined: 'Katılmıyor'
};

export default function ParticipantStatusBadge({ status }: ParticipantStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
      {statusText[status]}
    </span>
  );
}
