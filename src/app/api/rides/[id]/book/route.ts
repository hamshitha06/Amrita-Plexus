import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
  }

  const ride = db.prepare("SELECT * FROM rides WHERE id = ?").get(id) as any;
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Prevent self-booking
  if (ride.driver_id === userId) {
    return NextResponse.json({ error: "You cannot request a seat on your own ride." }, { status: 400 });
  }

  // Prevent booking on cancelled/completed/full rides
  if (ride.status !== "Available" || ride.available_seats <= 0) {
    return NextResponse.json({ error: "This ride is no longer available for booking." }, { status: 400 });
  }

  // Prevent duplicate active requests
  const existingBooking = db.prepare(`
    SELECT * FROM ride_bookings 
    WHERE ride_id = ? AND passenger_id = ? AND status IN ('Pending', 'Accepted')
  `).get(id, userId);

  if (existingBooking) {
    return NextResponse.json({ error: "You already have an active request or booking for this ride." }, { status: 400 });
  }

  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const bookTx = db.transaction(() => {
    // Insert pending booking
    db.prepare(`
      INSERT INTO ride_bookings (id, ride_id, passenger_id, seats_requested, status)
      VALUES (?, ?, ?, 1, 'Pending')
    `).run(bookingId, id, userId);

    // Notify ride owner
    db.prepare(`
      INSERT INTO notifications (id, recipient_id, ride_id, message)
      VALUES (?, ?, ?, ?)
    `).run(
      `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ride.driver_id,
      id,
      `${user.name} requested a seat on your ride from ${ride.source} to ${ride.destination}.`
    );
  });

  bookTx();

  const createdBooking = db.prepare("SELECT * FROM ride_bookings WHERE id = ?").get(bookingId);

  return NextResponse.json({ success: true, booking: createdBooking });
}
