'use client';

import React, { useState } from 'react';
import { Package, Plus, MapPin, QrCode, ShieldCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { AddParcelModal } from '@/components/modals/AddParcelModal';

export default function MyParcelsPage() {
  const { parcels } = usePlexus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AppLayout
      breadcrumb="Student Portal / Amazon Parcel Management / My Parcels"
      title="My Parcels"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Registered Incoming Parcels</h2>
            <p className="text-xs text-slate-400">Track and share recipient verification OTPs for delivery handoff</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Parcel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parcels.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">📦</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{p.courier}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{p.trackingNumber}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                  {p.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                <p><span className="text-slate-400">Arrival Vault:</span> {p.arrivalGate}</p>
                <p><span className="text-slate-400">Deliver To:</span> {p.destinationHostel}, Room {p.destinationRoom}</p>
                <p><span className="text-slate-400">Reward Offered:</span> <strong className="text-emerald-600">₹{p.reward}</strong></p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Recipient Handoff OTP:</span>
                </div>
                <span className="font-mono font-black text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-800">
                  {p.otp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddParcelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  );
}
