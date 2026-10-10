import { NextRequest, NextResponse } from "next/server";
import { adminUpdateComplaintStatus } from "@/src/lib/complaints-db";
import type { ComplaintStatus } from "@/src/lib/complaints-db";

const VALID_STATUSES: ComplaintStatus[] = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

export async function PATCH(req: NextRequest) {
  try {
    // IMPORTANT: In production, verify admin session here before processing.
    const body = await req.json();
    const { ticketId, newStatus, comment } = body;

    if (!ticketId || typeof ticketId !== "string") {
      return NextResponse.json({ error: "ticketId is required." }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }
    if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
      return NextResponse.json({ error: "A status update comment is required." }, { status: 400 });
    }

    const ok = adminUpdateComplaintStatus(ticketId.trim(), newStatus, comment.trim().slice(0, 500));
    if (!ok) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
