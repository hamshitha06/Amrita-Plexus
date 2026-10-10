import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Admin Top Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Amrita<span className="text-teal-400">Plexus</span>
          </Link>
          <span className="text-slate-500">|</span>
          <span className="text-sm font-bold text-slate-300">🛡️ Admin Area</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/admin/complaints" className="text-sm text-slate-300 hover:text-white transition">Complaints</Link>
          <Link href="/admin/complaints/analytics" className="text-sm text-slate-300 hover:text-white transition">Analytics</Link>
          <Link href="/complaints" className="text-sm text-slate-400 hover:text-slate-200 transition">← Student View</Link>
        </nav>
      </header>

      {/* Admin Warning */}
      <div className="bg-amber-600 text-white text-center text-xs font-bold py-2 px-4">
        ⚠️ ADMIN DEMO MODE — No authentication is enforced. In production, protect all /admin routes with server-side session verification.
      </div>

      <main className="max-w-7xl mx-auto px-5 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
