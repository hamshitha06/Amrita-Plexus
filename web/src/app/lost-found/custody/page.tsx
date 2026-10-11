'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, FoundItemReport, LostFoundClaim, SecurityCustodyRecord } from '@/contexts/PlexusContext';
import { 
  Shield, CheckCircle2, AlertTriangle, ArrowLeft, Search, UserCheck, 
  Key, MapPin, Calendar, Clock, Eye, X, Filter, Building2, User, FileText, ChevronRight
} from 'lucide-react';

const CAMPUS_SECURITY_DESKS = [
  'Main Gate Security Desk',
  'Central Library Security Counter',
  'Academic Block 1 Security Post',
  'Academic Block 2 Security Desk',
  'Academic Block 3 Security Post',
  'Hostel Gate Security Desk',
];

export default function SecurityCustodyDeskPage() {
  const { 
    foundReports, 
    claims, 
    custodyRecords, 
    reviewClaim, 
    confirmSecurityIntake, 
    verifyAndCollectHandover,
    reportHandoverToSecurity
  } = usePlexus();

  // Active filter tab
  const [activeTab, setActiveTab] = useState<'all' | 'handover-reported' | 'custody-confirmed' | 'claims-review' | 'ready-return' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Physical Intake Confirmation Form State
  const [selectedFoundId, setSelectedFoundId] = useState('');
  const [custodyDeskLocation, setCustodyDeskLocation] = useState(CAMPUS_SECURITY_DESKS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [staffName, setStaffName] = useState('Officer R. Pillai (SEC-88)');
  const [secondaryStaffName, setSecondaryStaffName] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  // Handover Verification State (OTP & Physical Return)
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Student Handover Report Modal State
  const [reportingHandoverItem, setReportingHandoverItem] = useState<FoundItemReport | null>(null);
  const [reportHandoverDesk, setReportHandoverDesk] = useState(CAMPUS_SECURITY_DESKS[0]);

  // Item Detail Modal State
  const [viewingItem, setViewingItem] = useState<FoundItemReport | null>(null);

  // Filter queues
  const handoverReportedItems = foundReports.filter(f => 
    f.custodyLocation?.includes('Handover Reported') || 
    f.status === 'Awaiting Secure Deposit' ||
    custodyRecords.some(c => c.foundItemId === f.id && c.handoverStatus === 'Handover Reported')
  );

  const custodyConfirmedItems = foundReports.filter(f => 
    f.status === 'In Custody' || 
    f.status === 'Verification In Progress' || 
    f.status === 'Approved for Handover' ||
    custodyRecords.some(c => c.foundItemId === f.id && c.handoverStatus === 'Custody Confirmed')
  );

  const pendingClaims = claims.filter(c => c.status === 'Under Review' || c.status === 'Disputed');
  const approvedClaims = claims.filter(c => c.status === 'Approved');
  const returnedItems = foundReports.filter(f => f.status === 'Collected' || f.status === 'Closed');

  const filteredFoundItems = foundReports.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.foundLocation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'handover-reported') {
      return handoverReportedItems.some(h => h.id === item.id);
    }
    if (activeTab === 'custody-confirmed') {
      return custodyConfirmedItems.some(c => c.id === item.id);
    }
    if (activeTab === 'ready-return') {
      return item.status === 'Approved for Handover';
    }
    if (activeTab === 'returned') {
      return item.status === 'Collected' || item.status === 'Closed';
    }
    return true;
  });

  const effectiveCustodyLocation = customLocation.trim() ? customLocation.trim() : custodyDeskLocation;

  // Handle physical intake receipt by authorized officer
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoundId || !effectiveCustodyLocation || !conditionNotes || !staffName) {
      alert('Please fill in all physical intake confirmation fields.');
      return;
    }

    const item = foundReports.find(f => f.id === selectedFoundId);
    if (item && item.securityLevel === 5 && !secondaryStaffName) {
      alert('⚠️ Level 5 High-Value items require Dual-Staff Authorization. Please provide Secondary Staff Officer Name.');
      return;
    }

    confirmSecurityIntake(
      selectedFoundId, 
      effectiveCustodyLocation, 
      conditionNotes, 
      staffName, 
      secondaryStaffName || undefined
    );

    setSelectedFoundId('');
    setConditionNotes('');
    setSecondaryStaffName('');
  };

  // Student reports handing over physical item to security
  const handleStudentReportHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingHandoverItem) return;
    reportHandoverToSecurity(reportingHandoverItem.id, reportHandoverDesk);
    setReportingHandoverItem(null);
  };

  // Officer confirms physical OTP & College ID match, returning item to owner
  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaimId || !otpInput) {
      alert('Please select an approved claim and enter the 6-digit OTP code.');
      return;
    }

    const targetClaim = claims.find(c => c.id === selectedClaimId);
    if (!targetClaim) return;

    const ok = verifyAndCollectHandover(targetClaim.foundItemId, targetClaim.id, otpInput, staffName);
    if (ok) {
      setSelectedClaimId('');
      setOtpInput('');
    }
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Lost & Found / Security Custody Desk"
      title="Security & Custody Desk Management"
    >
      <div className="space-y-6">

        {/* Header Hero Banner Card */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                🛡️ Campus Security Physical Custody Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>🛡️</span> Security Custody Desk Console
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Campus security records physical receipt of lost items, confirms physical custody at authorized security desks (no automated lockers), verifies ownership claims, and executes authenticated handovers.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/lost-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Lost &amp; Found Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Items</p>
            <p className="text-xl font-black text-slate-900 mt-1">{foundReports.length}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-amber-600 uppercase">Handover Reported</p>
            <p className="text-xl font-black text-amber-600 mt-1">{handoverReportedItems.length}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-indigo-600 uppercase">Custody Confirmed</p>
            <p className="text-xl font-black text-indigo-600 mt-1">{custodyConfirmedItems.length}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-purple-600 uppercase">Claims Review</p>
            <p className="text-xl font-black text-purple-600 mt-1">{pendingClaims.length}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Ready for Return</p>
            <p className="text-xl font-black text-emerald-600 mt-1">{approvedClaims.length}</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Returned</p>
            <p className="text-xl font-black text-slate-700 mt-1">{returnedItems.length}</p>
          </div>
        </div>

        {/* 2-Column Action Panels: Physical Intake & Return OTP Scanner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Confirm Physical Custody Receipt */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Action 1 • Physical Desk Intake
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Confirm Physical Custody Receipt</h3>
              <p className="text-xs text-slate-500 font-medium">
                Authorized security staff confirms physical receipt of item at the campus security desk.
              </p>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Item Received Physically <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedFoundId}
                  onChange={e => setSelectedFoundId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                >
                  <option value="">-- Select Found Item --</option>
                  {foundReports.filter(f => f.status !== 'Collected').map(f => (
                    <option key={f.id} value={f.id}>
                      #{f.id} — {f.itemName} ({f.category} • Status: {f.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Security Desk / Custody Location <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={custodyDeskLocation}
                    onChange={e => {
                      setCustodyDeskLocation(e.target.value);
                      if (e.target.value !== 'Other') setCustomLocation('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  >
                    {CAMPUS_SECURITY_DESKS.map(desk => (
                      <option key={desk} value={desk}>{desk}</option>
                    ))}
                    <option value="Other">Other Campus Post...</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Receiving Officer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {custodyDeskLocation === 'Other' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Specify Custody Post Location</label>
                  <input
                    type="text"
                    required
                    value={customLocation}
                    onChange={e => setCustomLocation(e.target.value)}
                    placeholder="e.g. Mechanical Workshop Security Post"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              )}

              {/* Dual Staff for Level 5 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Secondary Staff Officer <span className="text-rose-500 font-normal">(Required for Level 5 Jewellery/High-Value)</span>
                </label>
                <input
                  type="text"
                  value={secondaryStaffName}
                  onChange={e => setSecondaryStaffName(e.target.value)}
                  placeholder="e.g. Chief Officer M. Sundaram (SEC-12)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Physical Condition Inspection &amp; Intake Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={conditionNotes}
                  onChange={e => setConditionNotes(e.target.value)}
                  placeholder="Describe physical condition, cosmetic marks, battery status, seals, or packaging..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Physical Custody Receipt
              </button>
            </form>
          </div>

          {/* RIGHT: OTP Verification & Handover Return */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Action 2 • Return to Verified Owner
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Physical Return Verification</h3>
              <p className="text-xs text-slate-500 font-medium">
                Verify student 6-digit OTP code along with physical Amrita College ID card before releasing item.
              </p>
            </div>

            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Approved Claim <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedClaimId}
                  onChange={e => setSelectedClaimId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                >
                  <option value="">-- Select Approved Claim --</option>
                  {approvedClaims.map(c => (
                    <option key={c.id} value={c.id}>
                      Claim #{c.id} — {c.claimantName} (Item #{c.foundItemId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter 6-Digit Handover OTP <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="e.g. 849201"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-black tracking-widest text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1 text-slate-600">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Mandatory Physical Protocol:
                </p>
                <p className="text-[11px] leading-relaxed">
                  The security officer must verify that the student presenting the OTP holds a valid physical College ID matching the approved claimant name before handing over the item.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Physical Return to Owner
              </button>
            </form>
          </div>

        </div>

        {/* Claim Review Queue Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Ownership Claim Review Queue</h3>
              <p className="text-xs text-slate-500 font-medium">Review confidential claimant answers against private characteristics before authorizing return.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{pendingClaims.length} pending reviews</span>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
              <p className="font-bold text-xs text-slate-700">All submitted claims have been reviewed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingClaims.map(claim => {
                const targetFound = foundReports.find(f => f.id === claim.foundItemId);
                return (
                  <div key={claim.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">Claim #{claim.id}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                        {claim.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p><span className="font-bold text-slate-700">Claimant:</span> {claim.claimantName} ({claim.claimantEmail})</p>
                      <p><span className="font-bold text-slate-700">Target Item:</span> #{claim.foundItemId} {targetFound ? `(${targetFound.itemName})` : ''}</p>
                      <p><span className="font-bold text-slate-700">Advisory Match:</span> {claim.advisoryMatchScore}%</p>
                      {claim.answers && claim.answers.length > 0 && (
                        <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1">
                          <p className="font-bold text-slate-800">Claimant Verification Answers:</p>
                          {claim.answers.map((a, i) => (
                            <p key={i} className="text-slate-600"><span className="text-slate-400">Q:</span> {a.question} → <span className="font-medium text-slate-800">{a.answer}</span></p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => reviewClaim(claim.id, 'Approved', staffName)}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-2xs"
                      >
                        Approve Claim
                      </button>
                      <button
                        onClick={() => reviewClaim(claim.id, 'Rejected', staffName)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custody Inventory & Item Cards */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Custody Item Inventory &amp; Status Tracking</h3>
              <p className="text-xs text-slate-500 font-medium">Browse found items across their physical custody and return lifecycle.</p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search item, category, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'handover-reported', label: `Handover Reported (${handoverReportedItems.length})` },
              { id: 'custody-confirmed', label: `Custody Confirmed (${custodyConfirmedItems.length})` },
              { id: 'ready-return', label: `Ready for Return (${approvedClaims.length})` },
              { id: 'returned', label: `Returned (${returnedItems.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Item Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoundItems.map(item => {
              const custodyRec = custodyRecords.find(c => c.foundItemId === item.id);
              const isHandoverReported = item.custodyLocation?.includes('Handover Reported') || custodyRec?.handoverStatus === 'Handover Reported';
              const isCustodyConfirmed = custodyRec?.handoverStatus === 'Custody Confirmed' || item.status === 'In Custody';

              return (
                <div key={item.id} className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold text-slate-400">#{item.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'Collected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        isCustodyConfirmed ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        isHandoverReported ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.status === 'Collected' ? 'Returned to Owner' :
                         isCustodyConfirmed ? 'Custody Confirmed' :
                         isHandoverReported ? 'Handover Reported' : item.status}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 leading-tight">{item.itemName}</h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{item.description}</p>

                    <div className="pt-2 text-[11px] space-y-1 text-slate-600 border-t border-slate-100">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>Found at: <strong>{item.foundLocation}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>Custody: <strong>{custodyRec?.custodyLocation || item.custodyLocation || 'With Finder'}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Date: {item.dateFound}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingItem(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>

                    {item.status !== 'Collected' && !isCustodyConfirmed && (
                      <button
                        onClick={() => {
                          setReportingHandoverItem(item);
                          setReportHandoverDesk(CAMPUS_SECURITY_DESKS[0]);
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-all"
                      >
                        Handover to Security
                      </button>
                    )}

                    {isHandoverReported && !isCustodyConfirmed && (
                      <button
                        onClick={() => {
                          setSelectedFoundId(item.id);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFoundItems.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p className="text-xs font-bold">No items found for this filter.</p>
            </div>
          )}
        </div>

        {/* Custody Audit & Activity History Table */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">Physical Custody Audit &amp; Handover History</h3>
            <p className="text-xs text-slate-500 font-medium">
              Digital log of physical security desk intake and verified student handovers (no lockers).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Custody ID</th>
                  <th className="p-4">Item ID</th>
                  <th className="p-4">Physical Security Desk</th>
                  <th className="p-4">Receiving Staff</th>
                  <th className="p-4">Intake Timestamp</th>
                  <th className="p-4 pr-6 text-right">Handover Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {custodyRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="p-4 pl-6 font-bold text-slate-900">{rec.id}</td>
                    <td className="p-4 font-bold text-indigo-700">#{rec.foundItemId}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      <span className="px-2.5 py-1 bg-slate-100 font-bold text-[11px] rounded-lg border border-slate-200/60">
                        {rec.custodyLocation}
                      </span>
                    </td>
                    <td className="p-4">
                      {rec.receivingStaffName} {rec.secondaryStaffName && <span className="text-slate-400 text-[10px]">(2nd: {rec.secondaryStaffName})</span>}
                    </td>
                    <td className="p-4 text-slate-500">{rec.intakeTimestamp}</td>
                    <td className="p-4 pr-6 text-right font-bold">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] border ${
                        rec.handoverStatus === 'Returned' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        rec.handoverStatus === 'Custody Confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {rec.handoverCompletedAt ? `Returned: ${rec.handoverCompletedAt}` : rec.handoverStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Student Report Handover Modal */}
      {reportingHandoverItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase">Physical Handover</span>
                <h3 className="font-black text-slate-900 text-base">Report Handover to Security</h3>
              </div>
              <button 
                onClick={() => setReportingHandoverItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStudentReportHandover} className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                Reporting physical handover of <strong className="text-slate-900">{reportingHandoverItem.itemName}</strong> (#{reportingHandoverItem.id}).
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Which Security Desk Did You Hand It Over To? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={reportHandoverDesk}
                  onChange={e => setReportHandoverDesk(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-amber-600 focus:bg-white"
                >
                  {CAMPUS_SECURITY_DESKS.map(desk => (
                    <option key={desk} value={desk}>{desk}</option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Verification Requirement:
                </p>
                <p className="text-[11px] leading-relaxed">
                  This sets status to <strong>Handover Reported</strong>. Authorized security personnel must physically inspect the item and confirm receipt before it is marked as confirmed in custody.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReportingHandoverItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Submit Handover Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Found Item Record</span>
                <h3 className="font-black text-slate-900 text-lg leading-tight mt-0.5">{viewingItem.itemName}</h3>
              </div>
              <button 
                onClick={() => setViewingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Item ID</span>
                  <span className="font-extrabold text-slate-900">#{viewingItem.id}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Category</span>
                  <span className="font-extrabold text-slate-900">{viewingItem.category}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Date Found</span>
                  <span className="font-extrabold text-slate-900">{viewingItem.dateFound}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Current Status</span>
                  <span className="font-extrabold text-indigo-700">{viewingItem.status}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Public Description</label>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  {viewingItem.description}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Found Location</label>
                <p className="text-xs text-slate-800 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {viewingItem.foundLocation}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current Custody Status</label>
                <p className="text-xs text-slate-800 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" /> {viewingItem.custodyLocation || 'With Finder'}
                </p>
              </div>

              {/* Custody Record Timeline */}
              {custodyRecords.filter(c => c.foundItemId === viewingItem.id).map(c => (
                <div key={c.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Custody Audit Log</span>
                  <div className="text-xs space-y-1">
                    <p><span className="font-bold text-slate-700">Security Desk:</span> {c.custodyLocation}</p>
                    <p><span className="font-bold text-slate-700">Receiving Staff:</span> {c.receivingStaffName}</p>
                    <p><span className="font-bold text-slate-700">Intake Timestamp:</span> {c.intakeTimestamp}</p>
                    <p><span className="font-bold text-slate-700">Condition Notes:</span> {c.conditionNotes}</p>
                    <p><span className="font-bold text-slate-700">Status:</span> {c.handoverStatus}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
