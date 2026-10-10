import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const notifications = db.prepare(`
    SELECT * FROM notifications 
    WHERE recipient_id = ? 
    ORDER BY created_at DESC
  `).all(userId);

  const unreadCount = db.prepare(`
    SELECT COUNT(*) as count FROM notifications 
    WHERE recipient_id = ? AND read_status = 0
  `).get(userId) as any;

  return NextResponse.json({
    notifications,
    unreadCount: unreadCount?.count || 0,
  });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  db.prepare("UPDATE notifications SET read_status = 1 WHERE recipient_id = ?").run(userId);

  return NextResponse.json({ success: true });
}
