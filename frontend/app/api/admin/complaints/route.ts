import { NextRequest, NextResponse } from "next/server";
import { adminGetAllComplaints } from "@/src/lib/complaints-db";

// IMPORTANT: In production, protect this endpoint with an admin session check.
// Example: const session = await getServerSession(); if (!session?.user?.isAdmin) return 401;
// This is a demo implementation — no authentication middleware exists yet.

export async function GET(_req: NextRequest) {
  // secretHash is stripped inside adminGetAllComplaints — never exposed
  const complaints = adminGetAllComplaints();
  return NextResponse.json(complaints);
}
