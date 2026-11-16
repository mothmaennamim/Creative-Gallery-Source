import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, publicUser } from "@/lib/session";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: "আগে লগইন করুন" }, { status: 401 });
  }
  if (user.role !== "customer") {
    return NextResponse.json({ message: "আপনি আগেই সেলার বা অ্যাডমিন" }, { status: 400 });
  }
  if (user.sellerStatus === "pending") {
    return NextResponse.json({ message: "আপনার আবেদন আগেই জমা হয়েছে" }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  const shopName = String(body?.shopName ?? "").trim();
  const shopDesc = String(body?.shopDesc ?? "").trim();
  if (!shopName) {
    return NextResponse.json({ message: "দোকানের নাম দিন" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { shopName, shopDesc, sellerStatus: "pending" },
  });

  await db.notification.create({
    data: { text: `নতুন সেলার আবেদন: ${shopName} — যাচাই করুন`, role: "admin" },
  });

  return NextResponse.json({ user: publicUser(updated) });
}