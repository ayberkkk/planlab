"use client";

import { Participant } from '../types/meeting';
import ParticipantStatusBadge from './ParticipantStatusBadge';

interface MeetingParticipantListProps {
  participants: Participant[];
  onStatusChange?: (participantId: string, status: Participant['status']) => void;
  isEditable?: boolean;
}

export default function MeetingParticipantList({ 
  participants, 
  onStatusChange,
  isEditable = false 
}: MeetingParticipantListProps) {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Katılımcılar</h2>
      <div className="space-y-3">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="bg-[#2A2A2A] rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-medium">{participant.name}</h3>
              <p className="text-gray-400 text-sm">{participant.email}</p>
              {participant.role && (
                <p className="text-gray-500 text-xs mt-1">{participant.role}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ParticipantStatusBadge status={participant.status} />
              {isEditable && onStatusChange && (
                <select
                  value={participant.status}
                  onChange={(e) => onStatusChange(participant.id, e.target.value as Participant['status'])}
                  className="bg-[#3A3A3A] text-white text-sm rounded-lg px-3 py-1.5 border border-gray-700"
                >
                  <option value="pending">Beklemede</option>
                  <option value="accepted">Katılıyor</option>
                  <option value="declined">Katılmıyor</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
