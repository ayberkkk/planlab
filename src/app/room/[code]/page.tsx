import React from 'react';
import { Metadata } from 'next';
import RoomDetailClient from '@/app/room/[code]/RoomDetailClient';

type Props = {
  params: { code: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Room ${params.code} - Plan/Lab`,
  };
}

export default function RoomDetailPage({ params }: Props) {
  return <RoomDetailClient code={params.code} />;
}