"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslations } from 'next-intl';
import CreateMeetingModal from '@/app/components/CreateMeetingModal';
import { useMeetings } from '@/app/hooks/useMeetings';

import { initializeTestData } from '@/app/utils/initializeTestData';
import Header from '@/app/layouts/header';

export default function Home() {
  const t = useTranslations();
  
  // Test verisini başlat
  React.useEffect(() => {
    initializeTestData();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addMeeting } = useMeetings();

  const handleMeetingCreate = (meetingData: { id: string; code: string; type: string; title: string; participantCount: number; dateTime: string; participants?: { name: string; email: string; role?: string }[] }) => {
    const now = new Date().toISOString();
    const completeMeetingData = {
      ...meetingData,
      participants: (meetingData.participants || []).map((participant, index) => ({
        id: `participant-${index}`,
        name: participant.name,
        email: participant.email,
        role: participant.role,
        status: 'pending' as const
      })),
      duration: {
        startTime: meetingData.dateTime,
        status: 'scheduled' as const
      },
      createdAt: now,
      updatedAt: now
    };
    addMeeting(completeMeetingData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1E1E1E] to-[#0A0A0A] flex items-center justify-center p-4 overflow-hidden">
      <Header />
      <ToastContainer />
      
      {/* Toplantı Oluşturma Modalı */}
      <CreateMeetingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onMeetingCreate={handleMeetingCreate}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl w-full">
        {/* Ana Başlık ve Alt Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {t('homepage.title')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('homepage.subtitle')}
          </p>
        </div>

        {/* Glass Efektli Butonlar */}
        <div className="flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-standard"
          >
            <span></span>
            <span className="btn-content">
              {t('meeting.create')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Özellikler Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: '🕒',
              title: t('homepage.features.easyPlanning.title'),
              description: t('homepage.features.easyPlanning.description'),
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🔗',
              title: t('homepage.features.uniqueLinks.title'),
              description: t('homepage.features.uniqueLinks.description'),
              color: 'from-green-500 to-teal-500'
            },
            {
              icon: '📊',
              title: t('homepage.features.detailedManagement.title'),
              description: t('homepage.features.detailedManagement.description'),
              color: 'from-purple-500 to-indigo-500'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 
              transform transition duration-300 hover:scale-105 hover:border-white/20 
              backdrop-blur-sm shadow-xl"
            >
              <div className={`text-5xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
