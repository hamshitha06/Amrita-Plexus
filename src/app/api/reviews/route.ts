import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rideId = searchParams.get("rideId");

  if (!rideId) {
    return NextResponse.json({ error: "rideId is required" }, { status: 400 });
  }

  const reviews = db.prepare(`
    SELECT r.*, u1.name as reviewer_name, u2.name as reviewee_name
    FROM ride_reviews r
    JOIN users u1 ON r.reviewer_id = u1.id
    JOIN users u2 ON r.reviewee_id = u2.id
    WHERE r.ride_id = ?
    ORDER BY r.created_at DESC
  `).all(rideId);

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const body = await request.json();
  const { rideId, rating, feedback } = body;

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return NextResponse.json({ error: "Rating must be an integer between 1 and 5 stars." }, { status: 400 });
  }

  const ride = db.prepare("SELECT * FROM rides WHERE id = ?").get(rideId) as any;
  if (!ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  // Determine reviewee (if passenger is reviewing, reviewee is driver; if driver, reviewee is passenger)
  let revieweeId = ride.driver_id;
  if (userId === ride.driver_id) {
    // Driver reviewing a passenger
    const acceptedBooking = db.prepare(`
      SELECT passenger_id FROM ride_bookings WHERE ride_id = ? AND status = 'Accepted' LIMIT 1
    `).get(rideId) as any;

    if (!acceptedBooking) {
      return NextResponse.json({ error: "No accepted passengers found for this ride to review." }, { status: 400 });
    }
    revieweeId = acceptedBooking.passenger_id;
  } else {
    // Passenger reviewing driver
    const booking = db.prepare(`
      SELECT * FROM ride_bookings WHERE ride_id = ? AND passenger_id = ? AND status = 'Accepted'
    `).get(rideId, userId);

    if (!booking) {
      return NextResponse.json({ error: "Only accepted passengers can review the ride driver." }, { status: 403 });
    }
  }

  // Prevent self-review
  if (userId === revieweeId) {
    return NextResponse.json({ error: "You cannot review yourself." }, { status: 400 });
  }

  // Prevent duplicate review
  const existingReview = db.prepare(`
    SELECT * FROM ride_reviews WHERE ride_id = ? AND reviewer_id = ?
  `).get(rideId, userId);

  if (existingReview) {
    return NextResponse.json({ error: "You have already submitted a review for this ride." }, { status: 400 });
  }

  const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  db.prepare(`
    INSERT INTO ride_reviews (id, ride_id, reviewer_id, reviewee_id, rating, feedback)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(reviewId, rideId, userId, revieweeId, numRating, feedback || "");

  const createdReview = db.prepare(`
    SELECT r.*, u1.name as reviewer_name FROM ride_reviews r JOIN users u1 ON r.reviewer_id = u1.id WHERE r.id = ?
  `).get(reviewId);

  return NextResponse.json({ success: true, review: createdReview });
}
