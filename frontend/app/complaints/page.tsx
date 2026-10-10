import Link from "next/link";

export default function ComplaintsHome() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Complaints & Improvements
        </h1>
        <p className="text-slate-500 mb-8">
          Submit anonymous feedback, report infrastructure issues, or suggest improvements to campus services.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/complaints/new" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ➕
            </div>
            <h3 className="text-lg font-bold text-slate-900">Submit a Ticket</h3>
            <p className="text-sm text-slate-500 mt-2">File a new anonymous complaint or suggestion. You will receive a unique tracking secret.</p>
          </Link>

          <Link href="/complaints/track" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🔎
            </div>
            <h3 className="text-lg font-bold text-slate-900">Track a Ticket</h3>
            <p className="text-sm text-slate-500 mt-2">Check the status of an existing ticket using your Ticket ID and secure Tracking Secret.</p>
          </Link>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2">🔒 Privacy & Anonymity Guarantee</h3>
        <p className="text-sm text-amber-800 leading-relaxed">
          Your identity is never linked to your submissions. We do not track your student ID, email, or IP address. 
          <br /><br />
          <strong>Important:</strong> Please ensure you do not accidentally include identifying information (like your name or roll number) in the ticket description or uploaded evidence.
        </p>
      </div>
    </div>
  );
}
