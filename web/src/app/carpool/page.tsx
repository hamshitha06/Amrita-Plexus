'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Search, Plus, ArrowRight, ShieldCheck, Clock, User, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, CarpoolRide } from '@/contexts/PlexusContext';
import { RideDetailsModal } from '@/components/modals/RideDetailsModal';

export default function CarpoolOverviewPage() {
  const { carpoolRides, carpoolBookings, requestSeat } = usePlexus();
  const [selectedRide, setSelectedRide] = React.useState<CarpoolRide | null>(null);

  const confirmedBookings = carpoolBookings.filter(b => b.status === 'ACCEPTED');

  return (
    <AppLayout
      breadcrumb="Student Portal / Other Campus Modules / Carpooling"
      title="Campus Carpooling"
    >
      <div className="space-y-6">
        {/* Top Header Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Campus Ride Sharing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🚗</span> Campus Carpooling
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Share rides safely with verified Amrita students. Save travel costs, reduce emissions, and connect with peers.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/carpool/offer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Offer a Ride</span>
              </Link>
              <Link
                href="/carpool/find"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Find a Ride</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Explore</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{carpoolRides.length}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Available campus carpools</p>
            </div>
            <Link href="/carpool/find" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
              Browse Rides →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">0</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Requests for your offered rides</p>
            </div>
            <Link href="/carpool/my-rides" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
              Review Requests →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Confirmed Rides</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{confirmedBookings.length}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Rides you have joined</p>
            </div>
            <Link href="/carpool/my-bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1">
              View Bookings →
            </Link>
          </div>
        </div>

        {/* Upcoming Carpools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Carpools</h3>
              <p className="text-xs text-slate-400">Find real-time offered rides around campus</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-blue-600">
              <Link href="/carpool/my-rides" className="hover:underline">My Offered Rides</Link>
              <span>•</span>
              <Link href="/carpool/my-bookings" className="hover:underline">My Booked Rides</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carpoolRides.map(ride => (
              <div key={ride.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-slate-900">
                      {ride.origin} → {ride.destination}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {ride.status}
                      </span>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        ₹{ride.pricePerSeat}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
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
                </div>

                <div className="flex items-center gap-2 self-end w-full pt-2">
                  <button
                    onClick={() => setSelectedRide(ride)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                  {!ride.isOfferedByMe && (
                    <button
                      onClick={() => requestSeat(ride.id)}
                      className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      Request Seat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RideDetailsModal
        isOpen={!!selectedRide}
        onClose={() => setSelectedRide(null)}
        ride={selectedRide}
      />
    </AppLayout>
  );
}
