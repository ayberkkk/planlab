"use client";

import React from 'react';
import Link from 'next/link';
import { useMeetings } from '../hooks/useMeetings';

export default function RoomList() {
  const { meetings } = useMeetings();

  // Toplantı durumunu belirle
  const getMeetingStatus = (dateTime: string) => {
    const meetingDate = new Date(dateTime);
    const now = new Date();
    
    if (meetingDate > now) {
      return {
        text: 'Planlandı',
        class: 'bg-blue-500/20 text-blue-400'
      };
    } else if (meetingDate.toDateString() === now.toDateString()) {
      return {
        text: 'Bugün',
        class: 'bg-green-500/20 text-green-400'
      };
    } else {
      return {
        text: 'Tamamlandı',
        class: 'bg-purple-500/20 text-purple-400'
      };
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1E1E1E] to-[#0A0A0A] p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Başlık ve Yeni Toplantı Butonu */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold gradient-text">Toplantı Odaları</h1>
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden 
            font-semibold text-white transition duration-300 ease-out 
            border-2 border-white/20 rounded-full 
            shadow-md hover:shadow-lg 
            before:absolute before:inset-0 before:bg-white/10 
            before:opacity-0 before:transition before:duration-700 
            hover:before:opacity-100 hover:border-white/40"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              Ana Sayfaya Dön
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Toplantı Odaları Grid */}
        {meetings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏗️</div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-8">Henüz Toplantı Oluşturulmadı</h2>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white font-semibold rounded-full 
              hover:opacity-90 transition-all"
            >
              Yeni Toplantı Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => {
              const status = getMeetingStatus(meeting.dateTime);
              return (
                <div
                  key={meeting.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 
                  transform transition duration-300 hover:scale-105 hover:border-white/20 
                  backdrop-blur-sm shadow-xl"
                >
                  {/* Toplantı Başlığı ve Durumu */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-white">{meeting.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${status.class}`}>
                      {status.text}
                    </span>
                  </div>

                  {/* Toplantı Detayları */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(meeting.dateTime).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {meeting.participantCount} Katılımcı ({meeting.participants?.length || 0} Eklendi)
                    </div>
                    <div className="flex items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {meeting.type}
                    </div>
                  </div>

                  {/* Katılımcı Listesi */}
                  {meeting.participants && meeting.participants.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Katılımcılar</h3>
                      <div className="space-y-2">
                        {meeting.participants.slice(0, 3).map((participant, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold mr-2">
                              {participant.name.charAt(0).toUpperCase()}
                            </span>
                            {participant.name}
                          </div>
                        ))}
                        {meeting.participants.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{meeting.participants.length - 3} diğer katılımcı
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Aksiyon Butonları */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/room/${meeting.code}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 
                      text-white text-center py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                      Odaya Gir
                    </Link>
                    <button
                      className="px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg 
                      hover:bg-[#3A3A3A] transition-all"
                      onClick={() => {
                        // Toplantı linkini kopyala
                        navigator.clipboard.writeText(`${window.location.origin}/room/${meeting.code}`);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
