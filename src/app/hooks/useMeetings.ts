"use client";

import { useState, useEffect } from 'react';

export interface Meeting {
  id: string;
  title: string;
  participantCount: number;
  dateTime: string;
  code: string;
  type: string;
  participants?: Array<{
    name: string;
  }>;
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    // localStorage'dan toplantıları al
    const storedMeetings = localStorage.getItem('plan/lab-rooms');
    
    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings);
        // Eğer tek bir toplantı varsa diziye çevir
        const meetingsArray = Array.isArray(parsedMeetings) 
          ? parsedMeetings 
          : [parsedMeetings];
        
        setMeetings(meetingsArray);
      } catch (error) {
        console.error('Toplantıları parse ederken hata:', error);
      }
    }
  }, []);

  const addMeeting = (meeting: Meeting) => {
    const updatedMeetings = [...meetings, meeting];
    setMeetings(updatedMeetings);
    localStorage.setItem('plan/lab-rooms', JSON.stringify(updatedMeetings));
  };

  const removeMeeting = (meetingId: string) => {
    const updatedMeetings = meetings.filter(m => m.id !== meetingId);
    setMeetings(updatedMeetings);
    localStorage.setItem('plan/lab-rooms', JSON.stringify(updatedMeetings));
  };

  return { meetings, addMeeting, removeMeeting };
}
