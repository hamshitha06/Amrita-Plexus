"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ComplaintsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Simplified Module Navigation Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700">
            Amrita<span className="text-teal-500">Plexus</span>
          </h1>
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Campus Life &amp; Logistics Platform
          </p>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto">
          <Link href="/" className="block p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600">
            ← Back to Main Dashboard
          </Link>

          <div className="rounded-2xl border border-amber-300 bg-amber-100/60 p-3 mt-4">
            <div className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider mb-2 px-1 text-amber-900">
              <span className="flex items-center gap-2">
                <span className="text-base">📝</span>
                Complaints &amp; Improvements
              </span>
            </div>

            <nav className="space-y-1 mt-1 pl-1">
              <Link href="/complaints" className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${pathname === '/complaints' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-amber-700'}`}>
                <span className="text-sm">🏠</span>
                <span>Module Home</span>
              </Link>
              <Link href="/complaints/new" className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${pathname === '/complaints/new' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-amber-700'}`}>
                <span className="text-sm">➕</span>
                <span>Submit Ticket</span>
              </Link>
              <Link href="/complaints/track" className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${pathname.startsWith('/complaints/track') ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-amber-700'}`}>
                <span className="text-sm">🔎</span>
                <span>Track Status</span>
              </Link>
            </nav>
          </div>

          {/* Admin Area removed for compliance */}
        </div>
      </aside>

      <section className="min-w-0 flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Amrita Plexus</span>
              <span>/</span>
              <span className="text-amber-600 font-semibold">Complaints &amp; Improvements</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Anonymous Feedback Module
            </h2>
          </div>
          <div className="flex md:hidden gap-2">
            <Link href="/" className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600">Back</Link>
            <Link href="/complaints" className="px-3 py-1.5 rounded-lg bg-amber-100 text-xs font-bold text-amber-800">Menu</Link>
          </div>
        </header>

        <div className="p-5 sm:p-8 flex-1">
          {children}
        </div>
      </section>
    </div>
  );
}
