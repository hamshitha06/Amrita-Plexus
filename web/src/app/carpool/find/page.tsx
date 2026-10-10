'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus, CarpoolRide } from '@/contexts/PlexusContext';
import { RideDetailsModal } from '@/components/modals/RideDetailsModal';

export default function FindCarpoolPage() {
  const { carpoolRides, requestSeat } = usePlexus();
  const [selectedRide, setSelectedRide] = useState<CarpoolRide | null>(null);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const filteredRides = carpoolRides.filter(r => {
    const matchFrom = !from.trim() || r.origin.toLowerCase().includes(from.toLowerCase());
    const matchTo = !to.trim() || r.destination.toLowerCase().includes(to.toLowerCase());
    const matchDate = !date.trim() || r.date === date;
    return matchFrom && matchTo && matchDate;
  });

  const handleReset = () => {
    setFrom('');
    setTo('');
    setDate('');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Other Campus Modules / Find a Carpool"
      title="Find a Carpool"
    >
      <div className="space-y-6">
        {/* Breadcrumb Title Header */}
        <div className="flex items-center gap-2">
          <Link href="/carpool" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
            ← Dashboard
          </Link>
          <span className="text-xl font-black text-slate-900">Find a Carpool</span>
        </div>

        {/* Search Card Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Origin / From</label>
              <input
                type="text"
                placeholder="e.g. Main Gate, Campus"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination / To</label>
              <input
                type="text"
                placeholder="e.g. Railway Station, Airport"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button className="px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer">
              Search
            </button>
          </div>
        </div>

        {/* Available Rides List */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900">
            Available Rides ({filteredRides.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRides.map(ride => (
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
