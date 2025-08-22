import { createTestMeeting } from './createTestMeeting';

export function initializeTestData() {
  if (typeof window === 'undefined') return;

  const storedMeetings = localStorage.getItem('plan/lab-rooms');
  if (!storedMeetings) {
    const testMeeting = createTestMeeting();
    localStorage.setItem('plan/lab-rooms', JSON.stringify([testMeeting]));
    return testMeeting.code;
  }

  try {
    const parsedMeetings = JSON.parse(storedMeetings);
    const meetingsArray = Array.isArray(parsedMeetings) ? parsedMeetings : [parsedMeetings];
    return meetingsArray[0]?.code;
  } catch (error) {
    console.error('Test verisi yüklenirken hata:', error);
    return null;
  }
}
