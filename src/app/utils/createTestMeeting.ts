import { Meeting } from '../types/meeting';
import { v4 as uuidv4 } from 'uuid';

export function createTestMeeting(code: string = 'PL-TEST123'): Meeting {
  return {
    id: uuidv4(),
    title: 'Test Toplantısı',
    participantCount: 5,
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Yarın
    code,
    type: 'Düşük Yoğunlukta',
    participants: [
      {
        id: uuidv4(),
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        role: 'Moderatör',
        status: 'accepted'
      },
      {
        id: uuidv4(),
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        role: 'Katılımcı',
        status: 'pending'
      },
      {
        id: uuidv4(),
        name: 'Ayşe Kaya',
        email: 'ayse@example.com',
        role: 'Katılımcı',
        status: 'declined'
      }
    ],
    duration: {
      status: 'scheduled'
    },
    notes: [
      {
        id: uuidv4(),
        content: 'Toplantı gündem maddeleri görüşülecek.',
        createdAt: new Date().toISOString(),
        createdBy: 'Sistem'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
