import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitFeedback } from "@/lib/complaints-db";

const feedbackSchema = z.object({
  ticketId: z.string().trim().min(5).max(30),
  trackingSecret: z.string().trim().min(10).max(64),
  rating: z.number().int().min(1).max(5),
  feedbackComment: z.string().trim().max(500).default(""),
});

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024) {
      return NextResponse.json({ error: "Payload too large. Maximum size is 10KB." }, { status: 413 });
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid feedback payload.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { ticketId, trackingSecret, rating, feedbackComment } = parsed.data;
    const ok = submitFeedback(ticketId, trackingSecret, rating, feedbackComment);

    if (!ok) {
      return NextResponse.json({ error: "Ticket not found, invalid secret, or not yet resolved." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Feedback submitted successfully." });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
