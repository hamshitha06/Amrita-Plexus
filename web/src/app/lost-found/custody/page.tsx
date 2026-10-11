'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';
import { Shield, Lock, Key, CheckCircle2, AlertTriangle, ArrowLeft, Search, UserCheck, QrCode } from 'lucide-react';

export default function SecurityCustodyDeskPage() {
  const { foundReports, claims, custodyRecords, reviewClaim, confirmSecurityIntake, verifyAndCollectHandover } = usePlexus();

  // Intake Form State
  const [selectedFoundId, setSelectedFoundId] = useState('');
  const [storageLocker, setStorageLocker] = useState('');
  const [staffName, setStaffName] = useState('Officer R. Pillai (SEC-88)');
  const [secondaryStaffName, setSecondaryStaffName] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  // Handover Verification State
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const pendingDepositItems = foundReports.filter(f => f.status === 'Awaiting Secure Deposit' || (f.securityLevel >= 3 && f.status === 'Reported'));
  const inCustodyItems = foundReports.filter(f => f.status === 'In Custody' || f.status === 'Verification In Progress' || f.status === 'Approved for Handover');
  const pendingClaims = claims.filter(c => c.status === 'Under Review' || c.status === 'Disputed');
  const approvedClaims = claims.filter(c => c.status === 'Approved');

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFoundId || !storageLocker || !conditionNotes || !staffName) {
      alert('Please fill in all intake fields.');
      return;
    }

    const item = foundReports.find(f => f.id === selectedFoundId);
    if (item && item.securityLevel === 5 && !secondaryStaffName) {
      alert('⚠️ Level 5 High-Value items require Dual-Staff Authorization. Please provide Secondary Staff Officer Name.');
      return;
    }

    confirmSecurityIntake(selectedFoundId, storageLocker, conditionNotes, staffName, secondaryStaffName || undefined);
    setSelectedFoundId('');
    setStorageLocker('');
    setConditionNotes('');
    setSecondaryStaffName('');
  };

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
                🛡️ Campus Security &amp; Custody Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>🛡️</span> Security Desk &amp; Vault Custody
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Authorized staff interface for confirming high-value item deposits, managing safe vault locker tags, reviewing claims, and verifying 6-digit handover OTPs.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/lost-found"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Back to Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Custody Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Confirm Item Intake & Vault Tagging */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Step 1 • Intake &amp; Storage
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Confirm Security Intake &amp; Locker Tagging</h3>
              <p className="text-xs text-slate-500 font-medium">Log received belongings into secure campus vault storage.</p>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Pending Item for Deposit <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={selectedFoundId}
                  onChange={e => setSelectedFoundId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                >
                  <option value="">-- Select Item --</option>
                  {foundReports.filter(f => f.status !== 'Collected').map(f => (
                    <option key={f.id} value={f.id}>
                      #{f.id} — {f.itemName} (Level {f.securityLevel} • {f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vault Storage Locker Tag <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={storageLocker}
                    onChange={e => setStorageLocker(e.target.value)}
                    placeholder="e.g. Locker B-04, Admin Vault-1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Receiving Officer <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Dual Staff for Level 5 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Secondary Staff Officer <span className="text-rose-500">(Required for Level 5 Jewellery/High-Value)</span>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Condition Notes &amp; Intake Details <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={2}
                  value={conditionNotes}
                  onChange={e => setConditionNotes(e.target.value)}
                  placeholder="Describe item condition, battery status, scratches, or seals..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Security Intake &amp; Lock Tag
              </button>
            </form>
          </div>

          {/* RIGHT: OTP Verification & Handover Scanner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Step 2 • Handover Authorization
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">Handover OTP / QR Code Scanner</h3>
              <p className="text-xs text-slate-500 font-medium">Verify student 6-digit OTP code along with physical College ID check.</p>
            </div>

            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Approved Claim <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={selectedClaimId}
                  onChange={e => setSelectedClaimId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                >
                  <option value="">-- Select Approved Claim --</option>
                  {approvedClaims.map(c => (
                    <option key={c.id} value={c.id}>
                      Claim #{c.id} — {c.claimantName} ({c.foundItemId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit Handover OTP / QR Token <span className="text-rose-500">*</span></label>
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
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Physical Verification Check:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Officer must check the student's physical College ID card against the claimant name before executing token release.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-4 h-4" /> Verify OTP Token &amp; Release Item
              </button>
            </form>
          </div>

        </div>

        {/* Claim Review Queue Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Claim Verification Review Queue</h3>
              <p className="text-xs text-slate-500 font-medium">Review submitted ownership answers and evidence before authorizing release.</p>
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
              {pendingClaims.map(claim => (
                <div key={claim.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Claim #{claim.id}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                      {claim.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p><span className="font-bold text-slate-700">Claimant:</span> {claim.claimantName} ({claim.claimantEmail})</p>
                    <p><span className="font-bold text-slate-700">Target Found Item:</span> #{claim.foundItemId}</p>
                    <p><span className="font-bold text-slate-700">Advisory Similarity:</span> {claim.advisoryMatchScore}%</p>
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
              ))}
            </div>
          )}
        </div>

        {/* Custody Log Records */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900">Custody Audit &amp; Handover History</h3>
            <p className="text-xs text-slate-500 font-medium">Immutable audit logs of vault intake and completed student handovers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Custody ID</th>
                  <th className="p-4">Found Item</th>
                  <th className="p-4">Vault Locker Tag</th>
                  <th className="p-4">Receiving Officer</th>
                  <th className="p-4">Intake Timestamp</th>
                  <th className="p-4 pr-6 text-right">Handover Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {custodyRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="p-4 pl-6 font-bold text-slate-900">{rec.id}</td>
                    <td className="p-4 font-bold text-indigo-700">#{rec.foundItemId}</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 font-bold text-[10px] rounded-md">{rec.storageLocker}</span></td>
                    <td className="p-4">{rec.receivingStaffName} {rec.secondaryStaffName && `(2nd: ${rec.secondaryStaffName})`}</td>
                    <td className="p-4 text-slate-500">{rec.intakeTimestamp}</td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-700">
                      {rec.handoverCompletedAt ? `Collected on ${rec.handoverCompletedAt}` : 'In Storage Vault'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
