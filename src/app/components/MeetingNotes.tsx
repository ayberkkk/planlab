"use client";

import { useState } from 'react';
import { MeetingNote } from '../types/meeting';
import { Alert } from './Alert';

interface MeetingNotesProps {
  notes: MeetingNote[];
  onAddNote: (content: string) => void;
  currentUser: string;
}

export default function MeetingNotes({ notes, onAddNote, currentUser }: MeetingNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      Alert.error('Not içeriği boş olamaz');
      return;
    }

    onAddNote(newNote);
    setNewNote('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Toplantı Notları</h2>

      {/* Not Ekleme Formu */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Toplantı notu ekleyin..."
            className="w-full p-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="btn-standard"
              style={{ padding: '8px 24px' }}
              disabled={isUploading}
            >
              <span></span>
              <span className="btn-content">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Not Ekle
              </span>
            </button>
            <label className="btn-standard" style={{ padding: '8px 24px', cursor: 'pointer' }}>
              <span></span>
              <span className="btn-content">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Dosya Yükle
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIsUploading(true);
                    // TODO: Implement file upload
                    Alert.info('Dosya yükleme özelliği yakında eklenecek');
                    setIsUploading(false);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </form>

      {/* Notlar Listesi */}
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-[#2A2A2A] rounded-lg p-4 transition-all hover:bg-[#333333]"
            >
              <p className="text-white whitespace-pre-wrap">{note.content}</p>
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-blue-400 font-medium">{note.createdBy}</span>
                <span className="text-gray-400">{formatDate(note.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8 bg-[#2A2A2A] rounded-lg">
            <p className="text-lg mb-2">Henüz not eklenmemiş</p>
            <p className="text-sm">İlk notu siz ekleyin!</p>
          </div>
        )}
      </div>
    </div>
  );
}