"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";
import RideDetailsModal from "@/components/RideDetailsModal";

export default function CarpoolDashboard() {
  const { rides, bookRide, passengerBookings, driverRequests, loading } = useCarpool();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const pendingRequestsCount = driverRequests.filter((r) => r.status === "Pending").length;
  const activeBookingsCount = passengerBookings.filter((b) => b.status === "Accepted").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Campus Carpooling</h1>
          <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
            Share rides safely with verified Amrita students. Save travel costs, reduce emissions, and connect with peers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link
            href="/carpool/offer"
            className="flex-1 sm:flex-initial text-center bg-white text-blue-700 hover:bg-blue-50 font-bold py-2.5 px-5 rounded-xl transition-all shadow-md text-sm"
          >
            + Offer a Ride
          </Link>
          <Link
            href="/carpool/find"
            className="flex-1 sm:flex-initial text-center bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/30 font-bold py-2.5 px-5 rounded-xl transition-all text-sm"
          >
            🔍 Find a Ride
          </Link>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Link href="/carpool/find" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all group">
          <span className="text-xs text-gray-500 font-semibold uppercase">Explore</span>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-gray-900">{rides.length}</h3>
            <span className="text-blue-600 font-semibold text-xs group-hover:underline">Browse Rides &rarr;</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Available campus carpools</p>
        </Link>

        <Link href="/carpool/my-rides" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all group">
          <span className="text-xs text-gray-500 font-semibold uppercase">Pending Requests</span>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-amber-600">{pendingRequestsCount}</h3>
            <span className="text-blue-600 font-semibold text-xs group-hover:underline">Review Requests &rarr;</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Requests for your offered rides</p>
        </Link>

        <Link href="/carpool/my-bookings" className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all group">
          <span className="text-xs text-gray-500 font-semibold uppercase">My Confirmed Rides</span>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-green-600">{activeBookingsCount}</h3>
            <span className="text-blue-600 font-semibold text-xs group-hover:underline">View Bookings &rarr;</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Rides you have joined</p>
        </Link>
      </div>

      {/* Available Rides Listing */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upcoming Carpools</h2>
          <p className="text-xs text-gray-500">Find real-time offered rides around campus</p>
        </div>
        <div className="flex gap-4">
          <Link href="/carpool/my-rides" className="text-blue-600 hover:underline font-semibold text-sm">
            My Offered Rides
          </Link>
          <Link href="/carpool/my-bookings" className="text-blue-600 hover:underline font-semibold text-sm">
            My Booked Rides
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Loading carpools from database...</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Carpools Available</h3>
          <p className="text-sm text-gray-500 mb-6">Be the first student to offer a ride today!</p>
          <Link href="/carpool/offer" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Offer a Ride Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onBook={bookRide}
              onViewDetails={(id) => setSelectedRideId(id)}
            />
          ))}
        </div>
      )}

      {/* Ride Details Modal */}
      {selectedRideId && (
        <RideDetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
        />
      )}
    </div>
  );
}
