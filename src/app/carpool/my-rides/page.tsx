"use client";

import Link from "next/link";
import { useCarpool } from "@/context/CarpoolContext";
import RideCard from "@/components/RideCard";

export default function MyRides() {
  const { myRides } = useCarpool();

  const offeredRides = myRides.filter((r) => r.isUserDriver);
  const bookedRides = myRides.filter((r) => !r.isUserDriver);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/carpool" className="text-gray-500 hover:text-blue-600 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Rides I&apos;ve Booked</h2>
          {bookedRides.length === 0 ? (
            <p className="text-gray-500 italic">You haven&apos;t booked any rides yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookedRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} hideBookButton />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Rides I&apos;m Offering</h2>
          {offeredRides.length === 0 ? (
            <p className="text-gray-500 italic">You haven&apos;t offered any rides yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {offeredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} hideBookButton />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
