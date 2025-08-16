"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateMeetingModal from './components/CreateMeetingModal';
import { useMeetings } from './hooks/useMeetings';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { meetings, addMeeting } = useMeetings();

  const handleMeetingCreate = (meetingData: any) => {
    addMeeting(meetingData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1E1E1E] to-[#0A0A0A] flex items-center justify-center p-4 overflow-hidden">
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
            Plan/Lab Toplantı Platformu
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Toplantılarınızı kolayca planlayın, yönetin ve takip edin. 
            Hızlı, şeffaf ve kullanıcı dostu bir deneyim.
          </p>
        </div>

        {/* Glass Efektli Butonlar */}
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden 
            font-semibold text-white transition duration-300 ease-out 
            border-2 border-white/20 rounded-full 
            shadow-md hover:shadow-lg 
            before:absolute before:inset-0 before:bg-white/10 before:origin-top-left 
            before:-translate-x-full before:translate-y-12 before:rounded-full 
            before:opacity-0 before:transition before:duration-700 
            hover:before:translate-x-0 hover:before:-translate-y-0 hover:before:opacity-100 
            hover:border-white/40 hover:text-blue-300"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              Yeni Toplantı Oluştur
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </button>

          <Link 
            href="/room"
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden 
            font-semibold text-white transition duration-300 ease-out 
            border-2 border-white/20 rounded-full 
            shadow-md hover:shadow-lg 
            before:absolute before:inset-0 before:bg-white/10 before:origin-top-right 
            before:translate-x-full before:translate-y-12 before:rounded-full 
            before:opacity-0 before:transition before:duration-700 
            hover:before:-translate-x-0 hover:before:-translate-y-0 hover:before:opacity-100 
            hover:border-white/40 hover:text-green-300"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600/20 to-teal-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              Toplantı Odaları
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Özellikler Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: '🕒',
              title: 'Kolay Planlama',
              description: 'Birkaç tıkla toplantınızı oluşturun. Katılımcı sayısı, tarih ve başlık gibi detayları hızlıca girin.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🔗',
              title: 'Benzersiz Bağlantılar',
              description: 'Her toplantı için benzersiz bir kod üretilir. Katılımcılarınızı davet etmek çok kolay.',
              color: 'from-green-500 to-teal-500'
            },
            {
              icon: '📊',
              title: 'Detaylı Yönetim',
              description: 'Toplantı türünü otomatik belirleyin. Düşük, orta veya büyük ölçekli toplantılarınızı kolayca yönetin.',
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
