"use client";

import { useState } from 'react';
import { Participant } from '../types/meeting';
import ParticipantStatusBadge from './ParticipantStatusBadge';
import RoomChat from './RoomChat';

interface RoomSidePanelProps {
  participants: Participant[];
  meetingId: string;
  onStatusChange?: (participantId: string, status: Participant['status']) => void;
}

type TabType = 'chat' | 'participants';

export default function RoomSidePanel({ 
  participants, 
  meetingId,
  onStatusChange 
}: RoomSidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participants');

  return (
    <div className="w-80 bg-[#1E1E1E] border-l border-gray-800 flex flex-col h-screen">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${
            activeTab === 'participants'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Katılımcılar ({participants.length})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-4 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sohbet
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'participants' ? (
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-[#2A2A2A] rounded-lg p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">{participant.name}</h3>
                    <p className="text-gray-400 text-sm">{participant.email}</p>
                    {participant.role && (
                      <p className="text-gray-500 text-xs mt-1">{participant.role}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ParticipantStatusBadge status={participant.status} />
                    {onStatusChange && (
                      <select
                        value={participant.status}
                        onChange={(e) => onStatusChange(participant.id, e.target.value as Participant['status'])}
                        className="mt-1 bg-[#3A3A3A] text-white text-xs rounded-lg px-2 py-1 border border-gray-700"
                      >
                        <option value="pending">Beklemede</option>
                        <option value="accepted">Katılıyor</option>
                        <option value="declined">Katılmıyor</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RoomChat roomId={meetingId} />
        )}
      </div>
    </div>
  );
}