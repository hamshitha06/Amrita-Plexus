import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source")?.trim() || "";
  const destination = searchParams.get("destination")?.trim() || "";
  const date = searchParams.get("date")?.trim() || "";
  const status = searchParams.get("status") || "Available";

  let query = `
    SELECT r.*, u.name as driver_name, u.email as driver_email, u.verified as driver_verified 
    FROM rides r
    JOIN users u ON r.driver_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status !== "all") {
    query += ` AND r.status = ?`;
    params.push(status);
  }

  if (source) {
    query += ` AND LOWER(r.source) LIKE ?`;
    params.push(`%${source.toLowerCase()}%`);
  }

  if (destination) {
    query += ` AND LOWER(r.destination) LIKE ?`;
    params.push(`%${destination.toLowerCase()}%`);
  }

  if (date) {
    query += ` AND r.date = ?`;
    params.push(date);
  }

  query += ` ORDER BY r.date ASC, r.time ASC`;

  const rides = db.prepare(query).all(...params);

  return NextResponse.json({ rides });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
  }

  if (!user.verified) {
    return NextResponse.json({ error: "Only verified campus students can offer rides." }, { status: 403 });
  }

  const body = await request.json();
  const { source, destination, date, time, seats, price, rideType } = body;

  // Validation
  if (!source || !destination || !date || !time) {
    return NextResponse.json({ error: "All route and schedule fields are required." }, { status: 400 });
  }

  const numSeats = Number(seats);
  const numPrice = Number(price);

  if (isNaN(numSeats) || numSeats < 1) {
    return NextResponse.json({ error: "Available seats must be at least 1." }, { status: 400 });
  }

  if (isNaN(numPrice) || numPrice < 0) {
    return NextResponse.json({ error: "Price cannot be negative." }, { status: 400 });
  }

  // Reject past departure dates
  const today = new Date().toISOString().split("T")[0];
  if (date < today) {
    return NextResponse.json({ error: "Departure date cannot be in the past." }, { status: 400 });
  }

  const rideId = `ride_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  db.prepare(`
    INSERT INTO rides (id, driver_id, source, destination, date, time, seats, available_seats, price, ride_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')
  `).run(rideId, userId, source, destination, date, time, numSeats, numSeats, numPrice, rideType || "Own Car");

  const createdRide = db.prepare(`
    SELECT r.*, u.name as driver_name FROM rides r JOIN users u ON r.driver_id = u.id WHERE r.id = ?
  `).get(rideId);

  return NextResponse.json({ success: true, ride: createdRide });
}
