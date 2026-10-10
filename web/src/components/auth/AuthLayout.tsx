'use client';

import React from 'react';
import { BrandPanel } from '@/components/auth/BrandPanel';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:block lg:w-[48%] relative">
        <BrandPanel />
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-xl font-black text-slate-900">
            <span>⚡</span>
            <span>Amrita<span className="text-emerald-600">Plexus</span></span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Campus Life & Logistics Platform</p>
        </div>

        {/* Center Card Container */}
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
