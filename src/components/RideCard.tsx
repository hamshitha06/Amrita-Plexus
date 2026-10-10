"use client";

import { Ride } from "@/context/CarpoolContext";
import { useState } from "react";

type RideCardProps = {
  ride: Ride;
  onBook?: (id: string) => Promise<{ success: boolean; error?: string }>;
  onViewDetails?: (id: string) => void;
  hideBookButton?: boolean;
};

export default function RideCard({ ride, onBook, onViewDetails, hideBookButton }: RideCardProps) {
  const [booking, setBooking] = useState(false);

  const handleBookClick = async () => {
    if (!onBook) return;
    setBooking(true);
    const res = await onBook(ride.id);
    setBooking(false);
    if (res.success) {
      alert("Seat request submitted successfully!");
    } else {
      alert(res.error || "Failed to request seat.");
    }
  };

  const isFull = ride.available_seats === 0 || ride.status === "Full";
  const isCancelled = ride.status === "Cancelled";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-900">{ride.source} &rarr; {ride.destination}</h3>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              ride.status === 'Available' ? 'bg-green-100 text-green-800' :
              ride.status === 'Full' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {ride.status}
            </span>
          </div>
          <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-extrabold border border-blue-200">
            ₹{ride.price}
          </span>
        </div>

        <div className="text-gray-600 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div>
            <span className="text-gray-400 block font-medium">Driver</span>
            <span className="font-semibold text-gray-800">{ride.driver_name || "Verified Student"}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Type</span>
            <span className="font-semibold text-gray-800">{ride.ride_type || "Own Car"}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Date & Time</span>
            <span className="font-semibold text-gray-800">{ride.date} @ {ride.time}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-medium">Available Seats</span>
            <span className="font-bold text-blue-600">{ride.available_seats} / {ride.seats}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(ride.id)}
            className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg text-xs transition-colors border border-gray-300"
          >
            View Details
          </button>
        )}

        {!hideBookButton && !isCancelled && !isFull && onBook && (
          <button
            onClick={handleBookClick}
            disabled={booking}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors shadow"
          >
            {booking ? "Requesting..." : "Request Seat"}
          </button>
        )}

        {!hideBookButton && (isFull || isCancelled) && (
          <span className="w-full md:w-auto text-center bg-gray-100 text-gray-400 font-semibold py-2 px-4 rounded-lg text-xs cursor-not-allowed border border-gray-200">
            {isCancelled ? "Cancelled" : "Fully Booked"}
          </span>
        )}
      </div>
    </div>
  );
}
