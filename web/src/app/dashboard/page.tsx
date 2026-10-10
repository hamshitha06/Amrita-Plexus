'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, Truck, Wallet, Plus, Search, ArrowRight, CheckCircle2, 
  Clock, MapPin, Sparkles, Utensils, Moon, Car, Briefcase, 
  ShoppingBag, ShieldAlert, ChevronRight, FileQuestion, ArrowUpRight 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { AddParcelModal } from '@/components/modals/AddParcelModal';
import { AddWalletModal } from '@/components/modals/AddWalletModal';

export default function MasterDashboardPage() {
  const { 
    userName, userHostel, userRoom, walletBalance, parcels, snacks, 
    cartCount, carpoolRides, campusServices, marketplaceItems, 
    foundReports, potentialMatches, lostReports 
  } = usePlexus();

  const [isAddParcelModalOpen, setIsAddParcelModalOpen] = useState(false);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);

  const awaitingParcelsCount = parcels.filter(p => p.status === 'Awaiting Delivery').length;
  const activeDeliveriesCount = parcels.filter(p => p.status === 'In Transit').length;
  const availableRidesCount = carpoolRides.filter(r => r.status === 'AVAILABLE').length;
  const availableMarketplaceCount = marketplaceItems.filter(m => m.status === 'Available').length;
  const activeFoundCount = foundReports.filter(f => f.status !== 'Collected' && f.status !== 'Closed').length;
  const pendingMatchesCount = potentialMatches.filter(m => m.status === 'Pending Verification').length;

  return (
    <AppLayout
      breadcrumb="Student Portal / Amrita-Plexus Central Hub"
      title="Main Dashboard"
    >
      <div className="space-y-6">

        {/* 1. Main Welcome Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  ⚡ Amrita-Plexus Integrated Platform
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  📍 {userHostel} • Room {userRoom}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {userName}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Your unified campus command center. Access parcels, canteen orders, carpooling, peer marketplace, student skills, and intelligent lost &amp; found.
              </p>
            </div>

            {/* Global Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsAddWalletModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>₹{walletBalance} Balance</span>
              </button>

              <button
                onClick={() => setIsAddParcelModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Parcel Request</span>
              </button>

              <Link
                href="/marketplace/post"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>+ Sell Item</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Unified Master Metrics Bar (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <Link href="/parcels/my-parcels" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600">
              <Package className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parcels</p>
            <h3 className="text-2xl font-black text-slate-900">{awaitingParcelsCount}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Awaiting pickup</p>
          </Link>

          <Link href="/hostel/snacks" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-teal-600">
              <ShoppingBag className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">P2P Snacks</p>
            <h3 className="text-2xl font-black text-slate-900">{snacks.length}</h3>
            <p className="text-[10px] text-teal-600 font-medium">In hostel canteens</p>
          </Link>

          <Link href="/canteen/cart" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600">
              <Utensils className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Canteen Cart</p>
            <h3 className="text-2xl font-black text-slate-900">{cartCount}</h3>
            <p className="text-[10px] text-amber-600 font-medium">Items ready to order</p>
          </Link>

          <Link href="/carpool/find" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600">
              <Car className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Carpools</p>
            <h3 className="text-2xl font-black text-slate-900">{availableRidesCount}</h3>
            <p className="text-[10px] text-blue-600 font-medium">Rides available</p>
          </Link>

          <Link href="/marketplace" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
              <ShoppingBag className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketplace</p>
            <h3 className="text-2xl font-black text-slate-900">{availableMarketplaceCount}</h3>
            <p className="text-[10px] text-emerald-600 font-medium">Peer items for sale</p>
          </Link>

          <Link href="/lost-found/matches" className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1 block group">
            <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600">
              <ShieldAlert className="w-4 h-4" />
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lost &amp; Found</p>
            <h3 className="text-2xl font-black text-indigo-700">{pendingMatchesCount}</h3>
            <p className="text-[10px] text-indigo-600 font-medium">Smart matches detected</p>
          </Link>
        </div>

        {/* 3. Platform Subsections Hub (7 Interactive Module Launcher Cards) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Campus Modules &amp; Subsections</h3>
              <p className="text-xs text-slate-500 font-medium">Direct access to every integrated feature of Amrita-Plexus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. Parcel Management */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-blue-600">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-extrabold uppercase">
                    📦 Amazon Parcels
                  </span>
                  <span className="text-xs font-bold text-slate-400">{parcels.length} Total</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Gate-to-Hostel Delivery</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Request parcel pickup from gate to hostel or deliver peer packages to earn rewards.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/parcels/my-parcels" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center">
                  My Parcels
                </Link>
                <Link href="/parcels/find-deliveries" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Earn Fees
                </Link>
              </div>
            </div>

            {/* 2. Hostel Services */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-teal-600">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-extrabold uppercase">
                    🍕 Hostel Services
                  </span>
                  <span className="text-xs font-bold text-slate-400">Night Canteen</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">P2P Snacks &amp; Night Canteen</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Instant student snack exchange, AI night canteen menu scanner, and hostel chat.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/hostel/snacks" className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all text-center">
                  P2P Snacks
                </Link>
                <Link href="/hostel/canteen" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Night Canteen
                </Link>
              </div>
            </div>

            {/* 3. Canteen & Food */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-amber-500">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-extrabold uppercase">
                    ☕ Canteen &amp; Food
                  </span>
                  <span className="text-xs font-bold text-slate-400">Digital Menu</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Campus Canteens &amp; Cart</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Explore food items from main canteen, upload menu photos, or deliver orders to peers.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/canteen/menu" className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all text-center">
                  Digital Menu
                </Link>
                <Link href="/canteen/cart" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Cart ({cartCount})
                </Link>
              </div>
            </div>

            {/* 4. Carpooling */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-blue-500">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-extrabold uppercase">
                    🚗 Carpooling
                  </span>
                  <span className="text-xs font-bold text-slate-400">{availableRidesCount} Rides</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Campus Ride Sharing</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Offer rides or book empty seats for weekend travel and city commuting with verified peers.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/carpool/find" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center">
                  Find Ride
                </Link>
                <Link href="/carpool/offer" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Offer Ride
                </Link>
              </div>
            </div>

            {/* 5. Services & Skills */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-purple-600">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-extrabold uppercase">
                    🛠️ Services &amp; Skills
                  </span>
                  <span className="text-xs font-bold text-slate-400">{campusServices.length} Skills</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Student Services Directory</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  DSA tutoring, guitar lessons, laptop formatting, electrical repair, and student businesses.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/services" className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all text-center">
                  Discover Services
                </Link>
                <Link href="/services/offer" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Offer Skill
                </Link>
              </div>
            </div>

            {/* 6. Campus Marketplace */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-emerald-600">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold uppercase">
                    🛒 Marketplace
                  </span>
                  <span className="text-xs font-bold text-slate-400">{availableMarketplaceCount} Items</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Buy &amp; Sell Student Goods</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Peer-to-peer textbook exchange, scientific calculators, cycles, kettles, and hostel items.
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link href="/marketplace" className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all text-center">
                  Browse Catalog
                </Link>
                <Link href="/marketplace/post" className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center">
                  Post Item
                </Link>
              </div>
            </div>

            {/* 7. Intelligent Lost & Found */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border-t-4 border-t-indigo-600 md:col-span-2 lg:col-span-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-extrabold uppercase">
                      🔍 Smart Lost &amp; Found System
                    </span>
                    <span className="text-xs font-bold text-indigo-600">{pendingMatchesCount} Matches Pending</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Intelligent Matching &amp; Vault Recovery</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-2xl">
                    Risk-based security levels (L1-L5), confidential feature matching, direct local photo upload, dynamic ownership questions, and 6-digit handover OTP tokens.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href="/lost-found" className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                    Overview Catalog
                  </Link>
                  <Link href="/lost-found/report-lost" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                    + Report Lost
                  </Link>
                  <Link href="/lost-found/custody" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                    Custody Desk
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      {isAddParcelModalOpen && (
        <AddParcelModal isOpen={isAddParcelModalOpen} onClose={() => setIsAddParcelModalOpen(false)} />
      )}
      {isAddWalletModalOpen && (
        <AddWalletModal isOpen={isAddWalletModalOpen} onClose={() => setIsAddWalletModalOpen(false)} />
      )}
    </AppLayout>
  );
}
