'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function MyRidesPage() {
  const { carpoolRides, cancelOfferedRide } = usePlexus();
  const offeredByMe = carpoolRides.filter(r => r.isOfferedByMe);

  return (
    <AppLayout
      breadcrumb="Student Portal / Other Campus Modules / My Offered Carpools"
      title="My Offered Carpools"
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/carpool" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
              ← Dashboard
            </Link>
            <span className="text-xl font-black text-slate-900">My Offered Carpools</span>
          </div>

          <Link
            href="/carpool/offer"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Offer New Ride</span>
          </Link>
        </div>

        {/* Section 1: Incoming Passenger Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-slate-900">Incoming Passenger Requests</h3>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
              0 Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Review and accept or reject requests for your offered rides</p>
          <div className="pt-2 text-xs text-slate-400 italic">
            No incoming passenger requests at the moment.
          </div>
        </div>

        {/* Section 2: Rides You Are Offering */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900">Rides You Are Offering</h3>

          {offeredByMe.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-xs text-slate-400 font-medium">
              You have not offered any rides yet. Click &quot;+ Offer New Ride&quot; to publish your carpool!
            </div>
          ) : (
            <div className="space-y-4">
              {offeredByMe.map(ride => (
                <div key={ride.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-slate-900">
                      {ride.origin} → {ride.destination}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {ride.status}
                      </span>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        ₹{ride.pricePerSeat}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Driver</span>
                      <span className="font-bold text-slate-900 text-[11px] truncate block">{ride.driverName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Type</span>
                      <span className="font-bold text-slate-900 text-[11px]">{ride.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Date & Time</span>
                      <span className="font-bold text-slate-900 text-[11px]">{ride.date} @ {ride.time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-bold">Available Seats</span>
                      <span className="font-bold text-blue-600 text-[11px]">{ride.availableSeats} / {ride.totalSeats}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs border border-slate-200 transition-all cursor-pointer">
                      View Details
                    </button>
                    <button
                      onClick={() => cancelOfferedRide(ride.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
                    >
                      Cancel Entire Ride
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
