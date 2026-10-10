import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const body = await request.json();
  const { action } = body; // 'accept' or 'reject'

  if (action !== "accept" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action. Must be 'accept' or 'reject'." }, { status: 400 });
  }

  const booking = db.prepare(`
    SELECT b.*, r.driver_id, r.available_seats, r.source, r.destination, r.date, r.status as ride_status
    FROM ride_bookings b
    JOIN rides r ON b.ride_id = r.id
    WHERE b.id = ?
  `).get(id) as any;

  if (!booking) {
    return NextResponse.json({ error: "Booking request not found" }, { status: 404 });
  }

  // Authorization check: Only ride owner can accept/reject
  if (booking.driver_id !== userId) {
    return NextResponse.json({ error: "Only the ride owner can process booking requests." }, { status: 403 });
  }

  if (booking.status !== "Pending") {
    return NextResponse.json({ error: `Booking request is already ${booking.status.toLowerCase()}.` }, { status: 400 });
  }

  if (action === "accept") {
    // Transactional approval with concurrency check
    const acceptTx = db.transaction(() => {
      // Re-fetch current available seats to prevent race conditions
      const currentRide = db.prepare("SELECT available_seats, status FROM rides WHERE id = ?").get(booking.ride_id) as any;

      if (!currentRide || currentRide.available_seats <= 0 || currentRide.status !== "Available") {
        throw new Error("No available seats left on this ride.");
      }

      const newAvailable = currentRide.available_seats - 1;
      const newRideStatus = newAvailable === 0 ? "Full" : "Available";

      db.prepare("UPDATE rides SET available_seats = ?, status = ?, updated_at = datetime('now') WHERE id = ?").run(
        newAvailable,
        newRideStatus,
        booking.ride_id
      );

      db.prepare("UPDATE ride_bookings SET status = 'Accepted', updated_at = datetime('now') WHERE id = ?").run(id);

      // Notify passenger
      db.prepare(`
        INSERT INTO notifications (id, recipient_id, ride_id, message)
        VALUES (?, ?, ?, ?)
      `).run(
        `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        booking.passenger_id,
        booking.ride_id,
        `Your seat request for ride from ${booking.source} to ${booking.destination} on ${booking.date} has been ACCEPTED!`
      );
    });

    try {
      acceptTx();
      return NextResponse.json({ success: true, message: "Booking accepted successfully." });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Failed to accept booking due to seat unavailability." }, { status: 400 });
    }
  } else {
    // Reject
    const rejectTx = db.transaction(() => {
      db.prepare("UPDATE ride_bookings SET status = 'Rejected', updated_at = datetime('now') WHERE id = ?").run(id);

      // Notify passenger
      db.prepare(`
        INSERT INTO notifications (id, recipient_id, ride_id, message)
        VALUES (?, ?, ?, ?)
      `).run(
        `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        booking.passenger_id,
        booking.ride_id,
        `Your seat request for ride from ${booking.source} to ${booking.destination} on ${booking.date} was rejected.`
      );
    });

    rejectTx();
    return NextResponse.json({ success: true, message: "Booking request rejected." });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const booking = db.prepare(`
    SELECT b.*, r.driver_id, r.source, r.destination, r.date, r.available_seats, r.seats as total_seats
    FROM ride_bookings b
    JOIN rides r ON b.ride_id = r.id
    WHERE b.id = ?
  `).get(id) as any;

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Authorization check: Only passenger or ride owner can cancel
  if (booking.passenger_id !== userId && booking.driver_id !== userId) {
    return NextResponse.json({ error: "Unauthorized to cancel this booking." }, { status: 403 });
  }

  const cancelTx = db.transaction(() => {
    db.prepare("UPDATE ride_bookings SET status = 'Cancelled', updated_at = datetime('now') WHERE id = ?").run(id);

    // If it was previously accepted, restore the seat
    if (booking.status === "Accepted") {
      const newAvailable = Math.min(booking.total_seats, booking.available_seats + 1);
      db.prepare("UPDATE rides SET available_seats = ?, status = 'Available', updated_at = datetime('now') WHERE id = ?").run(
        newAvailable,
        booking.ride_id
      );
    }

    // Notify the other party
    const recipientId = userId === booking.passenger_id ? booking.driver_id : booking.passenger_id;
    db.prepare(`
      INSERT INTO notifications (id, recipient_id, ride_id, message)
      VALUES (?, ?, ?, ?)
    `).run(
      `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      recipientId,
      booking.ride_id,
      `A booking for ride from ${booking.source} to ${booking.destination} was cancelled.`
    );
  });

  cancelTx();

  return NextResponse.json({ success: true, message: "Booking cancelled successfully." });
}
