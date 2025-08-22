"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Meeting, Participant, MeetingDuration, MeetingNote } from '../types/meeting';

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

  const updateParticipantStatus = (
    meetingId: string,
    participantId: string,
    status: Participant['status']
  ) => {
    const updatedMeetings = meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          participants: meeting.participants.map(participant => 
            participant.id === participantId 
              ? { ...participant, status }
              : participant
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
    localStorage.setItem('plan/lab-rooms', JSON.stringify(updatedMeetings));
  };

  const updateMeetingDuration = (
    meetingId: string,
    duration: Partial<MeetingDuration>
  ) => {
    const updatedMeetings = meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          duration: { ...meeting.duration, ...duration },
          updatedAt: new Date().toISOString()
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
    localStorage.setItem('plan/lab-rooms', JSON.stringify(updatedMeetings));
  };

  const addMeetingNote = (
    meetingId: string,
    note: Omit<MeetingNote, 'id' | 'createdAt'>
  ) => {
    const updatedMeetings = meetings.map(meeting => {
      if (meeting.id === meetingId) {
        const newNote: MeetingNote = {
          ...note,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };

        return {
          ...meeting,
          notes: [...(meeting.notes || []), newNote],
          updatedAt: new Date().toISOString()
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
    localStorage.setItem('plan/lab-rooms', JSON.stringify(updatedMeetings));
  };

  return { 
    meetings, 
    addMeeting, 
    removeMeeting,
    updateParticipantStatus,
    updateMeetingDuration,
    addMeetingNote
  };
}
