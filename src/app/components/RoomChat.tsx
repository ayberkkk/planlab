"use client";

import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
}

export default function RoomChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'Siz',
      time: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Mesaj gönderildikten sonra en alta scroll
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mesajlar */}
      <div 
        id="chat-messages"
        className="flex-1 p-4 space-y-4 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Henüz mesaj yok</p>
            <p className="text-sm mt-2">İlk mesajı siz gönderin!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] ${
                msg.sender === 'Siz' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`rounded-lg p-3 ${
                  msg.sender === 'Siz'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A2A2A] text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <div
                className={`flex items-center mt-1 text-xs text-gray-400 ${
                  msg.sender === 'Siz' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.sender}</span>
                <span className="mx-1">•</span>
                <span>{msg.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mesaj Gönderme Formu */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 bg-[#2A2A2A] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="btn-standard"
            style={{ padding: '8px 16px' }}
          >
            <span></span>
            <span className="btn-content">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" 
                />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
