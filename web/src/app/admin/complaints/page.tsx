"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type ComplaintStatus = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";

interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  comment: string;
  timestamp: string;
}

interface AdminComplaint {
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
}

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  "Submitted":    "bg-slate-100 text-slate-700 border-slate-300",
  "Under Review": "bg-blue-100 text-blue-700 border-blue-300",
  "Assigned":     "bg-violet-100 text-violet-700 border-violet-300",
  "In Progress":  "bg-amber-100 text-amber-700 border-amber-300",
  "Resolved":     "bg-emerald-100 text-emerald-700 border-emerald-300",
  "Closed":       "bg-slate-200 text-slate-600 border-slate-400",
};

const NEXT_STATUSES: Record<ComplaintStatus, ComplaintStatus[]> = {
  "Submitted":    ["Under Review"],
  "Under Review": ["Assigned", "Closed"],
  "Assigned":     ["In Progress", "Closed"],
  "In Progress":  ["Resolved", "Closed"],
  "Resolved":     ["Closed"],
  "Closed":       [],
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus | "">("");
  const [updateComment, setUpdateComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | ComplaintStatus>("All");
  const [filterType, setFilterType] = useState<"All" | "Complaint" | "Improvement">("All");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/complaints")
      .then((res) => res.json())
      .then((data: AdminComplaint[]) => {
        if (active) {
          setComplaints(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selected = complaints.find(c => c.ticketId === selectedId) || null;

  const handleUpdate = async () => {
    if (!selectedId || !updateStatus || !updateComment.trim()) return;
    setUpdating(true);
    setUpdateMsg("");
    try {
      const res = await fetch("/api/admin/complaints/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedId, newStatus: updateStatus, comment: updateComment.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setUpdateMsg("✅ Status updated successfully.");
      setUpdateComment("");
      setUpdateStatus("");
      await fetchComplaints();
    } catch (e: unknown) {
      setUpdateMsg(`❌ ${e instanceof Error ? e.message : "Failed"}`);
    }
    setUpdating(false);
  };

  const filtered = complaints.filter(c => {
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (filterType !== "All" && c.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Complaint Management</h1>
          <p className="text-slate-500 text-sm mt-1">Anonymous complaints are managed here. No student identities are visible.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/complaints/analytics" className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition">
            📊 View Analytics
          </Link>
          <button onClick={fetchComplaints} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as "All" | ComplaintStatus)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400">
            {["All", "Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"].map(s => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>
        <div>
          <select value={filterType} onChange={e => setFilterType(e.target.value as "All" | "Complaint" | "Improvement")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400">
            <option value="All">All Types</option>
            <option value="Complaint">Complaints</option>
            <option value="Improvement">Improvements</option>
          </select>
        </div>
        <p className="text-xs text-slate-500 self-center">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ticket List */}
        <div className="flex-1 min-w-0 space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-slate-500 text-sm">No tickets match the current filter.</p>
            </div>
          ) : (
            filtered.map(c => (
              <button key={c.ticketId} onClick={() => { setSelectedId(c.ticketId); setUpdateMsg(""); setUpdateStatus(""); setUpdateComment(""); }}
                className={`w-full text-left rounded-2xl border p-4 shadow-sm transition ${selectedId === c.ticketId ? "border-amber-400 bg-amber-50 ring-1 ring-amber-300" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500">{c.ticketId}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm truncate">{c.subject}</p>
                <p className="text-xs text-slate-500 mt-1">{c.type} · {c.category} · {new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                {c.rating && <p className="text-xs text-amber-600 mt-1">{"⭐".repeat(c.rating)} Rated by user</p>}
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selected ? (
          <div className="w-full lg:w-96 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-mono text-slate-400">{selected.ticketId}</p>
                <h2 className="text-base font-extrabold text-slate-900 mt-0.5">{selected.subject}</h2>
                <p className="text-xs text-slate-500 mt-1">{selected.type} · {selected.category}</p>
              </div>
              
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">{selected.description}</p>
                {selected.evidenceFiles.length > 0 && (
                  <div className="mt-2">
                    {selected.evidenceFiles.map(f => <span key={f} className="inline-block bg-slate-100 rounded-lg px-2 py-1 text-xs text-slate-700 mr-2">📎 {f}</span>)}
                  </div>
                )}
              </div>

              {/* History */}
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">History</p>
                <ol className="space-y-2 max-h-48 overflow-y-auto">
                  {[...selected.updates].reverse().map(u => (
                    <li key={u.id} className="text-xs border-l-2 border-amber-400 pl-3">
                      <p className="font-bold text-slate-700">{u.status}</p>
                      <p className="text-slate-600">{u.comment}</p>
                      <p className="text-slate-400">{new Date(u.timestamp).toLocaleString("en-IN")}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Status Update */}
              {NEXT_STATUSES[selected.status].length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Update Status</p>
                  <select value={updateStatus} onChange={e => setUpdateStatus(e.target.value as ComplaintStatus)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option value="">Select next status…</option>
                    {NEXT_STATUSES[selected.status].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <textarea rows={2} value={updateComment} onChange={e => setUpdateComment(e.target.value)}
                    placeholder="Add an update comment (do not include student-identifying info)…"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  <button onClick={handleUpdate} disabled={!updateStatus || !updateComment.trim() || updating}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold text-sm transition">
                    {updating ? "Updating…" : "Update Status"}
                  </button>
                  {updateMsg && <p className="text-xs mt-2 text-center text-slate-600">{updateMsg}</p>}
                </div>
              )}
              {selected.status === "Closed" && (
                <div className="px-5 py-4 text-center text-sm text-slate-500">This ticket is closed.</div>
              )}
            </div>

            {/* Privacy reminder */}
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
              <p className="text-xs text-rose-700">
                <strong>Privacy:</strong> No student identity information should appear above. If you see personal details in the description or evidence, redact them before further action and flag for a privacy review.
              </p>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex w-96 shrink-0 bg-white rounded-2xl border border-slate-200 items-center justify-center text-slate-400 text-sm min-h-64">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  );
}
