"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1E1E1E] rounded-2xl p-8 text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300">Toplantı Bulunamadı</h2>
          <p className="text-gray-400">
            Aradığınız toplantı koduna ait bir toplantı bulunamadı veya toplantı süresi dolmuş olabilir.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link 
            href="/"
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Dön
            </span>
          </Link>

          <Link 
            href="/room"
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Tüm Toplantıları Görüntüle
            </span>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
            <span className="relative z-10 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              Geri Dön
            </span>
          </button>
        </div>

        <div className="pt-4 text-sm text-gray-500">
          Eğer toplantı kodunun doğru olduğundan eminseniz, toplantı sahibi ile iletişime geçin.
        </div>
      </div>
    </div>
  );
}
