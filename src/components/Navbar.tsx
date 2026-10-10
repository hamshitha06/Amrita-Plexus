"use client";

import Link from "next/link";
import UserSwitcher from "./UserSwitcher";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl tracking-tight">
              Amrita-Plexus
            </Link>
            <div className="hidden sm:flex sm:space-x-4">
              <Link href="/" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Home
              </Link>
              <Link href="/carpool" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Carpool Dashboard
              </Link>
              <Link href="/carpool/find" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Find Ride
              </Link>
              <Link href="/carpool/offer" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Offer Ride
              </Link>
              <Link href="/carpool/my-rides" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                My Rides
              </Link>
              <Link href="/carpool/my-bookings" className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                My Bookings
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
