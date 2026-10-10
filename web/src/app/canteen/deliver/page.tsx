'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Navigation, IndianRupee, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function DeliverAndEarnPage() {
  const { openFoodRequests, acceptDeliveryJob } = usePlexus();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = openFoodRequests.filter(req =>
    req.canteenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.requesterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      breadcrumb="Student Portal / Canteen / Deliver & Earn"
      title="Deliver & Earn"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/canteen" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Canteen Home
            </Link>
            <h2 className="text-2xl font-black text-slate-900">Peer Delivery Jobs</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Help your peers by delivering food &amp; earn wallet cash!
            </p>
          </div>
          <Link
            href="/canteen/my-deliveries"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
          >
            My Active Deliveries →
          </Link>
        </div>

        {/* Earning Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xs text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-9xl opacity-10">🛵</div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-100" />
                <h3 className="font-extrabold text-lg">Earn while you walk!</h3>
              </div>
              <p className="text-emerald-50 text-sm font-medium max-w-lg leading-relaxed">
                Heading to the canteen? Check if anyone from your hostel ordered food. Pick it up, drop it off, and earn the delivery fee instantly into your E-Wallet!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center min-w-[140px] shrink-0">
              <p className="text-emerald-50 text-xs font-bold uppercase tracking-wider mb-1">Open Jobs</p>
              <p className="text-4xl font-black">{openFoodRequests.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
          <input
            type="text"
            placeholder="Search by canteen, hostel, or student name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 shadow-2xs rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-slate-400"
          />
        </div>

        {/* Jobs List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-2xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800">No open delivery jobs</h4>
              <p className="text-sm text-slate-400 font-medium mt-1 max-w-md mx-auto">
                {searchQuery ? `No jobs matching "${searchQuery}"` : 'All peer requests have been picked up. Check back later!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map(req => (
              <div key={req.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 hover:border-emerald-200 transition-all flex flex-col justify-between">
                
                {/* Job Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {req.requestNumber}
                      </span>
                      <h4 className="font-black text-slate-900 mt-1">{req.requesterName}</h4>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-center shrink-0">
                      <p className="text-[10px] font-bold uppercase">Earn</p>
                      <p className="font-black text-lg leading-none">₹{req.deliveryFee}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs">🏪</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup From</p>
                        <p className="font-extrabold text-xs text-slate-800">{req.canteenName}</p>
                        <p className="text-[10px] text-slate-500">{req.canteenLocation}</p>
                      </div>
                    </div>
                    
                    <div className="w-0.5 h-4 bg-slate-200 ml-3"></div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Deliver To</p>
                        <p className="font-extrabold text-xs text-slate-800">{req.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items & Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 mb-1.5">Items to pickup (Total: ₹{req.foodSubtotal})</p>
                    <ul className="text-xs font-semibold text-slate-800 space-y-1">
                      {req.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => acceptDeliveryJob(req.id)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Accept Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
