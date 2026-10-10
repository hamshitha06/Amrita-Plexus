'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, FoundItemReport } from '@/contexts/PlexusContext';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2, FileQuestion, ArrowLeft } from 'lucide-react';
import { ClaimVerificationModal } from '@/components/modals/ClaimVerificationModal';

export default function PotentialMatchesPage() {
  const { potentialMatches, lostReports, foundReports } = usePlexus();

  const [selectedFoundItem, setSelectedFoundItem] = useState<FoundItemReport | null>(null);

  const activeMatches = potentialMatches.filter(m => m.status === 'Pending Verification');

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found / Potential Matches"
      title="Intelligent Lost-Found Matches"
    >
      <div className="space-y-6">

        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                ✨ Automated Matching Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>✨</span> Potential Item Matches
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Our weighted matching algorithm compares category, description, and location proximity to pair lost item reports with newly registered found items.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/lost-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Detected High-Confidence Pairs</h3>
            <span className="text-xs font-bold text-slate-500">
              {activeMatches.length} pending matches
            </span>
          </div>

          {activeMatches.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="font-bold text-sm text-slate-700">No new potential matches detected yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When a new found item matches your lost report parameters, it will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeMatches.map(match => {
                const lostItem = lostReports.find(l => l.id === match.lostReportId);
                const foundItem = foundReports.find(f => f.id === match.foundReportId);

                if (!lostItem || !foundItem) return null;

                return (
                  <div key={match.id} className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
                    
                    {/* Match Score Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full font-black text-xs shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {match.matchScore}% Match Confidence
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Match ID: #{match.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-bold">Detected: {match.detectedAt}</span>
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                      
                      {/* Lost Side */}
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          Your Lost Report (#{lostItem.id})
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{lostItem.itemName}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{lostItem.description}</p>
                        <div className="text-[11px] text-slate-500 font-medium pt-1">
                          Last Seen: <span className="font-bold text-slate-800">{lostItem.lastSeenLocation}</span> ({lostItem.dateLost})
                        </div>
                      </div>

                      {/* Found Side */}
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                          Registered Found Item (#{foundItem.id})
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{foundItem.itemName}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{foundItem.description}</p>
                        <div className="text-[11px] text-slate-500 font-medium pt-1">
                          Found At: <span className="font-bold text-slate-800">{foundItem.foundLocation}</span> ({foundItem.dateFound})
                        </div>
                      </div>

                    </div>

                    {/* Reasoning & CTA */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs font-medium text-slate-600">
                        <span className="font-bold text-slate-900">Why matched:</span> {match.matchReason}
                      </p>

                      <button
                        onClick={() => setSelectedFoundItem(foundItem)}
                        className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" /> Initiate Ownership Verification
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Claim Modal */}
        {selectedFoundItem && (
          <ClaimVerificationModal
            item={selectedFoundItem}
            onClose={() => setSelectedFoundItem(null)}
          />
        )}

      </div>
    </AppLayout>
  );
}
