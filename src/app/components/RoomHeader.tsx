"use client";

import Link from 'next/link';

interface RoomHeaderProps {
  code: string;
}

export default function RoomHeader({ code }: RoomHeaderProps) {
  return (
    <div className="bg-[#1E1E1E] border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h1 className="text-lg font-medium text-white">
              Toplantı Detayları: <span className="text-blue-400">{code}</span>
            </h1>
            <p className="text-sm text-gray-400">Plan/Lab toplantı detayları</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.history.back()}
              className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-semibold text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md hover:shadow-lg"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
              <span className="relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
