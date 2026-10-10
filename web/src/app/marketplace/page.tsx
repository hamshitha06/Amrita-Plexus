'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Star, Wallet, MapPin, X, Plus, ClipboardList, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function BuySellMarketplacePage() {
  const { marketplaceItems, buyMarketplaceItem, walletBalance, userName } = usePlexus();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Items');
  const [condition, setCondition] = useState('Any');
  const [status, setStatus] = useState('All');

  const categories = ['All Items', 'Books & Study', 'Electronics & Gadgets', 'Hostel Essentials', 'Cycles & Mobility', 'Lab Kits & Tools', 'Miscellaneous'];
  const conditions = ['Any', 'Brand New', 'Like New', 'Good', 'Fair'];
  const statuses = ['All', 'Available', 'Reserved', 'Sold'];

  const filteredItems = marketplaceItems.filter(item => {
    const matchSearch = !search.trim() || item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Items' || item.category === category;
    const matchCond = condition === 'Any' || item.condition === condition;
    const matchStatus = status === 'All' || item.status === status;
    return matchSearch && matchCat && matchCond && matchStatus;
  });

  const availableCount = marketplaceItems.filter(i => i.status === 'Available').length;
  const myListingsCount = marketplaceItems.filter(i => i.sellerName === userName).length;

  return (
    <AppLayout
      breadcrumb="Student Portal / Campus Marketplace / Buy & Sell"
      title="Buy & Sell Marketplace"
    >
      <div className="space-y-6">
        
        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                🛒 Campus Peer-to-Peer Exchange
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🛒</span> Campus Buy &amp; Sell Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Direct peer-to-peer textbook, calculator, cycle, and hostel exchange. All items listed by verified campus peers with safe in-hostel pickup.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs sm:text-sm shrink-0">
                <Wallet className="w-4 h-4 text-emerald-600" /> Wallet: ₹{walletBalance}
              </div>
              <Link
                href="/marketplace/post"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post Item for Sale</span>
              </Link>
              <Link
                href="/marketplace/my-listings"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ClipboardList className="w-4 h-4 text-slate-500" />
                <span>My Listings ({myListingsCount})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Listings</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{marketplaceItems.length}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">Active campus items</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-emerald-600">
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Available Now</p>
              <h3 className="text-3xl font-black text-emerald-700 mt-1">{availableCount}</h3>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">Ready for instant pickup</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Active Posts</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{myListingsCount}</h3>
            </div>
            <Link href="/marketplace/my-listings" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mt-2">
              Manage Listings →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Wallet Balance</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">₹{walletBalance}</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium mt-2">Instant P2P settlement</span>
          </div>
        </div>

        {/* Filters & Search Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Search listings by title, subject, brand, keywords (e.g. Mathematics, Casio, Bicycle, Kettle)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0">
                Search
              </button>
              <button 
                onClick={() => { setSearch(''); setCategory('All Items'); setCondition('Any'); setStatus('All'); }}
                className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => {
              const count = cat === 'All Items' ? marketplaceItems.length : marketplaceItems.filter(i => i.category === cat).length;
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition:</span>
              <div className="flex gap-1.5 flex-wrap">
                {conditions.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCondition(c)} 
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                      condition === c ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <div className="flex gap-1.5 flex-wrap">
                {statuses.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStatus(s)} 
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                      status === s ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900 font-extrabold">{filteredItems.length}</span> verified campus listings
          </p>
        </div>

        {/* Catalog Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching items found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or clearing filter selections to view available campus listings.
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All Items'); setCondition('Any'); setStatus('All'); }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const isOwner = item.sellerName === userName;
              const isAvailable = item.status === 'Available';

              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                        {item.category}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-900">₹{item.sellingPrice}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Seller:</span>
                        <span className="font-bold text-slate-800">{item.sellerName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Pickup Location:</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.pickupLocation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Condition:</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                          {item.condition}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          item.status === 'Reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isOwner ? (
                      <Link 
                        href="/marketplace/my-listings"
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <ClipboardList className="w-4 h-4" /> Manage in My Listings
                      </Link>
                    ) : isAvailable ? (
                      <button 
                        onClick={() => {
                          const ok = buyMarketplaceItem(item.id);
                          if (ok) {
                            alert(`🎉 Purchase Successful! ₹${item.sellingPrice} deducted from your wallet.\nPlease meet ${item.sellerName} at ${item.pickupLocation} for pickup.`);
                          } else {
                            alert('❌ Insufficient E-Wallet balance. Please add funds to your wallet.');
                          }
                        }}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Wallet className="w-4 h-4" /> Buy for ₹{item.sellingPrice} (Pay via Wallet)
                      </button>
                    ) : (
                      <button 
                        disabled 
                        className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
                      >
                        Item {item.status}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
