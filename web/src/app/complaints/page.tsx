"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search, ShieldCheck, ArrowRight, Lock, CheckCircle2, Clock } from "lucide-react";

export default function ComplaintsHome() {
  return (
    <div className="space-y-6">
      {/* Top Hero Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              100% Anonymous Redressal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📝</span> Complaints &amp; Improvements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Submit anonymous student feedback, report infrastructure defects, or propose campus enhancements without exposing your identity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/complaints/new"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Submit Ticket
            </Link>
            <Link
              href="/complaints/track"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Track Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics / Guarantees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Identity Privacy</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">Zero Identity Logs</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            No roll numbers, student IDs, or IP addresses are ever captured or attached to submissions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Tracking Protection</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">SHA-256 Secret</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            A single-use tracking secret is shown once upon ticket creation, verified with constant-time cryptographic checks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">SLA Target</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">24 - 48 Hours</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Administrative departments review incoming tickets and dispatch campus maintenance or facility operations.
          </p>
        </div>
      </div>

      {/* Core Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/complaints/new"
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
              Submit a Ticket
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
              File a grievance or suggest campus improvements across Hostels, Mess Dining, Wi-Fi, Academics, or Transport.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Hostel", "Mess & Food", "Wi-Fi & Tech", "Infrastructure"].map((tag) => (
                <span key={tag} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Begin anonymous submission</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/complaints/track"
          className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">
              Track Ticket Status
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
              Inspect current stage updates, departmental review comments, and submit resolution feedback with your Ticket ID and Secret.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Submitted", "Under Review", "In Progress", "Resolved"].map((status) => (
                <span key={status} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                  {status}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span>Lookup existing ticket</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Security & Privacy Notice Card */}
      <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
            🔒
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Anonymity &amp; Whistleblower Safety Guidelines
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed mt-1.5 font-medium">
              We guarantee end-to-end anonymity by separating submission content from personal profiles. To maintain absolute confidentiality, please avoid mentioning personal names, mobile numbers, or student register numbers in your description and uploaded evidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
