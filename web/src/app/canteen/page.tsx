'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Truck, Camera, ArrowRight, ShieldCheck, MapPin, ClipboardList, Info, Star } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function CanteenHomePage() {
  const { canteens, canteenItems, openFoodRequests } = usePlexus();

  // Quick stats
  const activeCanteensCount = canteens.length;
  const popularItems = canteenItems.filter(i => i.aiVerifiedScore > 98).slice(0, 3);
  const totalOpenJobs = openFoodRequests.length;

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Canteen Hub"
      title="Campus Canteen Hub"
    >
      <div className="space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Food &amp; Canteens 🍕</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Digital menus, P2P food delivery, and AI menu scanning.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search dishes or canteens..."
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 shadow-xs text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 space-y-4">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-3 border border-white/20">
                Peer-to-Peer Delivery
              </span>
              <h2 className="text-2xl md:text-3xl font-black leading-tight max-w-lg">
                Craving food but too lazy to walk?
              </h2>
              <p className="text-amber-50 text-sm font-medium mt-2 max-w-md">
                Order from any campus canteen and let a peer deliver it to your room. Or, earn money by delivering food to others!
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/canteen/menu" className="px-5 py-2.5 bg-white text-amber-600 rounded-xl text-xs font-bold shadow-xs hover:bg-amber-50 transition-all flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> Order Food
              </Link>
              <Link href="/canteen/deliver" className="px-5 py-2.5 bg-amber-600 border border-amber-400 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700 transition-all flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Deliver &amp; Earn
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Actions) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/canteen/menu" className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Digital Menus</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">Browse live menus from {activeCanteensCount} campus canteens and add to cart.</p>
              </Link>

              <Link href="/canteen/upload-menu" className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-slate-900">AI Menu Scanner</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">Snap a photo of the canteen blackboard. AI extracts items automatically.</p>
              </Link>

              <Link href="/canteen/my-requests" className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-slate-900">My Requests</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">Track food you&apos;ve ordered or cancel pending requests.</p>
              </Link>

              <Link href="/canteen/deliver" className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all group relative overflow-hidden">
                {totalOpenJobs > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                    {totalOpenJobs} OPEN
                  </div>
                )}
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Deliver Jobs</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">Accept peer delivery tasks and earn money straight to your wallet.</p>
              </Link>
            </div>

            {/* Popular Items preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">🔥 Popular on Campus</h3>
                <Link href="/canteen/menu" className="text-[10px] font-bold text-amber-600 hover:text-amber-700">View All →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {popularItems.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="font-black text-sm text-amber-700 mt-0.5">₹{item.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="text-[9px] font-bold text-slate-400">AI Verified {item.aiVerifiedScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Canteen Directory */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider flex items-center gap-2">
                🏛️ Canteen Directory
              </h3>
              <div className="space-y-3">
                {canteens.map(cant => (
                  <div key={cant.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="text-2xl mt-0.5">{cant.icon}</div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{cant.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-0.5">
                        <MapPin className="w-3 h-3" /> {cant.location}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1">Updated {cant.lastUploaded}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-blue-900">Wallet Integration</h4>
                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                  All food requests and delivery earnings are processed automatically through your Plexus E-Wallet. No cash needed!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
