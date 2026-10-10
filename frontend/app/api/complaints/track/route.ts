import { NextRequest, NextResponse } from "next/server";
import { trackComplaint } from "@/src/lib/complaints-db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get("ticketId")?.trim();
  const secret   = searchParams.get("secret")?.trim();

  if (!ticketId || !secret) {
    return NextResponse.json({ error: "ticketId and secret are required." }, { status: 400 });
  }

  // Rate-limit stub: in production add Redis-based rate limiting here
  const complaint = trackComplaint(ticketId, secret);

  if (!complaint) {
    // Return same error for both "not found" and "wrong secret" to prevent enumeration
    return NextResponse.json({ error: "No ticket found with those credentials." }, { status: 404 });
  }

  // Strip secretHash — NEVER expose it
  const { secretHash: _secretHash, ...safeComplaint } = complaint as any;
  void _secretHash;

  return NextResponse.json(safeComplaint);
}
