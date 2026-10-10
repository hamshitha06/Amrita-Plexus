'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { ShieldCheck, FileQuestion, Plus, Trash2, CheckCircle2, Clock, AlertTriangle, Key, Shield, ArrowLeft } from 'lucide-react';

export default function MyReportsAndClaimsPage() {
  const { userName, lostReports, foundReports, claims, closeLostReport, closeFoundReport } = usePlexus();

  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'claims'>('claims');

  const myLost = lostReports.filter(l => l.reporterName === userName);
  const myFound = foundReports.filter(f => f.finderName === userName);
  const myClaims = claims.filter(c => c.claimantName === userName);

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found / My Items & Claims"
      title="My Reports & Claims Management"
    >
      <div className="space-y-6">

        {/* Top Header Hero Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Personal Management Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>📋</span> My Reports &amp; Claims
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Track your active lost reports, manage submitted found items, review verification progress, and retrieve secure 6-digit collection OTP codes.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap shrink-0">
              <Link
                href="/lost-found/report-lost"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <FileQuestion className="w-4 h-4" />
                <span>+ Lost Report</span>
              </Link>
              <Link
                href="/lost-found/report-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Found Item</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            My Claims ({myClaims.length})
          </button>

          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'lost'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            My Lost Reports ({myLost.length})
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'found'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            My Found Items ({myFound.length})
          </button>
        </div>

        {/* TAB 1: MY CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Submitted Ownership Verification Claims</h3>

            {myClaims.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-sm text-slate-700">No ownership claims submitted yet</p>
                <p className="text-xs text-slate-500">Browse the found items catalog and click "This Is Mine" to file a claim.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myClaims.map(claim => {
                  const isApproved = claim.status === 'Approved';
                  const isCollected = claim.status === 'Collected';

                  return (
                    <div key={claim.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-400">Claim ID: #{claim.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            claim.status === 'Under Review' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            claim.status === 'Disputed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            claim.status === 'Collected' ? 'bg-slate-100 text-slate-600' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {claim.status}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Target Item ID:</p>
                          <p className="text-base font-black text-slate-900">{claim.foundItemId}</p>
                        </div>

                        <div className="space-y-1 bg-slate-50 rounded-2xl p-3 text-xs font-medium border border-slate-100">
                          <p className="text-slate-400 font-bold text-[10px] uppercase">Your Verification Answers:</p>
                          {claim.answers.map((a, i) => (
                            <div key={i} className="text-slate-700">
                              <span className="font-bold text-slate-900">{a.question}:</span> {a.answer}
                            </div>
                          ))}
                        </div>

                        {/* Handover OTP Badge */}
                        {isApproved && claim.handoverOTP && (
                          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                              🔑 One-Time Handover OTP &amp; QR Code
                            </span>
                            <div className="text-3xl font-black text-emerald-900 tracking-widest font-mono">
                              {claim.handoverOTP}
                            </div>
                            <p className="text-[11px] text-emerald-700 font-medium">
                              Show this 6-digit OTP or code at Main Gate Security Desk along with your College ID to collect your item.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span>Submitted on {claim.submittedAt}</span>
                        {claim.reviewedBy && <span>Reviewed by: {claim.reviewedBy}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY LOST REPORTS */}
        {activeTab === 'lost' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Active Lost Belonging Reports</h3>

            {myLost.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-sm text-slate-700">No lost item reports filed</p>
                <Link href="/lost-found/report-lost" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold mt-2">
                  + Report Lost Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myLost.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full font-bold text-[10px]">
                          {item.category} (Level {item.securityLevel})
                        </span>
                        <span className="text-xs font-bold text-slate-400">#{item.id}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{item.itemName}</h4>
                      <p className="text-xs text-slate-500">{item.description}</p>
                      <p className="text-xs font-medium text-slate-600">Last Seen: {item.lastSeenLocation} on {item.dateLost}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Status: {item.status}</span>
                      <button
                        onClick={() => closeLostReport(item.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        Close Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY FOUND REPORTS */}
        {activeTab === 'found' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Registered Found Items</h3>

            {myFound.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                <Plus className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-sm text-slate-700">No found items registered by you</p>
                <Link href="/lost-found/report-found" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold mt-2">
                  + Report Found Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myFound.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-[10px]">
                          {item.category} (Level {item.securityLevel})
                        </span>
                        <span className="text-xs font-bold text-slate-400">#{item.id}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{item.itemName}</h4>
                      <p className="text-xs text-slate-500">{item.description}</p>
                      <p className="text-xs font-medium text-slate-600">Found At: {item.foundLocation} • Custody: {item.custodyLocation}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Status: {item.status}</span>
                      <button
                        onClick={() => closeFoundReport(item.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        Close Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
