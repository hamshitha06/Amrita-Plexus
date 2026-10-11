import { NextRequest, NextResponse } from "next/server";
import { adminGetAllComplaints } from "@/lib/complaints-db";

function isAuthorizedAdmin(req: NextRequest): boolean {
  // In production, reject unless ENABLE_ADMIN_DEMO is explicitly "true"
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_ADMIN_DEMO !== "true") {
    return false;
  }

  const adminRoleHeader = req.headers.get("x-admin-role");
  const authHeader = req.headers.get("authorization");

  if (adminRoleHeader === "admin" || (authHeader && authHeader.toLowerCase().includes("admin"))) {
    return true;
  }

  // In non-production demo environments, allow preview
  return process.env.NODE_ENV !== "production";
}

export async function GET(req: NextRequest) {
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

  // secretHash is stripped inside adminGetAllComplaints — never exposed
  const complaints = adminGetAllComplaints();
  return NextResponse.json(complaints);
}
