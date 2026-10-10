import { NextRequest, NextResponse } from "next/server";
import { submitComplaint } from "@/src/lib/complaints-db";
import type { ComplaintCategory } from "@/src/lib/complaints-db";

const VALID_CATEGORIES: ComplaintCategory[] = [
  "Hostel", "Mess and Food", "Infrastructure", "Academics",
  "Transport", "Campus Facilities", "Internet and Technology", "Other",
];
const VALID_TYPES = ["Complaint", "Improvement"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, category, subject, description, evidenceFiles = [] } = body;

    // --- Server-side validation ---
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid submission type." }, { status: 400 });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    if (!subject || typeof subject !== "string" || subject.trim().length < 5) {
      return NextResponse.json({ error: "Subject must be at least 5 characters." }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 20) {
      return NextResponse.json({ error: "Description must be at least 20 characters." }, { status: 400 });
    }
    if (!Array.isArray(evidenceFiles) || evidenceFiles.length > 5) {
      return NextResponse.json({ error: "Too many evidence files." }, { status: 400 });
    }

    const result = submitComplaint(type, category, subject.trim(), description.trim(), evidenceFiles);

    // Return the trackingSecret ONLY here — it is never stored in plain text anywhere else
    return NextResponse.json({ ticketId: result.ticketId, trackingSecret: result.trackingSecret }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
