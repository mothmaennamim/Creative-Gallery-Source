import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, publicUser } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ message: "ইমেইল ও পাসওয়ার্ড দিন" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    return NextResponse.json({ message: "ইমেইল বা পাসওয়ার্ড ভুল" }, { status: 401 });
  }
  if (user.status === "pending") {
    return NextResponse.json({ message: "আপনার অ্যাকাউন্ট এখনো অনুমোদিত হয়নি" }, { status: 403 });
  }
  if (user.status === "blocked") {
    return NextResponse.json({ message: "এই অ্যাকাউন্ট ব্লক করা হয়েছে" }, { status: 403 });
  }

  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) });
}