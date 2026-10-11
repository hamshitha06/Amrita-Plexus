import { NextRequest, NextResponse } from "next/server";
import { getStudentTicketsAsync } from "@/lib/complaints-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requesterId = searchParams.get("requesterId") || "";

    const tickets = await getStudentTicketsAsync(requesterId);
    return NextResponse.json({ data: tickets });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve student tickets." }, { status: 500 });
  }
}
