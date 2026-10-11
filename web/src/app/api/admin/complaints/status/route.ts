import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminUpdateComplaintStatus } from "@/lib/complaints-db";
import type { ComplaintStatus } from "@/lib/complaints-db";

const updateStatusSchema = z.object({
  ticketId: z.string().trim().min(5, "ticketId is required").max(30),
  newStatus: z.enum(["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"] as const),
  comment: z.string().trim().min(3, "A status update comment of at least 3 characters is required.").max(500),
});

function isAuthorizedAdmin(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_ADMIN_DEMO !== "true") {
    return false;
  }

  const adminRoleHeader = req.headers.get("x-admin-role");
  const authHeader = req.headers.get("authorization");

  if (adminRoleHeader === "admin" || (authHeader && authHeader.toLowerCase().includes("admin"))) {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

export async function PATCH(req: NextRequest) {
  // Production safeguard
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_ADMIN_DEMO !== "true") {
    return NextResponse.json(
      { error: "Admin endpoints are disabled in production until central authentication is integrated." },
      { status: 403 }
    );
  }

  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    // 10KB payload limit
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024) {
      return NextResponse.json({ error: "Payload too large. Maximum size is 10KB." }, { status: 413 });
    }

    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid status update payload.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { ticketId, newStatus, comment } = parsed.data;
    const ok = adminUpdateComplaintStatus(ticketId, newStatus as ComplaintStatus, comment);

    if (!ok) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Status updated successfully." });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
