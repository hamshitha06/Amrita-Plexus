import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackComplaint } from "@/lib/complaints-db";

const trackQuerySchema = z.object({
  ticketId: z.string().trim().min(5).max(30),
  secret: z.string().trim().min(10).max(64),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get("ticketId")?.trim() || "";
  const secret = searchParams.get("secret")?.trim() || "";

  const parsed = trackQuerySchema.safeParse({ ticketId, secret });
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid ticketId and tracking secret are required." }, { status: 400 });
  }

  const complaint = trackComplaint(parsed.data.ticketId, parsed.data.secret);

  if (!complaint) {
    // Return identical message for nonexistent ID and invalid secret to prevent enumeration attacks
    return NextResponse.json({ error: "No complaint found with the provided credentials." }, { status: 404 });
  }

  // Strip secretHash before returning
  const { secretHash: _hash, ...safeComplaint } = complaint;
  void _hash;

  return NextResponse.json(safeComplaint);
}
