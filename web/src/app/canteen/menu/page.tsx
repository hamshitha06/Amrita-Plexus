'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Info, Camera } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { CanteenItem } from '@/contexts/PlexusContext';

function MenuItemCard({ item, canteenId, canteenName }: { item: CanteenItem; canteenId: string; canteenName: string }) {
  const { cart, addToCart, updateCartQty } = usePlexus();
  const cartEntry = cart.find(c => c.id === item.id);
  const qty = cartEntry?.quantity ?? 0;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-amber-200 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {item.category}
          </span>
          <span className="text-base font-black text-slate-900">₹{item.price}</span>
        </div>
        <h4 className="font-extrabold text-base text-slate-900 mt-2 leading-snug">{item.title}</h4>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400 font-medium">⏱ {item.prepTime}</p>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
            AI {item.aiVerifiedScore}%
          </span>
        </div>
      </div>

      {qty > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 bg-amber-50 border border-amber-200 rounded-xl p-1.5">
            <button
              onClick={() => updateCartQty(item.id, -1)}
              className="w-8 h-8 rounded-lg bg-amber-200 hover:bg-amber-300 flex items-center justify-center font-black text-amber-800 cursor-pointer text-lg leading-none"
            >
              −
            </button>
            <span className="flex-1 text-center font-black text-sm text-amber-800">{qty}</span>
            <button
              onClick={() => addToCart(item, canteenId, canteenName)}
              className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 flex items-center justify-center font-black text-white cursor-pointer text-lg leading-none"
            >
              +
            </button>
          </div>
          <span className="text-xs font-black text-slate-700">₹{item.price * qty}</span>
        </div>
      ) : (
        <button
          onClick={() => addToCart(item, canteenId, canteenName)}
          className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Add to Cart · ₹{item.price}
        </button>
      )}
    </div>
  );
}

export default function CanteenDigitalMenuPage() {
  const { canteens, selectedCanteenId, setSelectedCanteenId, canteenItems, cartCount, cartTotal } = usePlexus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const activeCanteen = canteens.find(c => c.id === selectedCanteenId) || canteens[0];

  const canteenFiltered = canteenItems.filter(i => i.canteenId === selectedCanteenId);
  const categories = ['All', ...Array.from(new Set(canteenFiltered.map(i => i.category)))];

  const filteredItems = canteenFiltered.filter(item => {
    const matchSearch = !searchQuery.trim() || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <AppLayout
      breadcrumb="Student Portal / Hostel Services / Canteen / Digital Menu"
      title={`${activeCanteen.name} — Digital Menu`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/canteen" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 mb-1">
              ← Back to Dashboard
            </Link>
            <h2 className="text-2xl font-black text-slate-900">{activeCanteen.name} — Digital Menu</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              AI-extracted items &amp; prices · {activeCanteen.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/canteen/upload-menu" className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all">
              📷 Upload Menu Photo
            </Link>
            <Link
              href="/canteen/cart"
              className="relative px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cartCount})</span>
            </Link>
          </div>
        </div>

        {/* Cart Banner */}
        {cartCount > 0 && (
          <div className="bg-amber-500 rounded-2xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-bold">{cartCount} item{cartCount > 1 ? 's' : ''} in cart · ₹{cartTotal}</span>
            </div>
            <Link href="/canteen/cart" className="bg-white text-amber-600 font-black text-xs px-4 py-1.5 rounded-lg hover:bg-amber-50 transition-all">
              View Cart &amp; Checkout →
            </Link>
          </div>
        )}

        {/* Canteen Selector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">🏛️ SELECT CAMPUS CANTEEN</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{canteens.length} Canteens</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {canteens.map(cant => (
              <button
                key={cant.id}
                onClick={() => { setSelectedCanteenId(cant.id); setSelectedCategory('All'); setSearchQuery(''); }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  cant.id === selectedCanteenId
                    ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/20'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{cant.icon}</span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{cant.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{cant.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Canteen Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-900">{activeCanteen.name} Published Menu</h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">Recently Uploaded</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Last uploaded: {activeCanteen.lastUploaded} by {activeCanteen.uploadedBy}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-800 font-medium max-w-sm flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Menu prices and availability may change. Please confirm with the canteen.</span>
          </div>
        </div>

        {/* Search & Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={`Search ${activeCanteen.name} items...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
              />
            </div>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer">
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-2xs text-center space-y-3">
            <p className="text-3xl">🍽️</p>
            <h4 className="font-extrabold text-sm text-slate-800">No items found</h4>
            <p className="text-xs text-slate-400 font-medium">
              {searchQuery ? `No results for "${searchQuery}"` : 'No items in this category. Upload the menu to add items!'}
            </p>
            <Link href="/canteen/upload-menu" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
              <Camera className="w-3.5 h-3.5" /> Upload Menu Photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} canteenId={activeCanteen.id} canteenName={activeCanteen.name} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
