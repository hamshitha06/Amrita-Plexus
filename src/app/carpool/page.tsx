"use client";

import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";

export default function CarpoolDashboard() {
  const { rides, bookRide } = useCarpool();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carpooling</h1>
          <p className="text-gray-600 mt-1">Share rides with your college peers.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/carpool/offer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
          >
            Offer a Ride
          </Link>
          <Link
            href="/carpool/find"
            className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
          >
            Find a Ride
          </Link>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Available Rides</h2>
        <Link href="/carpool/my-rides" className="text-blue-600 hover:underline font-medium text-sm">
          View My Rides &rarr;
        </Link>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-500">No rides available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rides.map((ride) => (
            <RideCard 
              key={ride.id} 
              ride={ride} 
              onBook={bookRide} 
              hideBookButton={ride.isUserDriver} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
