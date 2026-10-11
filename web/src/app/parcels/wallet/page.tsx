'use client';

import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { AddWalletModal } from '@/components/modals/AddWalletModal';

export default function WalletPage() {
  const { walletBalance } = usePlexus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transactions = [
    { id: 'T-1', title: 'Initial Wallet Welcome Bonus', amount: 250, type: 'credit', date: 'Today, 09:00 AM' },
  ];

  return (
    <AppLayout
      breadcrumb="Student Portal / Amazon Parcel Management / E-Wallet"
      title="E-Wallet"
    >
      <div className="space-y-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Amrita Student Pay Balance
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                ₹{walletBalance}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Linked to Gargi Hostel (Block A) Student Account
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Money (UPI)</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Wallet Activity</h3>

          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{t.date}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-700">+₹{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  );
}
