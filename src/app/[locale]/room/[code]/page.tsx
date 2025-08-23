import React, { Suspense } from 'react';
import { Metadata } from 'next';
import RoomDetailClient from './RoomDetailClient';
import RoomHeader from '@/app/components/RoomHeader';
import Loading from './loading';

interface PageProps {
  params: { code: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Toplantı: ${params.code} - Plan/Lab`,
    description: `Plan/Lab toplantı detayları - Kod: ${params.code}`,
  };
}

export default function RoomDetailPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-[#121212] flex flex-col">
      <RoomHeader code={params.code} />
      
      <div className="flex-1 flex">
        <Suspense fallback={<Loading />}>
          <RoomDetailClient code={params.code} />
        </Suspense>
      </div>

      <footer className="bg-[#1E1E1E] border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Plan/Lab
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="/help"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Yardım
              </a>
              <a
                href="/contact"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                İletişim
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}