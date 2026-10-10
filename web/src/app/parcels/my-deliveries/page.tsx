'use client';

import React, { useState } from 'react';
import { Truck, CheckCircle2, ShieldCheck, Key } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function MyDeliveriesPage() {
  const { parcels, completeDelivery } = usePlexus();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});

  const activeDeliveries = parcels.filter(p => p.status === 'In Transit');
  const completedDeliveries = parcels.filter(p => p.status === 'Delivered');

  const handleVerify = (id: string) => {
    const code = otpInputs[id] || '';
    if (!code.trim()) return;
    completeDelivery(id, code);
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Amazon Parcel Management / My Deliveries"
      title="My Deliveries"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
          <h2 className="text-xl font-black text-slate-900">Your Active Deliveries</h2>
          <p className="text-xs text-slate-400">Enter recipient OTP at doorstep to mark as completed & receive reward instant payout!</p>
        </div>

        {/* Active In-Transit Deliveries */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">In Transit ({activeDeliveries.length})</h3>
          
          {activeDeliveries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-slate-400 text-xs font-medium">
              No active delivery tasks right now. Go to &quot;Find Deliveries&quot; to pick up packages!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDeliveries.map(p => (
                <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{p.courier}</h4>
                      <p className="text-[10px] font-mono text-slate-400">{p.trackingNumber}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      In Transit
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 font-medium">
                    <p><span className="text-slate-400">Deliver To:</span> {p.destinationHostel}, Room {p.destinationRoom}</p>
                    <p><span className="text-slate-400">Recipient:</span> {p.recipientName}</p>
                    <p><span className="text-slate-400">Reward:</span> <strong className="text-emerald-600">₹{p.reward}</strong></p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase">
                      Enter Recipient OTP to Handoff:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 4829"
                        maxLength={4}
                        value={otpInputs[p.id] || ''}
                        onChange={e => setOtpInputs({ ...otpInputs, [p.id]: e.target.value })}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleVerify(p.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Verify & Claim ₹{p.reward}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Deliveries */}
        {completedDeliveries.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Completed Deliveries</h3>
            <div className="space-y-2">
              {completedDeliveries.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Delivered {p.courier} to Room {p.destinationRoom}</span>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">+₹{p.reward} Credited</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
