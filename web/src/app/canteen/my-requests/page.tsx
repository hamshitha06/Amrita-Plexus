'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, Plus, XCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { FoodRequest } from '@/contexts/PlexusContext';

const STATUS_CONFIG: Record<FoodRequest['status'], { label: string; icon: string; badge: string }> = {
  Open:      { label: 'Open — Waiting for deliverer', icon: '⏳', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  Accepted:  { label: 'Accepted — Peer heading to canteen', icon: '🏃', badge: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'Picked Up': { label: 'Picked Up — On the way!', icon: '🛵', badge: 'bg-purple-50 text-purple-700 border border-purple-200' },
  Delivered: { label: 'Delivered', icon: '✅', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  Cancelled: { label: 'Cancelled', icon: '✕', badge: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

export default function MyFoodRequestsPage() {
  const { myFoodRequests, cancelFoodRequest } = usePlexus();

  const activeRequests = myFoodRequests.filter(r => !['Delivered', 'Cancelled'].includes(r.status));
  const pastRequests = myFoodRequests.filter(r => ['Delivered', 'Cancelled'].includes(r.status));

  return (
    <AppLayout
      breadcrumb="Student Portal / Canteen / My Food Requests"
      title="My P2P Food Requests"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/canteen" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Canteen Home
            </Link>
            <h2 className="text-2xl font-black text-slate-900">My P2P Food Requests</h2>
          </div>
          <Link
            href="/canteen/menu"
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request New Food</span>
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">HOW P2P FOOD DELIVERY WORKS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', icon: '🛒', title: 'Browse & Add to Cart', desc: 'Select items from the canteen digital menu.' },
              { step: '2', icon: '📬', title: 'Post Delivery Request', desc: 'Set your room address and delivery fee incentive.' },
              { step: '3', icon: '🏃', title: 'Peer Delivers', desc: 'A fellow student picks up and delivers to your room.' },
            ].map(s => (
              <div key={s.step} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-[11px] font-black flex items-center justify-center">{s.step}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900">{s.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-900">Active Food Requests</h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {activeRequests.length}
              </span>
            </div>
          </div>

          {activeRequests.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <ClipboardList className="w-7 h-7 text-slate-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">No active requests</h4>
                <p className="text-xs text-slate-400 font-medium mt-1">You haven&apos;t posted any P2P food delivery requests yet.</p>
              </div>
              <Link href="/canteen/menu" className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
                Browse Menu &amp; Request Delivery
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRequests.map(req => {
                const cfg = STATUS_CONFIG[req.status];
                return (
                  <div key={req.id} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900">{req.requestNumber}</h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Pickup: <strong className="text-slate-700">{req.canteenName}</strong> · Posted {req.postedAt}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-slate-900">₹{req.totalAmount}</p>
                        <p className="text-[10px] text-slate-400">Food + Delivery</p>
                      </div>
                    </div>

                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <p><span className="text-slate-400">Items:</span> <strong className="text-slate-800">{req.items.map(i => `${i.title} ×${i.quantity}`).join(', ')}</strong></p>
                      <p><span className="text-slate-400">Deliver to:</span> <strong className="text-slate-800">{req.deliveryAddress}</strong></p>
                      {req.instructions && <p><span className="text-slate-400">Instructions:</span> <span className="text-slate-600">{req.instructions}</span></p>}
                      {req.delivererName && <p><span className="text-slate-400">Peer Deliverer:</span> <strong className="text-emerald-700">🏃 {req.delivererName}</strong></p>}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-4 text-slate-500">
                        <span>Food: <strong className="text-slate-800">₹{req.foodSubtotal}</strong></span>
                        <span className="text-emerald-600">+ Delivery: <strong>₹{req.deliveryFee}</strong></span>
                      </div>
                      {req.status === 'Open' && (
                        <button
                          onClick={() => cancelFoodRequest(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel & Refund
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Requests */}
        {pastRequests.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-4">
              Past Requests ({pastRequests.length})
            </h3>
            <div className="space-y-3">
              {pastRequests.map(req => {
                const cfg = STATUS_CONFIG[req.status];
                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-50/40 border border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-700">{req.requestNumber}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                          {cfg.icon} {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {req.items.map(i => `${i.title} ×${i.quantity}`).join(', ')} · {req.canteenName}
                      </p>
                    </div>
                    <span className="font-black text-sm text-slate-700 shrink-0">₹{req.totalAmount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
