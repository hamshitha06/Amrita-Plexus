import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const ride = db.prepare(`
    SELECT r.*, u.name as driver_name, u.email as driver_email, u.verified as driver_verified 
    FROM rides r
    JOIN users u ON r.driver_id = u.id
    WHERE r.id = ?
  `).get(id) as any;

  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Get bookings for this ride
  const bookings = db.prepare(`
    SELECT b.*, u.name as passenger_name, u.email as passenger_email
    FROM ride_bookings b
    JOIN users u ON b.passenger_id = u.id
    WHERE b.ride_id = ?
    ORDER BY b.created_at DESC
  `).all(id);

  // Check if current user has an active booking
  const userBooking = bookings.find((b: any) => b.passenger_id === userId);

  return NextResponse.json({
    ride,
    bookings,
    userBooking,
    isOwner: ride.driver_id === userId,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const ride = db.prepare("SELECT * FROM rides WHERE id = ?").get(id) as any;
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  if (ride.driver_id !== userId) {
    return NextResponse.json({ error: "Only the ride owner can cancel this ride." }, { status: 403 });
  }

  // Transaction for cancelling ride and updating bookings + creating notifications
  const cancelTx = db.transaction(() => {
    db.prepare("UPDATE rides SET status = 'Cancelled', available_seats = 0, updated_at = datetime('now') WHERE id = ?").run(id);

    // Get all passengers with active bookings to notify them
    const activeBookings = db.prepare(`
      SELECT passenger_id FROM ride_bookings WHERE ride_id = ? AND status IN ('Pending', 'Accepted')
    `).all(id) as any[];

    for (const b of activeBookings) {
      db.prepare(`
        INSERT INTO notifications (id, recipient_id, ride_id, message)
        VALUES (?, ?, ?, ?)
      `).run(
        `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        b.passenger_id,
        id,
        `Ride from ${ride.source} to ${ride.destination} on ${ride.date} was cancelled by the driver.`
      );
    }

    db.prepare("UPDATE ride_bookings SET status = 'Cancelled', updated_at = datetime('now') WHERE ride_id = ? AND status IN ('Pending', 'Accepted')").run(id);
  });

  cancelTx();

  return NextResponse.json({ success: true, message: "Ride cancelled successfully." });
}
