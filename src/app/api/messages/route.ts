import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rideId = searchParams.get("rideId");

  if (!rideId) {
    return NextResponse.json({ error: "rideId is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const ride = db.prepare("SELECT * FROM rides WHERE id = ?").get(rideId) as any;
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Authorization check: User must be driver or have a booking
  const booking = db.prepare(`
    SELECT * FROM ride_bookings WHERE ride_id = ? AND passenger_id = ?
  `).get(rideId, userId);

  if (ride.driver_id !== userId && !booking) {
    return NextResponse.json({ error: "You are not authorized to view messages for this ride." }, { status: 403 });
  }

  const messages = db.prepare(`
    SELECT m.*, u.name as sender_name 
    FROM ride_messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.ride_id = ?
    ORDER BY m.created_at ASC
  `).all(rideId);

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const body = await request.json();
  const { rideId, content } = body;

  if (!rideId || !content || !content.trim()) {
    return NextResponse.json({ error: "Ride ID and message content are required." }, { status: 400 });
  }

  const ride = db.prepare("SELECT * FROM rides WHERE id = ?").get(rideId) as any;
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Check authorization
  const booking = db.prepare(`
    SELECT * FROM ride_bookings WHERE ride_id = ? AND passenger_id = ?
  `).get(rideId, userId);

  if (ride.driver_id !== userId && !booking) {
    return NextResponse.json({ error: "Only ride participants can send messages." }, { status: 403 });
  }

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  db.prepare(`
    INSERT INTO ride_messages (id, ride_id, sender_id, content)
    VALUES (?, ?, ?, ?)
  `).run(messageId, rideId, userId, content.trim());

  const createdMessage = db.prepare(`
    SELECT m.*, u.name as sender_name FROM ride_messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?
  `).get(messageId);

  return NextResponse.json({ success: true, message: createdMessage });
}
