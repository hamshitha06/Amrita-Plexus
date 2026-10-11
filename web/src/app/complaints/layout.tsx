"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageSquare, Plus, ListFilter, Search, ShieldCheck } from "lucide-react";

export default function ComplaintsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Complaints Overview", href: "/complaints", icon: MessageSquare },
    { name: "Submit Ticket", href: "/complaints/new", icon: Plus },
    { name: "My Tickets", href: "/complaints/my-tickets", icon: ListFilter },
    { name: "Track Status", href: "/complaints/track", icon: Search },
  ];

  return (
    <RouteGuard>
      <AppLayout
        breadcrumb="Student Portal / Complaints & Improvements"
        title="Complaints & Anonymous Feedback"
      >
        <div className="space-y-6">
          {/* Sub-nav Tab Bar with Plexus Design */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 pr-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                100% Anonymous Redressal
              </span>
            </div>
          </div>

          {/* Main content */}
          <div>{children}</div>
        </div>
      </AppLayout>
    </RouteGuard>
  );
}
