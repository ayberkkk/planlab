"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

interface MeetingInfo {
  title: string;
  participantCount: number;
  dateTime: string;
  code: string;
  type: string;
}

export default function RoomDetailPage({ params }: { params: { code: string } }) {
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);

  useEffect(() => {
    // localStorage'dan veriyi yükle
    const storedMeetingInfo = localStorage.getItem('plan/lab-rooms');
    
    if (storedMeetingInfo) {
      const parsedMeetingInfo: MeetingInfo = JSON.parse(storedMeetingInfo);
      
      // Toplantı kodunu kontrol et
      if (parsedMeetingInfo.code === params.code) {
        setMeetingInfo(parsedMeetingInfo);
      } else {
        // Geçersiz kod
        notFound();
      }
    } else {
      // Toplantı bulunamadı
      notFound();
    }
  }, [params.code]);

  // Toplantı türü için renk sınıfları
  const getMeetingTypeClass = (type: string) => {
    switch (type) {
      case 'Düşük Yoğunlukta':
        return 'bg-green-200 text-green-800';
      case 'Orta Ölçekli':
        return 'bg-yellow-200 text-yellow-800';
      case 'Büyük':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (!meetingInfo) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{meetingInfo.title}</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <strong>Toplantı Kodu:</strong> {meetingInfo.code}
        </div>
        <div>
          <strong>Katılımcı Sayısı:</strong> {meetingInfo.participantCount}
        </div>
        <div>
          <strong>Tarih ve Saat:</strong> {new Date(meetingInfo.dateTime).toLocaleString()}
        </div>
        <div>
          <strong>Toplantı Türü:</strong> 
          <span className={`px-2 py-1 rounded ml-2 ${getMeetingTypeClass(meetingInfo.type)}`}>
            {meetingInfo.type}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Katılımcılar</h2>
        <p className="text-gray-500">Katılımcı listesi henüz oluşturulmadı (placeholder)</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Oylama / Saat Seçimi</h2>
        <p className="text-gray-500">Oylama ve saat seçimi özellikleri ileride eklenecek</p>
      </div>
    </div>
  );
}
