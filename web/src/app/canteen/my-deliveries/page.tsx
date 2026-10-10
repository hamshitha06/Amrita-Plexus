'use client';

import React from 'react';
import Link from 'next/link';
import { PackageOpen, MapPin, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function MyDeliveriesPage() {
  const { myAcceptedDeliveries, markPickedUp, markDelivered } = usePlexus();

  return (
    <AppLayout
      breadcrumb="Student Portal / Canteen / My Deliveries"
      title="My Deliveries"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/canteen/deliver" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Find More Jobs
            </Link>
            <h2 className="text-2xl font-black text-slate-900">My Active Deliveries</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Track and complete the food deliveries you accepted.
            </p>
          </div>
        </div>

        {myAcceptedDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-2xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">No active deliveries</h4>
              <p className="text-sm text-slate-400 font-medium mt-1">You haven&apos;t accepted any jobs right now.</p>
            </div>
            <Link href="/canteen/deliver" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
              Find Delivery Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {myAcceptedDeliveries.map(req => (
              <div key={req.id} className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-2xs ring-4 ring-emerald-50/50">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Info Section */}
                  <div className="flex-1 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Active Task
                          </span>
                          <span className="text-xs font-black text-slate-500">{req.requestNumber}</span>
                        </div>
                        <h3 className="font-black text-lg text-slate-900 mt-2">Deliver to: {req.requesterName}</h3>
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mt-1">
                          Earn ₹{req.deliveryFee}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pickup */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                        <div className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                          1. PICKUP
                        </div>
                        <p className="font-extrabold text-sm text-slate-900 mt-2">{req.canteenName}</p>
                        <p className="text-xs text-slate-500 font-medium mb-3">{req.canteenLocation}</p>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Items to collect:</p>
                          <ul className="text-xs font-bold text-slate-800 list-disc list-inside">
                            {req.items.map((i, idx) => <li key={idx}>{i.quantity}x {i.title}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Dropoff */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                        <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                          2. DROPOFF
                        </div>
                        <p className="font-extrabold text-sm text-slate-900 mt-2">{req.deliveryAddress}</p>
                        {req.instructions && (
                          <div className="mt-3 bg-white border border-slate-200 p-2.5 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Instructions:</p>
                            <p className="text-xs font-medium text-slate-700">{req.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="lg:w-64 shrink-0 flex flex-col justify-center space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider mb-2">Update Status</p>
                    
                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => markPickedUp(req.id)}
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <PackageOpen className="w-4 h-4" /> I&apos;ve Picked It Up
                      </button>
                    )}

                    {req.status === 'Picked Up' && (
                      <button
                        onClick={() => markDelivered(req.id)}
                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-300"></span>
                        <span className="relative flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                        </span>
                      </button>
                    )}

                    <p className="text-[10px] text-slate-400 text-center font-medium px-2">
                      {req.status === 'Accepted' 
                        ? 'Click after collecting all items from the canteen.' 
                        : 'Click after handing over the food to the requester.'}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
