'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { ArrowLeft, Plus, CheckCircle2, Tag, DollarSign, MapPin, FileText } from 'lucide-react';

export default function PostItemPage() {
  const router = useRouter();
  const { publishMarketplaceItem } = usePlexus();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !condition || !sellingPrice || !pickupLocation || !description) return;
    
    publishMarketplaceItem({
      title,
      category,
      condition,
      sellingPrice: parseInt(sellingPrice, 10),
      originalPrice: originalPrice ? parseInt(originalPrice, 10) : undefined,
      pickupLocation,
      description,
    });
    router.push('/marketplace/my-listings');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Campus Marketplace / Post Item"
      title="Post an Item for Sale"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Publishing Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>➕</span> Post an Item for Sale
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Fill in item details, price, condition, and hostel pickup location to list your item instantly in the student marketplace.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/marketplace/my-listings"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>My Listings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Listing Title <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Digital Logic & Microprocessors (Mano 5th Ed)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select 
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="">-- Select Category --</option>
                  <option>Books &amp; Study</option>
                  <option>Electronics &amp; Gadgets</option>
                  <option>Hostel Essentials</option>
                  <option>Cycles &amp; Mobility</option>
                  <option>Lab Kits &amp; Tools</option>
                  <option>Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Condition <span className="text-rose-500">*</span>
                </label>
                <select 
                  required
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="">-- Select Condition --</option>
                  <option>Brand New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={sellingPrice}
                  onChange={e => setSellingPrice(e.target.value)}
                  placeholder="e.g. 45" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Original Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="number" 
                  min="0"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 95" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Hostel Pickup Location <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                placeholder="e.g. Gargi Hostel (Block A), Room A-201" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Item Description <span className="text-rose-500">*</span>
              </label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the item's condition, usage duration, or included cables/notes..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link 
                href="/marketplace/my-listings" 
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-all"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Post Listing
              </button>
            </div>

          </form>
        </div>

      </div>
    </AppLayout>
  );
}
