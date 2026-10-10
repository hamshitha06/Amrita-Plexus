"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";
import RideDetailsModal from "@/components/RideDetailsModal";

export default function FindRide() {
  const { rides, fetchRides, bookRide, loading } = useCarpool();

  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRides(searchParams);
  };

  const handleReset = () => {
    setSearchParams({ source: "", destination: "", date: "" });
    fetchRides();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/carpool" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors">
            &larr; Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Find a Carpool</h1>
        </div>
      </div>

      {/* Search Filter Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Origin / From</label>
            <input
              type="text"
              placeholder="e.g. Main Gate, Campus"
              value={searchParams.source}
              onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Destination / To</label>
            <input
              type="text"
              placeholder="e.g. Railway Station, Airport"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Departure Date</label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm border border-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          Available Rides ({rides.length})
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Searching database...</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-base font-bold text-gray-800 mb-1">No Matching Rides Found</h3>
          <p className="text-xs text-gray-500 mb-4">Try clearing your filters or changing your departure date.</p>
          <button onClick={handleReset} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-xs">
            Clear Filters
          </button>
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

      {selectedRideId && (
        <RideDetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
        />
      )}
    </div>
  );
}
