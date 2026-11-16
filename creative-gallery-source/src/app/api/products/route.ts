import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const bn = (s: string) => s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
const day = (d: Date) => bn(d.toISOString().slice(0, 10));

export async function GET() {
  const rows = await db.product.findMany({
    include: { reviews: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  const products = rows.map((p) => ({
    id: p.id,
    name: p.name,
    desc: p.description,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    stock: p.stock,
    category: p.category,
    sellerId: p.sellerId,
    image: p.image,
    rating: p.rating,
    status: p.status,
    rejectReason: p.rejectReason ?? undefined,
    sales: p.sales,
    createdAt: day(p.createdAt),
    reviews: p.reviews.map((r) => ({
      id: r.id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      date: day(r.createdAt),
      verified: r.verified,
    })),
  }));

  return NextResponse.json(products);
}