import Link from "next/link";

export default function PlaceholderPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          🍽️
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mess Menu</h1>
        <p className="text-slate-500 mb-6">
          This module is managed in the main application dashboard or is not yet implemented as a standalone route.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-teal-700 transition">
            Go to Main Dashboard
          </Link>
          <Link href="/ai-guide" className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-xl hover:bg-slate-200 transition">
            Return to AI Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
