'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function HostelChatPage() {
  const { chatMessages, activeChannel, setActiveChannel, postChatMessage } = usePlexus();
  const [inputMessage, setInputMessage] = useState('');

  const filteredMessages = chatMessages.filter(m => m.channel === activeChannel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    postChatMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Hostel General Chat"
      title="Hostel General Chat"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        {/* Forum Header & Channel Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📣</span> Gargi Resident Forum
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Hostel announcements and student discussions
            </p>
          </div>

          {/* Channel Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['general-discussion', 'mess-updates', 'announcements'] as const).map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChannel === ch
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                #{ch}
              </button>
            ))}
          </div>
        </div>

        {/* Message Feed */}
        <div className="space-y-4 min-h-[320px]">
          {filteredMessages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl transition-all ${
                msg.isNotice
                  ? 'bg-[#FFFBEB] border border-amber-200/80'
                  : 'bg-slate-50 border border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {msg.author}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    ({msg.roleInfo})
                  </span>
                  {msg.badgeText && (
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {msg.badgeText}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {msg.timestamp}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {msg.content}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Post a message in #${activeChannel}...`}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            Post
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
