"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldAlert, BarChart3, ListFilter, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("admin") || false;

  return (
    <RouteGuard>
      <AppLayout
        breadcrumb="Admin Portal / Complaints & Grievance Redressal"
        title="Admin Management Console"
      >
        <div className="space-y-6">
          {/* Top Admin Controls & Demo Disclaimer */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                🛡️ Admin Mode
              </span>
              <p className="text-xs text-amber-900 font-semibold">
                Demo In-Memory Mode (complaints-db.ts). All tickets are managed anonymously.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/complaints"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <ListFilter className="w-3.5 h-3.5" />
                Tickets
              </Link>
              <Link
                href="/admin/complaints/analytics"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </Link>
              <Link
                href="/complaints"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Student View
              </Link>
            </div>
          </div>

          {!isAdmin ? (
            <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-lg mx-auto shadow-2xs">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">Admin Access Required</h2>
              <p className="text-sm text-slate-600 mb-6">
                Your account ({user?.email}) does not have administrative privileges (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">admin</code> role).
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/complaints"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Return to Student Complaints
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </AppLayout>
    </RouteGuard>
  );
}
