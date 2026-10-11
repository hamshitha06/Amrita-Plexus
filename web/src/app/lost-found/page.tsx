'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldAlert, FileQuestion, Plus, Lock, Eye, CheckCircle2, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, FoundItemReport } from '@/contexts/PlexusContext';
import { ClaimVerificationModal } from '@/components/modals/ClaimVerificationModal';

export default function LostFoundDashboardPage() {
  const { foundReports, lostReports, potentialMatches, claims } = usePlexus();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [securityLevelFilter, setSecurityLevelFilter] = useState('All');
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<FoundItemReport | null>(null);

  const categories = [
    'All',
    'Everyday Belongings',
    'Personal Belongings',
    'Valuable Electronics',
    'Sensitive Items',
    'High-Value & Jewellery'
  ];

  const filteredFoundItems = foundReports.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = !search.trim() || 
      item.itemName.toLowerCase().includes(search.toLowerCase()) || 
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.foundLocation.toLowerCase().includes(search.toLowerCase());
    const matchSec = securityLevelFilter === 'All' || item.securityLevel.toString() === securityLevelFilter;
    return matchCat && matchSearch && matchSec;
  });

  const activeFoundCount = foundReports.filter(f => f.status !== 'Collected' && f.status !== 'Closed').length;
  const activeLostCount = lostReports.filter(l => l.status !== 'Recovered' && l.status !== 'Closed').length;
  const pendingMatchesCount = potentialMatches.filter(m => m.status === 'Pending Verification').length;

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found Management"
      title="Intelligent Lost & Found System"
    >
      <div className="space-y-6">

        {/* Top Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                🔍 Smart Campus Lost &amp; Found
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🛡️</span> Intelligent Lost &amp; Found System
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Report lost or found belongings, track automated smart matches, and verify ownership securely through risk-based security levels (L1 - L5).
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <Link
                href="/lost-found/report-lost"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <FileQuestion className="w-4 h-4" />
                <span>Report Lost Item</span>
              </Link>

              <Link
                href="/lost-found/report-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Report Found Item</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Found Listings</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{activeFoundCount}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2">Available for student claims</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-rose-500">
            <div>
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Active Lost Reports</p>
              <h3 className="text-3xl font-black text-rose-700 mt-1">{activeLostCount}</h3>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-2">Under active campus search</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-amber-500">
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Potential Smart Matches</p>
              <h3 className="text-3xl font-black text-amber-700 mt-1">{pendingMatchesCount}</h3>
            </div>
            <Link href="/lost-found/matches" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 mt-2">
              View Matches ({pendingMatchesCount}) →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between border-b-4 border-b-indigo-500">
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Security Desk Custody</p>
              <h3 className="text-3xl font-black text-indigo-700 mt-1">
                {foundReports.filter(f => f.securityLevel >= 3 && f.status !== 'Collected').length}
              </h3>
            </div>
            <Link href="/lost-found/custody" className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 mt-2">
              Custody Desk →
            </Link>
          </div>
        </div>

        {/* Filter Box */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Search found belongings by name, description, location (e.g. AB-204, Casio, iPhone, Milton)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0">
                Search
              </button>
              <button 
                onClick={() => { setSearch(''); setCategory('All'); setSecurityLevelFilter('All'); }}
                className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => {
              const count = cat === 'All' ? foundReports.length : foundReports.filter(i => i.category === cat).length;
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

          {/* Security Level Filter */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Filter by Security Risk Level:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['All', '1', '2', '3', '4', '5'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSecurityLevelFilter(lvl)}
                  className={`px-3 py-1 text-[11px] font-extrabold rounded-lg border transition-all ${
                    securityLevelFilter === lvl 
                      ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl === 'All' ? 'All Security Levels' : `Level ${lvl}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Found Items Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Found Belongings Catalog</h3>
            <p className="text-xs text-slate-500 font-medium">Verified items awaiting student ownership verification</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-extrabold">{filteredFoundItems.length}</span> items
          </span>
        </div>

        {/* Grid of Found Item Listings */}
        {filteredFoundItems.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No found items match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you lost an item, please submit a Lost Report so our intelligent engine can match it automatically when reported.
            </p>
            <Link href="/lost-found/report-lost" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs">
              + Report Lost Item Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoundItems.map(item => {
              const isLevel5 = item.securityLevel === 5;
              const isHandoverReady = item.status === 'Approved for Handover';
              const isCollected = item.status === 'Collected';

              return (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                        {item.category}
                      </span>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        item.securityLevel === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.securityLevel === 2 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.securityLevel === 3 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        item.securityLevel === 4 ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        Level {item.securityLevel} Security
                      </span>
                    </div>

                    {/* Image / Privacy Placeholder */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 h-44 flex items-center justify-center">
                      {isLevel5 ? (
                        <div className="text-center p-6 space-y-2">
                          <Lock className="w-10 h-10 text-slate-400 mx-auto" />
                          <p className="text-xs font-extrabold text-slate-800">Confidential Item Photo Hidden</p>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-xs">
                            Level 5 high-value photograph is hidden for security. Ownership verification required.
                          </p>
                        </div>
                      ) : item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-1" />
                          <span className="text-xs font-bold text-slate-400">Verified Campus Listing</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                          {item.itemName}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">#{item.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Item Metadata */}
                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Found Location:
                        </span>
                        <span className="font-bold text-slate-800">{item.foundLocation}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date Found:
                        </span>
                        <span className="font-bold text-slate-800">{item.dateFound}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Current Custody:</span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px]">
                          {item.custodyLocation}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[11px]">Item Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.status === 'Reported' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          item.status === 'In Custody' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          item.status === 'Verification In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          item.status === 'Disputed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    {isCollected ? (
                      <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed">
                        Item Collected &amp; Returned
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedItemForClaim(item)}
                        className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-4 h-4" /> This Is Mine — Verify Ownership
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Claim Modal */}
        {selectedItemForClaim && (
          <ClaimVerificationModal
            item={selectedItemForClaim}
            onClose={() => setSelectedItemForClaim(null)}
          />
        )}

      </div>
    </AppLayout>
  );
}
