import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import RoomDetailClient from './RoomDetailClient';
import RoomHeader from '@/app/components/RoomHeader';
import Loading from './loading';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  
  return {
    title: `Toplantı: ${code} - Plan/Lab`,
    description: `Plan/Lab toplantı detayları - Kod: ${code}`,
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { code } = await params;
  
  return (
    <main className="min-h-screen bg-[#121212] flex flex-col">
      <RoomHeader code={code} />
      
      <div className="flex-1 flex">
        <Suspense fallback={<Loading />}>
          <RoomDetailClient code={code} />
        </Suspense>
      </div>

      <footer className="bg-[#1E1E1E] border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Plan/Lab
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/help"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Yardım
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}