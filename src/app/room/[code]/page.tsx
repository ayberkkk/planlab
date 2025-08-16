import React from 'react';
import { Metadata } from 'next';
import RoomDetailClient from '@/app/room/[code]/RoomDetailClient';

interface PageProps {
  params: {
    code: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Room ${params.code} - Plan/Lab`,
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  return <RoomDetailClient code={params.code} />;
}