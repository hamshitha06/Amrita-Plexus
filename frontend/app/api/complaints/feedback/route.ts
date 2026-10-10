import { NextRequest, NextResponse } from "next/server";
import { submitFeedback } from "@/src/lib/complaints-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, trackingSecret, rating, feedbackComment = "" } = body;

    if (!ticketId || !trackingSecret) {
      return NextResponse.json({ error: "ticketId and trackingSecret are required." }, { status: 400 });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const ok = submitFeedback(ticketId.trim(), trackingSecret.trim(), rating, feedbackComment.toString().slice(0, 500));

    if (!ok) {
      return NextResponse.json({ error: "Ticket not found, invalid secret, or not yet resolved." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
