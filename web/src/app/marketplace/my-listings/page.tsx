'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { Edit, Trash2, ArrowRightLeft, Plus, ClipboardList, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function MyListingsPage() {
  const { userName, marketplaceItems, changeMarketplaceItemStatus, deleteMarketplaceItem } = usePlexus();
  
  const myListings = marketplaceItems.filter(i => i.sellerName === userName);
  
  const totalPosted = myListings.length;
  const activeCount = myListings.filter(i => i.status === 'Available').length;
  const reservedCount = myListings.filter(i => i.status === 'Reserved').length;
  const soldCount = myListings.filter(i => i.status === 'Sold').length;

  return (
    <AppLayout
      breadcrumb="Student Portal / Campus Marketplace / My Listings"
      title="My Campus Listings (Management)"
    >
      <div className="space-y-6">
        
        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Management Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>📋</span> My Campus Listings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Manage your posted items, change status between Available/Reserved/Sold, or edit/delete listings.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <Link
                href="/marketplace/post"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Post New Item</span>
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Catalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Posted</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPosted}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">All time published</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-emerald-600">
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active / Available</p>
              <h3 className="text-3xl font-black text-emerald-700 mt-1">{activeCount}</h3>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-2">Open for student orders</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-amber-500">
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Reserved for Meetup</p>
              <h3 className="text-3xl font-black text-amber-700 mt-1">{reservedCount}</h3>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-2">Pending campus exchange</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sold / Completed</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{soldCount}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">Successfully exchanged</p>
          </div>
        </div>

        {/* Listings Table Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Active &amp; Past Listings</h3>
              <p className="text-xs text-slate-500 font-medium">Update item status or remove sold listings anytime</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Listing Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Pickup Location</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {myListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-700">You haven't posted any items for sale yet</p>
                      <p className="text-xs text-slate-400 mt-1">Post textbooks, calculators, or hostel essentials to earn money from campus peers.</p>
                      <Link 
                        href="/marketplace/post" 
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold mt-4 shadow-xs"
                      >
                        <Plus className="w-4 h-4" /> Post Your First Item
                      </Link>
                    </td>
                  </tr>
                ) : (
                  myListings.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 max-w-xs">
                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400 font-medium">Condition: {item.condition} • ID: {item.id}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-4 font-black text-emerald-700 text-sm">
                        ₹{item.sellingPrice}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          item.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          item.status === 'Reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        {item.pickupLocation}
                      </td>

                      <td className="p-4 pr-6 text-right space-x-1.5">
                        {/* Cycle Status */}
                        <button
                          onClick={() => {
                            const nextStatus = item.status === 'Available' ? 'Reserved' : item.status === 'Reserved' ? 'Sold' : 'Available';
                            changeMarketplaceItemStatus(item.id, nextStatus);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                          title="Cycle status (Available -> Reserved -> Sold)"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" /> Status
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete listing "${item.title}"?`)) {
                              deleteMarketplaceItem(item.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
