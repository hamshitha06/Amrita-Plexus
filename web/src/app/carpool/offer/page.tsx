'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car, ShieldCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePlexus } from '@/contexts/PlexusContext';

export default function OfferRidePage() {
  const router = useRouter();
  const { publishRide, userName } = usePlexus();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('14:00');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState(100);
  const [vehicle, setVehicle] = useState('Own Car');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    publishRide({
      origin: origin.trim(),
      destination: destination.trim(),
      date,
      time,
      availableSeats: seats,
      totalSeats: seats,
      pricePerSeat: price,
      vehicleType: vehicle,
    });

    router.push('/carpool/my-rides');
  };

  return (
    <AppLayout
      breadcrumb="Student Portal / Other Campus Modules / Offer a Campus Ride"
      title="Offer a Campus Ride"
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Navigation Title */}
        <div className="flex items-center gap-2">
          <Link href="/carpool" className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1">
            ← Dashboard
          </Link>
          <span className="text-xl font-black text-slate-900">Offer a Campus Ride</span>
        </div>

        {/* Offer Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Driver Details</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Offering ride as: <strong className="text-blue-600">{userName}</strong>
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
              Verified Student
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Origin / Pickup Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Main Gate, Campus Hostel 2"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Destination *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Coimbatore Junction, Airport"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Departure Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Departure Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Available Seats *
              </label>
              <select
                value={seats}
                onChange={e => setSeats(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 Seat</option>
                <option value={2}>2 Seats</option>
                <option value={3}>3 Seats</option>
                <option value={4}>4 Seats</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price per Seat (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ride Mode / Vehicle *
              </label>
              <select
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Own Car">Own Car</option>
                <option value="Taxi">Taxi</option>
                <option value="Bike">Bike</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Publish Carpool Ride
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
