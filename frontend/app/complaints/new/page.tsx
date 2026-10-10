"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type ComplaintType = "Complaint" | "Improvement";
type Category = "Hostel" | "Mess and Food" | "Infrastructure" | "Academics" | "Transport" | "Campus Facilities" | "Internet and Technology" | "Other";

const CATEGORIES: Category[] = [
  "Hostel", "Mess and Food", "Infrastructure", "Academics",
  "Transport", "Campus Facilities", "Internet and Technology", "Other",
];

interface SubmitResult {
  ticketId: string;
  trackingSecret: string;
}

export default function NewComplaintPage() {
  const [type, setType] = useState<ComplaintType>("Complaint");
  const [category, setCategory] = useState<Category>("Hostel");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [secretCopied, setSecretCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Field-level errors
  const [subjectError, setSubjectError] = useState("");
  const [descError, setDescError] = useState("");

  const validate = () => {
    let valid = true;
    if (!subject.trim() || subject.trim().length < 5) {
      setSubjectError("Subject must be at least 5 characters.");
      valid = false;
    } else setSubjectError("");

    if (!description.trim() || description.trim().length < 20) {
      setDescError("Description must be at least 20 characters.");
      valid = false;
    } else setDescError("");

    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const body = { type, category, subject: subject.trim(), description: description.trim(), evidenceFiles: evidenceFileName ? [evidenceFileName] : [] };
      const res = await fetch("/api/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Submission failed"); }
      const data: SubmitResult = await res.json();
      setResult(data);
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleCopySecret = () => {
    if (result) { navigator.clipboard.writeText(result.trackingSecret); setSecretCopied(true); }
  };

  // ── Success Screen ──────────────────────────────────────────────────
  if (status === "success" && result) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-8 text-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Ticket Submitted!</h2>
          <p className="text-slate-500 text-sm mb-8">Your {type.toLowerCase()} has been submitted anonymously.</p>

          <div className="text-left space-y-4">
            {/* Ticket ID */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Public Ticket ID</p>
              <p className="text-2xl font-extrabold text-indigo-700 mt-1">{result.ticketId}</p>
              <p className="text-xs text-slate-500 mt-1">Share this with administrators to reference your ticket.</p>
            </div>

            {/* Tracking Secret — shown ONCE */}
            <div className="rounded-xl bg-amber-50 border-2 border-amber-400 p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">🔐 Tracking Secret — Save This Now!</p>
                <button onClick={handleCopySecret} className="text-xs font-bold text-amber-700 hover:text-amber-900 border border-amber-300 rounded-lg px-2 py-1 transition">
                  {secretCopied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-base font-mono break-all text-amber-900 bg-amber-100 rounded-lg p-2 mt-2">{result.trackingSecret}</p>
              <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 p-3">
                <p className="text-xs font-bold text-rose-700">⚠️ This is shown only ONCE and cannot be recovered.</p>
                <p className="text-xs text-rose-600 mt-1">You will need both the Ticket ID and this secret to track your complaint status. Store it in a safe place.</p>
              </div>
            </div>

            {/* Acknowledgement before continuing */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-amber-600" />
              <span className="text-sm text-slate-700">I have saved my Ticket ID and Tracking Secret in a safe place.</span>
            </label>

            <div className="flex gap-3 pt-2">
              <Link href="/complaints/track" className={`flex-1 text-center py-3 rounded-xl font-bold text-sm transition ${acknowledged ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"}`}>
                Track This Ticket
              </Link>
              <Link href="/complaints" className="flex-1 text-center py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                Submit Another
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Submission Form ─────────────────────────────────────────────────
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Submit a Ticket</h1>
        <p className="text-slate-500 text-sm mb-8">All submissions are anonymous. No personal information is collected.</p>

        {/* Privacy Notice */}
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">🔒 Anonymity Notice</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Do <strong>not</strong> include your name, student ID, roll number, email, phone number, or any other identifying information in the Subject, Description, or uploaded files. Doing so will compromise your anonymity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Submission Type *</label>
            <div className="flex gap-2">
              {(["Complaint", "Improvement"] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${type === t ? "bg-amber-600 text-white border-amber-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-amber-400"}`}>
                  {t === "Complaint" ? "🚨 Complaint" : "💡 Improvement"}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subject *</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary — avoid personal information"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${subjectError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
            {subjectError && <p className="mt-1 text-xs text-rose-600">{subjectError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Description *</label>
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue or suggestion in detail. Do not mention your name or student ID."
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none ${descError ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"}`} />
            <div className="flex justify-between mt-1">
              {descError ? <p className="text-xs text-rose-600">{descError}</p> : <span />}
              <p className="text-xs text-slate-400">{description.length} chars</p>
            </div>
          </div>

          {/* Evidence Upload (mock) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Evidence (Optional)</label>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <input type="file" id="evidence-upload" accept="image/*,.pdf" className="hidden"
                onChange={e => setEvidenceFileName(e.target.files?.[0]?.name || "")} />
              <label htmlFor="evidence-upload" className="cursor-pointer">
                <p className="text-2xl mb-2">📎</p>
                <p className="text-sm font-semibold text-slate-600">{evidenceFileName || "Click to attach a file"}</p>
                <p className="text-xs text-slate-400 mt-1">Images or PDF. Max 5 MB. Ensure no personal info visible.</p>
              </label>
              {evidenceFileName && (
                <button type="button" onClick={() => setEvidenceFileName("")} className="mt-2 text-xs text-rose-500 hover:text-rose-700">Remove</button>
              )}
            </div>
          </div>

          {/* Error Banner */}
          {status === "error" && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
              <p className="text-sm font-bold text-rose-700">Submission Failed</p>
              <p className="text-xs text-rose-600 mt-1">{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={status === "loading"}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-sm transition">
            {status === "loading" ? "Submitting..." : `Submit ${type} Anonymously`}
          </button>

          <p className="text-center text-xs text-slate-400">No personal data is stored. A one-time tracking secret will be shown after submission.</p>
        </form>
      </div>
    </div>
  );
}
