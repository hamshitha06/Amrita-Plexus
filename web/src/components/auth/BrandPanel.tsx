'use client';

import { motion } from 'framer-motion';

const SERVICES = [
  { icon: '📦', label: 'Parcel Management', desc: 'Gate pickup & peer rewards' },
  { icon: '🍿', label: 'P2P Student Snacks', desc: 'Homemade treats & pantry' },
  { icon: '🌙', label: 'Night Canteen AI', desc: 'OCR blackboard menu detector' },
  { icon: '📣', label: 'Hostel Resident Forum', desc: 'Announcements & discussions' },
  { icon: '🚗', label: 'Campus Carpooling', desc: 'Rideshare to station & town' },
];

export function BrandPanel() {
  return (
    <div className="relative flex flex-col justify-between h-full overflow-hidden p-12 bg-slate-900 text-white select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-xl font-bold">
            ⚡
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white">
              Amrita<span className="text-emerald-400">Plexus</span>
            </span>
            <p className="text-xs text-slate-400 font-medium">Campus Life & Logistics Platform</p>
          </div>
        </div>
      </motion.div>

      {/* Hero Headline */}
      <motion.div
        className="relative z-10 my-auto py-8 space-y-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live at Amrita Vishwa Vidyapeetham</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
          Your Campus Life,
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Seamlessly Connected.
          </span>
        </h1>

        <p className="text-slate-400 text-sm max-w-md leading-relaxed font-medium">
          Track incoming Amazon parcels, buy/sell pantry snacks in Gargi Hostel, scan night canteen menus with AI OCR, and discuss on resident forums.
        </p>
      </motion.div>

      {/* Services List Preview */}
      <div className="relative z-10 space-y-2.5">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xs font-bold text-white">{s.label}</p>
              <p className="text-[11px] text-slate-400 font-medium">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 text-slate-500 text-xs flex items-center justify-between">
        <span>© {new Date().getFullYear()} AmritaPlexus</span>
        <span>Built for Amrita Students</span>
      </div>
    </div>
  );
}
