import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitComplaint } from "@/lib/complaints-db";

const submitComplaintSchema = z.object({
  type: z.enum(["Complaint", "Improvement"]),
  category: z.enum([
    "Hostel",
    "Mess and Food",
    "Infrastructure",
    "Academics",
    "Transport",
    "Campus Facilities",
    "Internet and Technology",
    "Other",
  ]),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters.").max(120, "Subject exceeds 120 characters."),
  description: z.string().trim().min(20, "Description must be at least 20 characters.").max(3000, "Description exceeds 3000 characters."),
  evidenceFiles: z.array(z.string().max(255)).max(5, "Maximum 5 evidence attachments allowed.").default([]),
  requesterId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check payload size limit (max 50kb for JSON text)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 50 * 1024) {
      return NextResponse.json({ error: "Payload too large. Maximum size is 50KB." }, { status: 413 });
    }

    const json = await req.json();
    const parsed = submitComplaintSchema.safeParse(json);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid submission parameters.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { type, category, subject, description, evidenceFiles, requesterId } = parsed.data;
    const result = submitComplaint(type, category, subject, description, evidenceFiles, requesterId);

    // Return the trackingSecret ONLY once upon creation — it is never stored in plaintext
    return NextResponse.json(
      {
        ticketId: result.ticketId,
        trackingSecret: result.trackingSecret,
        message: "Ticket created. Save your tracking secret securely.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
