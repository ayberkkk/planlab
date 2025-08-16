"use client";

import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Zod şeması ile form validasyonu
const ParticipantSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin" }),
  role: z.string().optional()
});

const MeetingSchema = z.object({
  title: z.string().min(3, { message: "Toplantı başlığı en az 3 karakter olmalıdır" }),
  participantCount: z.number().int().min(1).max(15, { message: "Katılımcı sayısı 1-15 arasında olmalıdır" }),
  dateTime: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Toplantı tarihi şu andan ileri bir tarih olmalıdır"
  }),
  participants: z.array(ParticipantSchema).optional()
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
  const [formData, setFormData] = useState<MeetingData>({
    title: 'Plan/Lab - ',
    participantCount: 5,
    dateTime: new Date().toISOString().slice(0, 16),
    participants: []
  });
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantData>({
    name: '',
    email: '',
    role: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [participantErrors, setParticipantErrors] = useState<{ [key: string]: string }>({});

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const determineMeetingType = (count: number) => {
    if (count >= 1 && count <= 5) return 'Düşük Yoğunlukta';
    if (count >= 6 && count <= 10) return 'Orta Ölçekli';
    return 'Büyük Toplantı';
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

  const addParticipant = () => {
    try {
      const validatedParticipant = ParticipantSchema.parse(currentParticipant);

      if ((formData.participants?.length || 0) >= formData.participantCount) {
        toast.error(`En fazla ${formData.participantCount} katılımcı ekleyebilirsiniz`, {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        participants: [...(prev.participants || []), validatedParticipant]
      }));

      setCurrentParticipant({ name: '', email: '', role: '' });
      setParticipantErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.reduce((acc: { [key: string]: string }, curr: z.ZodIssue) => {
          const path = curr.path && curr.path.length > 0 ? curr.path[0] : 'general';
          acc[path.toString()] = curr.message;
          return acc;
        }, {});

        const firstErrorMessage = Object.values(errorMessages)[0];
        toast.error(firstErrorMessage || 'Validation error', {
          position: "top-right",
          autoClose: 3000
        });

        setParticipantErrors(errorMessages);
      } else {
        toast.error('Katılımcı bilgileri geçerli değil', {
          position: "top-right",
          autoClose: 3000
        });
      }
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => i !== index)
    }));
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
        toast.error('En az bir katılımcı eklenmelidir', {
          position: "top-right",
          autoClose: 3000
        });
        return;
      }

      const meetingCode = `PL-${uuidv4().slice(0, 6).toUpperCase()}`;

      const meetingInfo = {
        id: uuidv4(),
        ...validatedData,
        code: meetingCode,
        type: determineMeetingType(validatedData.participantCount)
      };

      toast.success(`Toplantı Oluşturuldu: ${meetingCode}`, {
        position: "top-right",
        autoClose: 3000
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
        toast.error(firstErrorMessage || 'Validation error', {
          position: "top-right",
          autoClose: 3000
        });

        setErrors(errorMessages);
      } else {
        toast.error('Toplantı bilgileri geçerli değil', {
          position: "top-right",
          autoClose: 3000
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl flex bg-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Sol Taraf - Form */}
        <div className="w-2/3 p-8 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold gradient-text">Toplantı Oluştur</h2>
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
                <label htmlFor="title" className="block mb-2 text-gray-300">Toplantı Başlığı</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleMainFormChange}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Plan/Lab - Proje Toplantısı"
                  required
                />
                {errors.title && <p className="text-red-500 mt-1 text-sm">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="participantCount" className="block mb-2 text-gray-300">Katılımcı Sayısı</label>
                <select
                  id="participantCount"
                  name="participantCount"
                  value={formData.participantCount}
                  onChange={handleMainFormChange}
                  className="w-full p-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value={5}>5 Katılımcı (Düşük Yoğunlukta)</option>
                  <option value={10}>10 Katılımcı (Orta Ölçekli)</option>
                  <option value={15}>15 Katılımcı (Büyük Toplantı)</option>
                </select>
                <div className="mt-2 text-sm text-gray-400">
                  {determineMeetingType(formData.participantCount)} Toplantı
                </div>
              </div>
            </div>

            {/* Tarih ve Saat Seçimi */}
            <div>
              <label className="block mb-2 text-gray-300">Toplantı Tarihi ve Saati</label>
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
                Seçilen Tarih ve Saat:
                <span className="ml-2 font-semibold text-white">
                  {new Date(formData.dateTime).toLocaleString('tr-TR', {
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
              <h3 className="text-xl font-semibold mb-4 text-gray-200">Katılımcı Bilgileri</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block mb-1 text-gray-300">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentParticipant.name}
                    onChange={handleParticipantChange}
                    className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Katılımcı Adı"
                  />
                  {participantErrors.name && <p className="text-red-500 mt-1 text-xs">{participantErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 text-gray-300">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentParticipant.email}
                    onChange={handleParticipantChange}
                    className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="E-posta Adresi"
                  />
                  {participantErrors.email && <p className="text-red-500 mt-1 text-xs">{participantErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="role" className="block mb-1 text-gray-300">Rol (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={currentParticipant.role}
                    onChange={handleParticipantChange}
                    className="w-full p-2 bg-[#3A3A3A] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Katılımcı Rolü"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addParticipant}
                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden  w-full
            font-semibold text-white transition duration-300 ease-out 
            border-2 border-white/20 rounded-full 
            shadow-md hover:shadow-lg 
            before:absolute before:inset-0 before:bg-white/10 before:origin-top-right 
            before:translate-x-full before:translate-y-12 before:rounded-full 
            before:opacity-0 before:transition before:duration-700 
            hover:before:-translate-x-0 hover:before:-translate-y-0 hover:before:opacity-100 
            hover:border-white/40 hover:text-blue-300"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
                <span className="relative z-10 flex items-center">
                  Katılımcı Ekle
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden  w-full
            font-semibold text-white transition duration-300 ease-out 
            border-2 border-white/20 rounded-full 
            shadow-md hover:shadow-lg 
            before:absolute before:inset-0 before:bg-white/10 before:origin-top-right 
            before:translate-x-full before:translate-y-12 before:rounded-full 
            before:opacity-0 before:transition before:duration-700 
            hover:before:-translate-x-0 hover:before:-translate-y-0 hover:before:opacity-100 
            hover:border-white/40 hover:text-blue-300"
            > 
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-full blur-lg"></span>
              <span className="relative z-10 flex items-center">
                Toplantı Oluştur
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
            Katılımcılar
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
                    {participant.role && (
                      <p className="text-gray-500 text-xs mt-1">({participant.role})</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeParticipant(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Katılımcıyı Sil"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Henüz katılımcı eklenmedi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
