import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  // Bookings requested by the user as a passenger
  const passengerBookings = db.prepare(`
    SELECT b.*, 
           r.source, r.destination, r.date, r.time, r.price, r.ride_type, r.status as ride_status,
           u.name as driver_name, u.email as driver_email
    FROM ride_bookings b
    JOIN rides r ON b.ride_id = r.id
    JOIN users u ON r.driver_id = u.id
    WHERE b.passenger_id = ?
    ORDER BY b.created_at DESC
  `).all(userId);

  // Incoming booking requests for rides where user is the driver
  const driverIncomingRequests = db.prepare(`
    SELECT b.*, 
           r.source, r.destination, r.date, r.time, r.available_seats, r.seats as total_seats,
           u.name as passenger_name, u.email as passenger_email
    FROM ride_bookings b
    JOIN rides r ON b.ride_id = r.id
    JOIN users u ON b.passenger_id = u.id
    WHERE r.driver_id = ?
    ORDER BY b.created_at DESC
  `).all(userId);

  return NextResponse.json({
    passengerBookings,
    driverIncomingRequests,
  });
}
