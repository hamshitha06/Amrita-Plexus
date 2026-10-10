import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("carpool_user_id")?.value || "user_rahul";

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  const allUsers = db.prepare("SELECT * FROM users").all();

  return NextResponse.json({
    currentUser: user || allUsers[0],
    availableUsers: allUsers,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = body;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set("carpool_user_id", userId, { path: "/" });

  return NextResponse.json({ success: true, user });
}
