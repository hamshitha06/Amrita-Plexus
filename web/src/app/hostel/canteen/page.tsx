'use client';

import React, { useState } from 'react';
import { Moon, Camera, Sparkles, CheckCircle2, Clock, Check, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { ScanMenuModal } from '@/components/modals/ScanMenuModal';
import { toast } from 'sonner';

export default function NightCanteenPage() {
  const { canteenItems, deductWalletFunds } = usePlexus();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const handleOrderDish = (dishTitle: string, price: number) => {
    const success = deductWalletFunds(price, `Night Canteen order: ${dishTitle}`);
    if (success) {
      toast.success(`Order placed for ${dishTitle}! Token #NC-${Math.floor(10 + Math.random() * 90)} issued.`);
    }
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Night Canteen"
      title="Night Canteen"
    >
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 flex items-center gap-1">
                  🤖 AI Vision OCR Active
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  🟢 Open (09:00 PM - 02:00 AM)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🌙</span> Campus Night Canteen Menu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Upload a photo of today&apos;s menu blackboard to scan & extract dishes automatically!
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsScanModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>📸 Upload Menu Photo (AI Detector)</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Menu Detection Explainer Banner Box */}
        <div className="bg-[#2B344D] text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              HOW AI MENU DETECTION WORKS:
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              Snap a photo of the handwritten canteen menu board → Upload → AI extracts dishes & prices automatically!
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white/10 text-purple-200 border border-white/10 px-3 py-1 rounded-lg shrink-0">
            OCR Model v2.4 Active
          </span>
        </div>

        {/* Canteen Dishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {canteenItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                {/* Header: Category & AI Score badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    {item.categoryBadge}
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    🤖 AI Verified ({item.aiVerifiedScore}%)
                  </span>
                </div>

                {/* Title & Price row */}
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Est. Prep Time: {item.prepTime}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-slate-900">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                      ✓ Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={() => handleOrderDish(item.title, item.price)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Order Now (Pay ₹{item.price})
              </button>
            </div>
          ))}
        </div>
      </div>

      <ScanMenuModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />
    </AppLayout>
  );
}
