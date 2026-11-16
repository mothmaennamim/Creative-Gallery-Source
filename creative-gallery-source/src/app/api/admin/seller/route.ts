import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null;
  return user;
}

const pick = (u: {
  id: string; name: string; email: string; phone: string;
  shopName: string | null; shopDesc: string | null;
}) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  shopName: u.shopName ?? "",
  shopDesc: u.shopDesc ?? "",
});

// অপেক্ষমাণ আবেদন ও সক্রিয় সেলারের তালিকা
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "অনুমতি নেই" }, { status: 403 });

  const pending = await db.user.findMany({
    where: {
      OR: [
        { role: "seller", status: "pending" },
        { role: "customer", sellerStatus: "pending" },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  const active = await db.user.findMany({
    where: { role: "seller", status: "active" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ pending: pending.map(pick), active: active.map(pick) });
}

// অনুমোদন বা বাতিল
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "অনুমতি নেই" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const action = String(body?.action ?? "");
  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ message: "ভুল অনুরোধ" }, { status: 400 });
  }

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ message: "ইউজার পাওয়া যায়নি" }, { status: 404 });

  const isPending =
    (target.role === "seller" && target.status === "pending") ||
    (target.role === "customer" && target.sellerStatus === "pending");
  if (!isPending) {
    return NextResponse.json({ message: "এটা অপেক্ষমাণ আবেদন নয়" }, { status: 400 });
  }

  if (action === "approve") {
    await db.user.update({
      where: { id },
      data: { role: "seller", status: "active", sellerStatus: null },
    });
  } else if (target.role === "seller") {
    // সরাসরি সেলার হিসেবে রেজিস্টার করা পেন্ডিং অ্যাকাউন্ট: কিছু জমেনি, তাই মুছে ফেলা নিরাপদ
    await db.user.delete({ where: { id } });
  } else {
    // কাস্টমার অ্যাকাউন্ট থেকে আবেদন: অ্যাকাউন্ট থাকবে, আবেদন বাতিল হবে
    await db.user.update({ where: { id }, data: { sellerStatus: "rejected" } });
  }

  return NextResponse.json({ ok: true });
}