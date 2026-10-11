"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type ComplaintStatus = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";

interface AdminComplaint {
  ticketId: string;
  type: "Complaint" | "Improvement";
  category: string;
  status: ComplaintStatus;
  createdAt: string;
  updates: { status: ComplaintStatus; timestamp: string }[];
  rating?: number;
}

interface Analytics {
  total: number;
  totalComplaints: number;
  totalImprovements: number;
  open: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byStatus: Record<ComplaintStatus, number>;
  avgResolutionDays: number | null;
  avgRating: number | null;
  ratingCount: number;
}

function computeAnalytics(data: AdminComplaint[]): Analytics {
  const byCategory: Record<string, number> = {};
  const byStatus: Record<ComplaintStatus, number> = {
    "Submitted": 0, "Under Review": 0, "Assigned": 0, "In Progress": 0, "Resolved": 0, "Closed": 0,
  };
  let totalResolutionMs = 0;
  let resolvedCount = 0;
  let totalRating = 0;
  let ratingCount = 0;

  for (const c of data) {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;

    if (c.status === "Resolved" || c.status === "Closed") {
      const resolvedUpdate = c.updates.find(u => u.status === "Resolved");
      if (resolvedUpdate) {
        totalResolutionMs += new Date(resolvedUpdate.timestamp).getTime() - new Date(c.createdAt).getTime();
        resolvedCount++;
      }
    }
    if (c.rating) { totalRating += c.rating; ratingCount++; }
  }

  return {
    total: data.length,
    totalComplaints: data.filter(c => c.type === "Complaint").length,
    totalImprovements: data.filter(c => c.type === "Improvement").length,
    open: data.filter(c => !["Resolved", "Closed"].includes(c.status)).length,
    resolved: byStatus["Resolved"],
    closed: byStatus["Closed"],
    byCategory,
    byStatus,
    avgResolutionDays: resolvedCount > 0 ? Math.round((totalResolutionMs / resolvedCount) / (1000 * 3600 * 24) * 10) / 10 : null,
    avgRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : null,
    ratingCount,
  };
}

const STAT_CARD = "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center";
const STATUS_COLORS: Record<ComplaintStatus, string> = {
  "Submitted": "bg-slate-400",
  "Under Review": "bg-blue-500",
  "Assigned": "bg-violet-500",
  "In Progress": "bg-amber-500",
  "Resolved": "bg-emerald-500",
  "Closed": "bg-slate-600",
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/complaints");
      const data: AdminComplaint[] = await res.json();
      setAnalytics(computeAnalytics(data));
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/complaints")
      .then((res) => res.json())
      .then((data: AdminComplaint[]) => {
        if (active) {
          setAnalytics(computeAnalytics(data));
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

  if (loading) return <div className="text-center py-20 text-slate-400">Loading analytics…</div>;
  if (!analytics) return <div className="text-center py-20 text-rose-500">Failed to load analytics.</div>;

  const maxCategory = Math.max(...Object.values(analytics.byCategory), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Aggregate statistics — no individual identity data is shown.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/complaints" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
            ← Ticket List
          </Link>
          <button onClick={load} className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-slate-900">{analytics.total}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Total Tickets</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-rose-600">{analytics.totalComplaints}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Complaints</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-indigo-600">{analytics.totalImprovements}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Improvements</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-amber-600">{analytics.open}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Open</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-emerald-600">{analytics.resolved}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Resolved</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-slate-600">{analytics.closed}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Closed</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-violet-600">
            {analytics.avgResolutionDays !== null ? `${analytics.avgResolutionDays}d` : "–"}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">Avg Resolution</p>
        </div>
        <div className={STAT_CARD}>
          <p className="text-3xl font-extrabold text-amber-500">
            {analytics.avgRating !== null ? `${analytics.avgRating} ⭐` : "–"}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
            Avg Rating <span className="font-normal text-slate-400">({analytics.ratingCount})</span>
          </p>
        </div>
      </div>

      {/* By Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide mb-4">Tickets by Status</h2>
        <div className="space-y-3">
          {(Object.entries(analytics.byStatus) as [ComplaintStatus, number][]).map(([s, count]) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-28 text-xs font-semibold text-slate-600 shrink-0">{s}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${STATUS_COLORS[s]}`}
                  style={{ width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By Category */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide mb-4">Tickets by Category</h2>
        {Object.keys(analytics.byCategory).length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(analytics.byCategory).sort(([,a],[,b]) => b - a).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-40 text-xs font-semibold text-slate-600 shrink-0 truncate">{cat}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${(count / maxCategory) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500">
        <strong>Privacy:</strong> All analytics are aggregated. No individual ticket details, student names, IDs, or tracking secrets appear on this page.
      </div>
    </div>
  );
}
