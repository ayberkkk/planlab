"use client";

import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Alert } from './Alert';
import ParticipantStatusBadge from './ParticipantStatusBadge';

// Zod şeması ile form validasyonu
const ParticipantSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  role: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'declined']).default('pending')
});

const MeetingSchema = z.object({
  title: z.string().min(3, { message: "Toplantı başlığı en az 3 karakter olmalıdır" }),
  participantCount: z.number().int().min(1).max(15, { message: "Katılımcı sayısı 1 ile 15 arasında olmalıdır" }),
  dateTime: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Toplantı tarihi gelecekte bir tarih olmalıdır"
  }),
  participants: z.array(ParticipantSchema).default([]),
  duration: z.object({
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    duration: z.number().optional()
  }).default({ status: 'scheduled' }),
  notes: z.array(z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),
    createdBy: z.string()
  })).optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString())
});

type ParticipantData = z.infer<typeof ParticipantSchema>;
type MeetingData = z.infer<typeof MeetingSchema>;

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreate: (meeting: MeetingData & { id: string; code: string; type: string }) => void;
}

export default function CreateMeetingModal({
  isOpen,
  onClose,
  onMeetingCreate
}: CreateMeetingModalProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr';
  const [formData, setFormData] = useState<MeetingData>({
    title: 'Plan/Lab - ',
    participantCount: 5,
    dateTime: new Date().toISOString().slice(0, 16),
    participants: [],
    duration: { status: 'scheduled' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantData>({
    id: uuidv4(),
    name: '',
    email: '',
    role: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [participantErrors, setParticipantErrors] = useState<{ [key: string]: string }>({});
  const [editingParticipantIndex, setEditingParticipantIndex] = useState<number | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const determineMeetingType = (count: number) => {
    if (count >= 1 && count <= 5) return 'Low Intensity';
    if (count >= 6 && count <= 10) return 'Medium Scale';
    return 'Large Meeting';
  };

  const handleMainFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participantCount' ? Number(value) : value
    }));
  };

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentParticipant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditingParticipant = (index: number) => {
    const participant = formData.participants?.[index];
    if (participant) {
      setCurrentParticipant(participant);
      setEditingParticipantIndex(index);
    }
  };

  const addOrUpdateParticipant = () => {
    try {
      const validatedParticipant = ParticipantSchema.parse(currentParticipant);

      if (editingParticipantIndex !== null) {
        // Update existing participant
        setFormData(prev => ({
          ...prev,
          participants: prev.participants?.map((p, idx) => 
            idx === editingParticipantIndex ? validatedParticipant : p
          )
        }));

        Alert.success(`${validatedParticipant.name} katılımcısı başarıyla güncellendi!`, {
          style: {
            fontSize: '14px',
            fontWeight: '500'
          }
        });

        setEditingParticipantIndex(null);
      } else {
        // Add new participant
        if ((formData.participants?.length || 0) >= formData.participantCount) {
          Alert.error(`En fazla ${formData.participantCount} katılımcı ekleyebilirsiniz`);
          return;
        }

        setFormData(prev => ({
          ...prev,
          participants: [...(prev.participants || []), validatedParticipant]
        }));

        Alert.success(`${validatedParticipant.name} katılımcısı başarıyla eklendi!`, {
          style: {
            fontSize: '14px',
            fontWeight: '500'
          }
        });
      }

      setCurrentParticipant({ 
        id: uuidv4(),
        name: '', 
        email: '', 
        role: '',
        status: 'pending'
      });
      setParticipantErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.reduce((acc: { [key: string]: string }, curr: z.ZodIssue) => {
          const path = curr.path && curr.path.length > 0 ? curr.path[0] : 'general';
          acc[path.toString()] = curr.message;
          return acc;
        }, {});

        const firstErrorMessage = Object.values(errorMessages)[0];
        Alert.error(firstErrorMessage || 'Doğrulama hatası');

        setParticipantErrors(errorMessages);
      } else {
        Alert.error('Geçersiz katılımcı bilgileri');
      }
    }
  };

  const removeParticipant = (index: number) => {
    const participantName = formData.participants?.[index]?.name;
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => i !== index)
    }));
    
    if (participantName) {
      Alert.info(`${participantName} katılımcısı silindi`, {
        style: {
          fontSize: '14px',
          fontWeight: '500'
        }
      });
    }
  };

  const handleDateTimeChange = () => {
    if (dateInputRef.current && timeInputRef.current) {
      const newDateTime = `${dateInputRef.current.value}T${timeInputRef.current.value}`;
      setFormData(prev => ({ ...prev, dateTime: newDateTime }));
    }
  };

  // Tarih için minimum bugünün tarihi
  const minDate = new Date().toISOString().split('T')[0];

  // Saat için varsayılan değerler
  const defaultTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = MeetingSchema.parse(formData);

      if (!formData.participants || formData.participants.length === 0) {
        Alert.error('En az bir katılımcı eklemelisiniz');
        return;
      }

      const meetingCode = `PL-${uuidv4().slice(0, 6).toUpperCase()}`;

      const meetingInfo = {
        id: uuidv4(),
        ...validatedData,
        code: meetingCode,
        type: determineMeetingType(validatedData.participantCount)
      };

      Alert.success(`🎉 Toplantı Başarıyla Oluşturuldu!\n\nToplantı Kodu: ${meetingCode}`, {
        style: {
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '1.5'
        },
        autoClose: 5000
      });

      onMeetingCreate(meetingInfo);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.reduce((acc: { [key: string]: string }, curr: z.ZodIssue) => {
          const path = curr.path && curr.path.length > 0 ? curr.path[0] : 'general';
          acc[path.toString()] = curr.message;
          return acc;
        }, {});

        const firstErrorMessage = Object.values(errorMessages)[0];
        Alert.error(firstErrorMessage || 'Doğrulama hatası');

        setErrors(errorMessages);
      } else {
        Alert.error('Geçersiz toplantı bilgileri. Lütfen girdiğiniz bilgileri kontrol edin.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-5xl flex bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Sol Taraf - Form */}
        <div className="w-2/3 p-8 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold gradient-text">{t('modal.createMeeting')}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toplantı Temel Bilgileri */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-gray-300">{t('modal.meetingTitle')}</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleMainFormChange}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder={t('modal.meetingTitlePlaceholder')}
                  required
                />
                {errors.title && <p className="text-red-500 mt-1 text-sm">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="participantCount" className="block mb-2 text-gray-300">{t('modal.participantCount')}</label>
                <select
                  id="participantCount"
                  name="participantCount"
                  value={formData.participantCount}
                  onChange={handleMainFormChange}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value={5}>{t('modal.lowIntensity')}</option>
                  <option value={10}>{t('modal.mediumScale')}</option>
                  <option value={15}>{t('modal.largeMeeting')}</option>
                </select>
                <div className="mt-2 text-sm text-gray-400">
                  {determineMeetingType(formData.participantCount)} Toplantı
                </div>
              </div>
            </div>

            {/* Tarih ve Saat Seçimi */}
            <div>
              <label className="block mb-2 text-gray-300">{t('modal.dateTime')}</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Tarih Seçici */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    ref={dateInputRef}
                    min={minDate}
                    value={formData.dateTime.split('T')[0]}
                    onChange={handleDateTimeChange}
                    className="w-full p-3 pl-10 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Saat Seçici */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="time"
                    ref={timeInputRef}
                    value={formData.dateTime.split('T')[1] || defaultTime()}
                    onChange={handleDateTimeChange}
                    className="w-full p-3 pl-10 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Seçilen Tarih ve Saat Önizlemesi */}
              <div className="mt-3 text-sm text-gray-400 text-center">
                {t('modal.selectedDateTime')}
                <span className="ml-2 font-semibold text-white">
                  {new Date(formData.dateTime).toLocaleString(currentLocale === 'tr' ? 'tr-TR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {errors.dateTime && <p className="text-red-500 mt-1 text-sm text-center">{errors.dateTime}</p>}
            </div>

            {/* Katılımcı Ekleme */}
            <div className="bg-[#2A2A2A] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">{t('modal.participantInfo')}</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                  <div>
                    <label htmlFor="name" className="block mb-1 text-gray-300">{t('modal.fullName')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={currentParticipant.name}
                      onChange={handleParticipantChange}
                      className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder={t('modal.fullNamePlaceholder')}
                    />
                    {participantErrors.name && <p className="text-red-500 mt-1 text-xs">{participantErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1 text-gray-300">{t('modal.email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={currentParticipant.email}
                      onChange={handleParticipantChange}
                      className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder={t('modal.emailPlaceholder')}
                    />
                    {participantErrors.email && <p className="text-red-500 mt-1 text-xs">{participantErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="role" className="block mb-1 text-gray-300">{t('modal.role')}</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={currentParticipant.role}
                      onChange={handleParticipantChange}
                      className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder={t('modal.rolePlaceholder')}
                    />
                  </div>
              </div>
                          <button
              type="button"
              onClick={addOrUpdateParticipant}
              className="btn-standard"
              style={{ width: '100%' }}
            >
              <span></span>
              <span className="btn-content">
                {editingParticipantIndex !== null ? t('modal.updateParticipant') : t('modal.addParticipant')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
            </div>

            <button
              type="submit"
              className="btn-standard"
              style={{ width: '100%' }}
            > 
              <span></span>
              <span className="btn-content">
                {t('modal.createMeeting')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </form>
        </div>

        {/* Sağ Taraf - Katılımcı Listesi */}
        <div className="w-1/3 bg-[#2A2A2A] p-8 overflow-y-auto">
          <h3 className="text-2xl font-semibold mb-6 text-gray-200">
            {t('modal.participantsList')}
            <span className="text-sm text-gray-400 ml-2">
              ({formData.participants?.length || 0}/{formData.participantCount})
            </span>
          </h3>

          {formData.participants && formData.participants.length > 0 ? (
            <div className="space-y-4">
              {formData.participants.map((participant, index) => (
                <div
                  key={index}
                  className="bg-[#3A3A3A] p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{participant.name}</p>
                    <p className="text-gray-400 text-sm">{participant.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ParticipantStatusBadge status={participant.status} />
                      {participant.role && (
                        <p className="text-gray-500 text-xs">({participant.role})</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingParticipant(index)}
                      className="text-blue-500 hover:text-blue-700"
                      title={t('modal.editParticipant')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeParticipant(index)}
                      className="text-red-500 hover:text-red-700"
                      title={t('modal.deleteParticipant')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {t('modal.noParticipants')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
