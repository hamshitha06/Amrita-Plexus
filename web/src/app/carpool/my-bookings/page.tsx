'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function MyBookingsPage() {
  const { carpoolBookings, cancelBooking } = usePlexus();

  const accepted = carpoolBookings.filter(b => b.status === 'ACCEPTED');
  const pending = carpoolBookings.filter(b => b.status === 'PENDING');

  return (
    <AppLayout
      breadcrumb="Student Portal / Other Campus Modules / My Carpool Bookings"
      title="My Carpool Bookings"
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/carpool" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
              ← Dashboard
            </Link>
            <span className="text-xl font-black text-slate-900">My Carpool Bookings</span>
          </div>

          <Link
            href="/carpool/find"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Find More Rides</span>
          </Link>
        </div>

        {/* Section 1: Confirmed / Accepted Rides */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-slate-900">Confirmed / Accepted Rides</h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {accepted.length}
            </span>
          </div>

          {accepted.length === 0 ? (
            <div className="text-xs text-slate-400 italic">No confirmed ride bookings yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accepted.map(booking => (
                <div key={booking.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900">{booking.rideTitle}</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      ACCEPTED
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 font-medium">
                    <p><span className="text-slate-400">Driver:</span> <strong className="text-slate-800">{booking.driverName}</strong></p>
                    <p><span className="text-slate-400">Schedule:</span> <strong className="text-slate-800">{booking.schedule}</strong></p>
                    <p><span className="text-slate-400">Vehicle:</span> <strong className="text-slate-800">{booking.vehicleType} (₹{booking.price})</strong></p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <button className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer">
                      Chat & Details
                    </button>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Pending Approval Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-slate-900">Pending Approval Requests</h3>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {pending.length}
            </span>
          </div>

          <p className="text-xs text-slate-400 italic">
            No pending booking requests.
          </p>
        </div>

        {/* Section 3: History / Rejected & Cancelled */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="font-black text-base text-slate-900">History / Rejected & Cancelled</h3>
          <p className="text-xs text-slate-400 italic">No past cancelled or rejected bookings.</p>
        </div>
      </div>
    </AppLayout>
  );
}
