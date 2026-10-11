'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Sparkles, Check } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { SellSnackModal } from '@/components/modals/SellSnackModal';

export default function StudentSnacksPage() {
  const { snacks, buySnack } = usePlexus();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const getSnackEmoji = (type: string) => {
    switch (type) {
      case 'brownie': return '🧁';
      case 'noodles': return '🍜';
      case 'cookies': return '🍪';
      case 'chips': return '🍟';
      case 'beverage': return '🥤';
      default: return '🍿';
    }
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Student Snacks"
      title="Student Snacks"
    >
      <div className="space-y-6">
        {/* Top Header Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Student-to-Student Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🍿</span> Student Snacks & Room Pantry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Buy homemade snacks or sell room treats to fellow residents in Gargi.
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Sell a Snack (List Item)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Snack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {snacks.map(snack => (
            <div
              key={snack.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                {/* Card Header: Icon & Price badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl shadow-2xs">
                    {getSnackEmoji(snack.iconType)}
                  </div>
                  <span className="text-sm font-black text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    ₹{snack.price}
                  </span>
                </div>

                {/* Category & Title */}
                <div className="mt-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {snack.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {snack.title}
                  </h3>
                </div>

                {/* Seller & Pickup info */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p><span className="text-slate-400">Seller:</span> <strong className="text-slate-800">{snack.seller}</strong></p>
                  <p><span className="text-slate-400">Pickup Room:</span> <strong className="text-slate-800">{snack.pickupLocation}</strong></p>
                  <p><span className="text-slate-400">Available Qty:</span> <strong className="text-teal-700">{snack.availableQty} left</strong></p>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={snack.availableQty <= 0}
                onClick={() => buySnack(snack.id)}
                className="w-full py-2.5 px-4 bg-[#0D9488] hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {snack.availableQty > 0 ? (
                  `Buy for ₹${snack.price} (Pay via Wallet)`
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <SellSnackModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
    </AppLayout>
  );
}
