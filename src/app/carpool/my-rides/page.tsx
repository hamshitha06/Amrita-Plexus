"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";
import RideDetailsModal from "@/components/RideDetailsModal";

export default function MyRides() {
  const { rides, currentUser, driverRequests, respondToBooking, cancelRide } = useCarpool();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter rides created by current logged in user
  const myOfferedRides = rides.filter((r) => r.driver_id === currentUser?.id);

  const handleRespond = async (bookingId: string, action: "accept" | "reject") => {
    setProcessingId(bookingId);
    const res = await respondToBooking(bookingId, action);
    setProcessingId(null);
    if (!res.success) {
      alert(res.error || `Failed to ${action} booking.`);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    if (!confirm("Are you sure you want to cancel this ride? All passengers will be notified.")) {
      return;
    }
    const res = await cancelRide(rideId);
    if (res.success) {
      alert("Ride cancelled successfully.");
    } else {
      alert(res.error || "Failed to cancel ride.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/carpool" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
            &larr; Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Offered Carpools</h1>
        </div>
        <Link href="/carpool/offer" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-xs hover:bg-blue-700">
          + Offer New Ride
        </Link>
      </div>

      {/* Incoming Booking Requests Section */}
      <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>Incoming Passenger Requests</span>
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {driverRequests.filter((r) => r.status === "Pending").length} Pending
          </span>
        </h2>
        <p className="text-xs text-gray-500 mb-4">Review and accept or reject requests for your offered rides</p>

        {driverRequests.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-4">No incoming passenger requests at the moment.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {driverRequests.map((req) => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{req.passenger_name}</span>
                    <span className="text-xs text-gray-500">({req.passenger_email})</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Route: <strong className="text-gray-800">{req.source} &rarr; {req.destination}</strong> ({req.date} @ {req.time})
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-500">Status:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      req.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {req.status === "Pending" && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRespond(req.id, "accept")}
                      disabled={processingId === req.id}
                      className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, "reject")}
                      disabled={processingId === req.id}
                      className="flex-1 sm:flex-initial bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-2 px-4 rounded-lg border border-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offered Rides Section */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Rides You Are Offering</h2>

      {myOfferedRides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-sm text-gray-500 mb-4">You haven&apos;t offered any rides yet.</p>
          <Link href="/carpool/offer" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg text-xs hover:bg-blue-700">
            Offer a Ride Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myOfferedRides.map((ride) => (
            <div key={ride.id} className="relative">
              <RideCard
                ride={ride}
                hideBookButton
                onViewDetails={(id) => setSelectedRideId(id)}
              />
              {ride.status !== "Cancelled" && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleCancelRide(ride.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline bg-red-50 px-3 py-1 rounded border border-red-200"
                  >
                    Cancel Entire Ride
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedRideId && (
        <RideDetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
        />
      )}
    </div>
  );
}
