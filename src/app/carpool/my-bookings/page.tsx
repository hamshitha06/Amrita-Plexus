"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideDetailsModal from "@/components/RideDetailsModal";

export default function MyBookings() {
  const { passengerBookings, cancelBooking } = useCarpool();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    const res = await cancelBooking(bookingId);
    setCancellingId(null);
    if (res.success) {
      alert("Booking cancelled successfully.");
    } else {
      alert(res.error || "Failed to cancel booking.");
    }
  };

  const pendingBookings = passengerBookings.filter((b) => b.status === "Pending");
  const acceptedBookings = passengerBookings.filter((b) => b.status === "Accepted");
  const pastOrCancelledBookings = passengerBookings.filter((b) => b.status === "Rejected" || b.status === "Cancelled");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/carpool" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
            &larr; Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Carpool Bookings</h1>
        </div>
        <Link href="/carpool/find" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-xs hover:bg-blue-700">
          Find More Rides
        </Link>
      </div>

      <div className="space-y-8">
        {/* Accepted Bookings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
            <span>Confirmed / Accepted Rides</span>
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {acceptedBookings.length}
            </span>
          </h2>

          {acceptedBookings.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">No confirmed ride bookings.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedBookings.map((b) => (
                <div key={b.id} className="border border-green-200 bg-green-50/50 rounded-xl p-4 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-base">{b.source} &rarr; {b.destination}</h3>
                      <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ACCEPTED</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>Driver:</strong> {b.driver_name}</p>
                      <p><strong>Schedule:</strong> {b.date} @ {b.time}</p>
                      <p><strong>Vehicle:</strong> {b.ride_type || "Car"} (₹{b.price})</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRideId(b.ride_id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors shadow-xs"
                    >
                      Chat & Details
                    </button>
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-2 px-3 rounded-lg border border-red-200"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending Requests */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-3">
            <span>Pending Approval Requests</span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {pendingBookings.length}
            </span>
          </h2>

          {pendingBookings.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">No pending booking requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-base">{b.source} &rarr; {b.destination}</h3>
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">PENDING</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>Driver:</strong> {b.driver_name}</p>
                      <p><strong>Schedule:</strong> {b.date} @ {b.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRideId(b.ride_id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs py-2 rounded-lg border border-gray-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-2 px-3 rounded-lg border border-red-200"
                    >
                      Withdraw Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rejected or Cancelled */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">History / Rejected & Cancelled</h2>
          {pastOrCancelledBookings.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">No previous rejected or cancelled bookings.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {pastOrCancelledBookings.map((b) => (
                <div key={b.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{b.source} &rarr; {b.destination}</span>
                    <span className="text-gray-500 block">Driver: {b.driver_name} ({b.date})</span>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedRideId && (
        <RideDetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
        />
      )}
    </div>
  );
}
