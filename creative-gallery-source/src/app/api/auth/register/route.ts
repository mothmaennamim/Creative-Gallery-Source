import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, publicUser } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const role = body?.role === "seller" ? "seller" : "customer"; // শুধু এই দুটো রোল নেওয়া হবে
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const phone = String(body?.phone ?? "").trim();
  const password = String(body?.password ?? "");
  const shopName = String(body?.shopName ?? "").trim();
  const shopDesc = String(body?.shopDesc ?? "").trim();

  if (!name || !email || !phone) {
    return NextResponse.json({ message: "নাম, ইমেইল ও ফোন দিন" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ message: "সঠিক ইমেইল দিন" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }
  if (role === "seller" && !shopName) {
    return NextResponse.json({ message: "দোকানের নাম দিন" }, { status: 400 });
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "এই ইমেইলে অ্যাকাউন্ট আগেই আছে" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role,
      status: role === "seller" ? "pending" : "active",
      shopName: role === "seller" ? shopName : null,
      shopDesc: role === "seller" ? shopDesc : null,
    },
  });

  if (role === "seller") {
    await db.notification.create({
      data: { text: `নতুন সেলার আবেদন: ${shopName} — যাচাই করুন`, role: "admin" },
    });
    return NextResponse.json({ pending: true, user: publicUser(user) });
  }

  await createSession(user.id);
  return NextResponse.json({ pending: false, user: publicUser(user) });
}