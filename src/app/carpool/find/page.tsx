"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarpool, Ride } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";

export default function FindRide() {
  const { rides, bookRide } = useCarpool();
  const [searchParams, setSearchParams] = useState({
    source: "",
    destination: "",
  });
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const results = rides.filter((ride) => {
      const matchSource = ride.source.toLowerCase().includes(searchParams.source.toLowerCase());
      const matchDest = ride.destination.toLowerCase().includes(searchParams.destination.toLowerCase());
      
      // If either search param is empty, it shouldn't filter out based on that param.
      // But for better UX, let's just match if BOTH exist, or one exists.
      if (searchParams.source && searchParams.destination) {
        return matchSource && matchDest;
      } else if (searchParams.source) {
        return matchSource;
      } else if (searchParams.destination) {
        return matchDest;
      }
      return true; // if both empty, show all
    });
    
    setFilteredRides(results);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/carpool" className="text-gray-500 hover:text-blue-600 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Find a Ride</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              placeholder="e.g. Campus"
              value={searchParams.source}
              onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              placeholder="e.g. Airport"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {hasSearched && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Search Results ({filteredRides.length})
          </h2>
          {filteredRides.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-500">No rides found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} onBook={bookRide} hideBookButton={ride.isUserDriver} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
