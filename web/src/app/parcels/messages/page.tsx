'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Ananya R.', room: 'A-201', text: 'Hey Hamshitha! Are you at the main gate right now for the parcel?', time: '11:20 AM' },
    { id: '2', sender: 'Hamshitha (You)', room: 'A-204', text: 'Yes! Heading towards Gargi Block A in 5 minutes.', time: '11:22 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'Hamshitha (You)', room: 'A-204', text: input.trim(), time: 'Just now' }]);
    setInput('');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Amazon Parcel Management / Messages"
      title="Messages"
    >
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ananya R. (Room A-201)</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Online • Parcel Delivery Inquiry</p>
          </div>
        </div>

        <div className="space-y-3 min-h-[280px]">
          {messages.map(m => (
            <div key={m.id} className={`flex flex-col ${m.sender.includes('You') ? 'items-end' : 'items-start'}`}>
              <div className={`p-3.5 rounded-2xl max-w-sm text-xs font-semibold leading-relaxed ${
                m.sender.includes('You')
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-slate-100 text-slate-800 rounded-bl-xs'
              }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1">{m.time}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
