'use client';

import React from 'react';
import { Search, MapPin, Truck, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function FindDeliveriesPage() {
  const { parcels, acceptDelivery } = usePlexus();
  const availableParcels = parcels.filter(p => p.status === 'Awaiting Delivery');

  return (
    <AppLayout
      breadcrumb="Student Portal / Amazon Parcel Management / Find Deliveries"
      title="Find Deliveries"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
          <h2 className="text-xl font-black text-slate-900">Available Peer Delivery Tasks</h2>
          <p className="text-xs text-slate-400">Pick up packages from campus gate vaults when returning to hostel & earn wallet rewards!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableParcels.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">📦</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{p.courier}</h3>
                      <p className="text-[10px] font-mono text-slate-400">{p.trackingNumber}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    +₹{p.reward} Reward
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                  <p><span className="text-slate-400">Pickup Vault:</span> {p.arrivalGate}</p>
                  <p><span className="text-slate-400">Deliver To:</span> {p.destinationHostel}, Room {p.destinationRoom}</p>
                  <p><span className="text-slate-400">Recipient:</span> {p.recipientName}</p>
                </div>
              </div>

              <button
                onClick={() => acceptDelivery(p.id)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Accept Delivery Task (+₹{p.reward})</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
