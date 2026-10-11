"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type ComplaintStatus = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";

interface ComplaintUpdate {
  id: string;
  status: ComplaintStatus;
  comment: string;
  timestamp: string;
}

interface TrackedComplaint {
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
  "Submitted":    "bg-slate-100 text-slate-700 border-slate-200",
  "Under Review": "bg-blue-100 text-blue-700 border-blue-200",
  "Assigned":     "bg-violet-100 text-violet-700 border-violet-200",
  "In Progress":  "bg-amber-100 text-amber-700 border-amber-200",
  "Resolved":     "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Closed":       "bg-slate-200 text-slate-600 border-slate-300",
};

const STATUS_FLOW: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

export default function TrackComplaintPage() {
  const [ticketId, setTicketId] = useState("");
  const [trackingSecret, setTrackingSecret] = useState("");
  const [loadState, setLoadState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [complaint, setComplaint] = useState<TrackedComplaint | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Feedback
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim() || !trackingSecret.trim()) {
      setErrorMsg("Both Ticket ID and Tracking Secret are required.");
      return;
    }
    setLoadState("loading");
    setErrorMsg("");
    setComplaint(null);

    try {
      const params = new URLSearchParams({ ticketId: ticketId.trim(), secret: trackingSecret.trim() });
      const res = await fetch(`/api/complaints/track?${params}`);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Not found"); }
      const data = await res.json();
      setComplaint(data);
      setFeedbackRating(data.rating || 0);
      setFeedbackComment(data.feedbackComment || "");
      setFeedbackState(data.rating ? "success" : "idle");
      setLoadState("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ticket not found. Check your Ticket ID and Tracking Secret.");
      setLoadState("error");
    }
  };

  const handleFeedback = async () => {
    if (!feedbackRating || !complaint) return;
    setFeedbackState("loading");
    try {
      const res = await fetch("/api/complaints/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticketId.trim(), trackingSecret: trackingSecret.trim(), rating: feedbackRating, feedbackComment }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      setFeedbackState("success");
    } catch { setFeedbackState("error"); }
  };

  const currentStep = complaint ? STATUS_FLOW.indexOf(complaint.status) : -1;
  const canLeaveReview = complaint && (complaint.status === "Resolved" || complaint.status === "Closed") && feedbackState !== "success";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Lookup Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 sm:p-8">
        <h1 className="text-2xl font-black text-slate-900 mb-1">Track Your Ticket</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your Ticket ID and the Tracking Secret you saved at submission.</p>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ticket ID *</label>
            <input type="text" value={ticketId} onChange={e => setTicketId(e.target.value)} placeholder="e.g. TKT-3421-AB2C"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tracking Secret *</label>
            <input type="password" value={trackingSecret} onChange={e => setTrackingSecret(e.target.value)} placeholder="Your one-time tracking secret"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>

          {loadState === "error" && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
              <p className="text-sm text-rose-700 font-semibold">{errorMsg}</p>
            </div>
          )}

          <button type="submit" disabled={loadState === "loading"}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition">
            {loadState === "loading" ? "Looking up..." : "Find My Ticket"}
          </button>
        </form>
      </div>

      {/* Ticket Detail */}
      {loadState === "success" && complaint && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{complaint.type}</p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{complaint.subject}</h2>
              <p className="text-xs text-slate-500 mt-1">
                {complaint.category} · Submitted {new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold shrink-0 ml-4 ${STATUS_COLORS[complaint.status]}`}>
              {complaint.status}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              {STATUS_FLOW.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`h-2.5 w-2.5 rounded-full border-2 transition-colors ${i <= currentStep ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300"}`} />
                  <p className={`text-[10px] text-center leading-tight ${i <= currentStep ? "text-amber-700 font-bold" : "text-slate-400"}`}>{s}</p>
                </div>
              ))}
            </div>
            <div className="relative h-1.5 bg-slate-200 rounded-full mt-1">
              <div className="absolute left-0 top-0 h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(currentStep / (STATUS_FLOW.length - 1)) * 100}%` }} />
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{complaint.description}</p>
            {complaint.evidenceFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Evidence</p>
                {complaint.evidenceFiles.map(f => <span key={f} className="inline-block bg-slate-100 rounded-lg px-2 py-1 text-xs text-slate-700 mr-2">📎 {f}</span>)}
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Status History</p>
            <ol className="space-y-3">
              {[...complaint.updates].reverse().map(u => (
                <li key={u.id} className="flex gap-3 items-start text-sm">
                  <span className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                  <div>
                    <p className="text-slate-700">{u.comment}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(u.timestamp).toLocaleString("en-IN")}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Feedback (only for Resolved/Closed) */}
          {(complaint.status === "Resolved" || complaint.status === "Closed") && (
            <div className="px-6 py-5">
              {feedbackState === "success" || complaint.rating ? (
                <div className="text-center py-4">
                  <p className="text-2xl mb-2">{"⭐".repeat(complaint.rating || feedbackRating)}</p>
                  <p className="text-sm font-bold text-emerald-700">Thank you for your feedback!</p>
                  {complaint.feedbackComment && <p className="text-xs text-slate-500 mt-1">{complaint.feedbackComment}</p>}
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Rate Your Resolution</p>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setFeedbackRating(n)}
                        className={`text-2xl transition-transform hover:scale-110 ${n <= feedbackRating ? "opacity-100" : "opacity-30"}`}>
                        ⭐
                      </button>
                    ))}
                  </div>
                  <textarea rows={2} value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Optional feedback comment..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3" />
                  <button onClick={handleFeedback} disabled={!feedbackRating || feedbackState === "loading"}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold text-sm transition">
                    {feedbackState === "loading" ? "Submitting..." : "Submit Feedback"}
                  </button>
                  {feedbackState === "error" && <p className="text-xs text-rose-600 mt-2 text-center">Could not submit feedback. Please try again.</p>}
                  {!canLeaveReview && <p className="text-xs text-slate-400 mt-2 text-center">Feedback is only available once the ticket is Resolved or Closed.</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
        <p className="text-xs text-amber-800"><strong>🔒 Security:</strong> Your Tracking Secret is transmitted securely and never logged. This page does not remember your credentials between sessions.</p>
      </div>

      <Link href="/complaints/new" className="block text-center text-sm text-amber-700 hover:underline">Submit a new ticket →</Link>
    </div>
  );
}
