import React from 'react';
import { Metadata } from 'next';
import RoomDetailClient from '@/app/room/[code]/RoomDetailClient';

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Room ${resolvedParams.code} - Plan/Lab`,
    description: `Meeting room details for code: ${resolvedParams.code}`,
  };
}

export default async function RoomDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <RoomDetailClient code={resolvedParams.code} />;
}