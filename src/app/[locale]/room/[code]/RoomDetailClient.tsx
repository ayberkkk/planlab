"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Meeting, Participant } from '@/app/types/meeting';
import { useMeetings } from '@/app/hooks/useMeetings';
import MeetingNotes from '@/app/components/MeetingNotes';
import RoomSidePanel from '@/app/components/RoomSidePanel';
import { Alert } from '@/app/components/Alert';

interface RoomDetailClientProps {
  code: string;
}

export default function RoomDetailClient({ code }: RoomDetailClientProps) {
  const { updateParticipantStatus, addMeetingNote } = useMeetings();
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    // localStorage'dan direkt olarak kontrol edelim
    const storedMeetings = localStorage.getItem('plan/lab-rooms');
    
    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings);
        const meetingsArray = Array.isArray(parsedMeetings) ? parsedMeetings : [parsedMeetings];
        const foundMeeting = meetingsArray.find(m => m.code === code);
        
        if (foundMeeting) {
          setMeeting(foundMeeting);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Toplantı verisi yüklenirken hata:', error);
        notFound();
      }
    } else {
      notFound();
    }
  }, [code]);

  const handleStatusChange = (participantId: string, status: Participant['status']) => {
    if (!meeting) return;
    
    updateParticipantStatus(meeting.id, participantId, status);
    Alert.success('Katılımcı durumu güncellendi');
  };

  const handleAddNote = (content: string) => {
    if (!meeting) return;

    addMeetingNote(meeting.id, {
      content,
      createdBy: 'Kullanıcı' // TODO: Add real user management
    });
    Alert.success('Not başarıyla eklendi');
  };

  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Toplantı Başlığı ve Detayları */}
          <div className="bg-[#1E1E1E] rounded-xl p-6">
            <h1 className="text-3xl font-bold text-white mb-6">{meeting.title}</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="font-medium text-white">Katılımcı Sayısı:</span>{' '}
                  {meeting.participants.length} / {meeting.participantCount}
                </p>
                <p className="text-gray-400">
                  <span className="font-medium text-white">Durum:</span>{' '}
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {meeting.duration.status}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="font-medium text-white">Tarih ve Saat:</span>{' '}
                  {new Date(meeting.dateTime).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-400">
                  <span className="font-medium text-white">Toplantı Türü:</span>{' '}
                  <span className="px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    {meeting.type}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Toplantı Notları */}
          <MeetingNotes
            notes={meeting.notes || []}
            onAddNote={handleAddNote}
          />
        </div>
      </div>

      {/* Sağ Panel - Katılımcılar ve Sohbet */}
                <RoomSidePanel
            participants={meeting.participants}
            onStatusChange={handleStatusChange}
          />
    </>
  );
}