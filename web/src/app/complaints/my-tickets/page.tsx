"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  X, 
  Star, 
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ComplaintStatus = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";

interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  comment: string;
  timestamp: string;
}

interface Ticket {
  ticketId: string;
  type: "Complaint" | "Improvement";
  category: string;
  subject: string;
  description: string;
  evidenceFiles: string[];
  status: ComplaintStatus;
  createdAt: string;
  updates: ComplaintUpdate[];
  rating?: number;
  feedbackComment?: string;
  assignedTo?: string;
}

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  "Submitted": "bg-slate-100 text-slate-700 border-slate-200",
  "Under Review": "bg-blue-100 text-blue-700 border-blue-200",
  "Assigned": "bg-violet-100 text-violet-700 border-violet-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  "Resolved": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Closed": "bg-slate-200 text-slate-600 border-slate-300",
};

const STATUS_FLOW: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Complaint" | "Improvement">("All");

  // Selected Ticket Modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Fetch student tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requesterId = user?.id || "demo-user";
      const res = await fetch(`/api/complaints/mine?requesterId=${encodeURIComponent(requesterId)}`);
      if (!res.ok) throw new Error("Failed to load your tickets.");
      const json = await res.json();
      setTickets(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading ticket history.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesType = typeFilter === "All" || t.type === typeFilter;
    const matchesSearch = !search.trim() ||
      t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStepIndex = (status: ComplaintStatus) => STATUS_FLOW.indexOf(status);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Student Feedback Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📋</span> My Submitted Tickets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Track real-time status timelines, department reviews, and resolution notes for your submitted complaints and campus suggestions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/complaints/new"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Submit New Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Ticket ID (e.g. TKT-...) or Subject..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            {(["All", "Complaint", "Improvement"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  typeFilter === t
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {(["All", "Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                statusFilter === s
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-sm">
            <Clock className="w-8 h-8 mx-auto mb-2 text-amber-500 animate-spin" />
            <p className="font-bold text-slate-700">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center text-rose-700 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-bold">{error}</p>
            <button onClick={fetchTickets} className="mt-3 text-xs underline font-bold">Try again</button>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <h3 className="text-base font-extrabold text-slate-900">No Tickets Found</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm mx-auto">
              {tickets.length === 0 
                ? "You haven't submitted any complaints or suggestions yet." 
                : "No submitted tickets match your active filter."}
            </p>
            <Link
              href="/complaints/new"
              className="inline-flex items-center gap-1.5 mt-5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Submit a Ticket
            </Link>
          </div>
        ) : (
          filteredTickets.map(t => (
            <div
              key={t.ticketId}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-indigo-700">{t.ticketId}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {t.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">•</span>
                  <span className="text-[11px] font-semibold text-slate-500">{t.category}</span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {t.subject}
                </h3>

                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                  <span>Submitted on {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  {t.updates.length > 0 && (
                    <span>• Last updated: {new Date(t.updates[0].timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${STATUS_COLORS[t.status]}`}>
                  {t.status}
                </span>

                <button
                  onClick={() => setSelectedTicket(t)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Details & Timeline Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black text-indigo-700">{selectedTicket.ticketId}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${STATUS_COLORS[selectedTicket.status]}`}>
                    {selectedTicket.status}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {selectedTicket.type}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {selectedTicket.category} • Submitted on {new Date(selectedTicket.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Lifecycle Progress Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Ticket Lifecycle</p>
                <div className="flex items-center justify-between mb-2">
                  {STATUS_FLOW.map((s, idx) => {
                    const currentIdx = getStepIndex(selectedTicket.status);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div key={s} className="flex flex-col items-center gap-1 flex-1">
                        <div className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${
                          isPassed ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300"
                        }`} />
                        <span className={`text-[9px] text-center font-bold leading-tight ${
                          isPassed ? "text-amber-800" : "text-slate-400"
                        }`}>
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="relative h-1.5 bg-slate-200 rounded-full mt-1">
                  <div 
                    className="absolute left-0 top-0 h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(Math.max(0, getStepIndex(selectedTicket.status)) / (STATUS_FLOW.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Original Description</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                  {selectedTicket.description}
                </div>
                {selectedTicket.evidenceFiles && selectedTicket.evidenceFiles.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {selectedTicket.evidenceFiles.map(f => (
                      <span key={f} className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        📎 {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Real-time Status History Timeline */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Activity &amp; Status Timeline</p>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedTicket.updates.map((u, i) => (
                    <div key={u.id || i} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white" />
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${STATUS_COLORS[u.status]}`}>
                          {u.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(u.timestamp).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-medium bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                        {u.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback if resolved */}
              {selectedTicket.rating && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-xl mb-1">{"⭐".repeat(selectedTicket.rating)}</p>
                  <p className="text-xs font-bold text-emerald-800">Resolution Rated: {selectedTicket.rating} / 5 Stars</p>
                  {selectedTicket.feedbackComment && (
                    <p className="text-xs text-emerald-700 italic mt-1">"{selectedTicket.feedbackComment}"</p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
