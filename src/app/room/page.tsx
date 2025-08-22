"use client";

import { useMeetings } from '../hooks/useMeetings';
import Link from 'next/link';

export default function RoomList() {
  const { meetings } = useMeetings();

  const getMeetingStatusColor = (dateTime: string) => {
    const meetingDate = new Date(dateTime);
    const now = new Date();
    
    if (meetingDate < now) {
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'; // Geçmiş
    }
    if (meetingDate.toDateString() === now.toDateString()) {
      return 'bg-green-500/10 text-green-500 border-green-500/20'; // Bugün
    }
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20'; // Gelecek
  };

  const getMeetingStatus = (dateTime: string) => {
    const meetingDate = new Date(dateTime);
    const now = new Date();
    
    if (meetingDate < now) return 'Tamamlandı';
    if (meetingDate.toDateString() === now.toDateString()) return 'Bugün';
    return 'Planlandı';
  };

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Toplantılarım</h1>
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Toplantı
            </span>
          </Link>
        </div>

        {meetings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/room/${meeting.code}`}
                className="bg-[#1E1E1E] rounded-xl p-6 hover:bg-[#252525] transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">{meeting.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getMeetingStatusColor(meeting.dateTime)}`}>
                    {getMeetingStatus(meeting.dateTime)}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Kod:</span> {meeting.code}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Tarih:</span>{' '}
                    {new Date(meeting.dateTime).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium text-white">Katılımcılar:</span>{' '}
                    {meeting.participants?.length || 0} / {meeting.participantCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Tür:</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      {meeting.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-[#1E1E1E] rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">Henüz Toplantı Yok</h3>
              <p className="text-gray-400 mb-6">
                Yeni bir toplantı oluşturarak başlayabilirsiniz.
              </p>
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Toplantı Oluştur
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}