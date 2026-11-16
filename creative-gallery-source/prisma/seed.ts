import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from "../src/data/mock";

const db = new PrismaClient();

async function main() {
  // আবার চালালে পুরনো ডেটা মুছে নতুন করে ঢোকাবে
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.payoutRequest.deleteMany();
  await db.product.deleteMany();
  await db.notification.deleteMany();
  await db.user.deleteMany();

  // ডেমো ইউজারদের পাসওয়ার্ড: demo1234
  const passwordHash = await bcrypt.hash("demo1234", 10);

  for (const u of INITIAL_USERS) {
    await db.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        shopName: u.shopName,
        shopDesc: u.shopDesc,
        passwordHash,
      },
    });
  }

  for (const p of INITIAL_PRODUCTS) {
    await db.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.desc,
        price: p.price,
        oldPrice: p.oldPrice,
        stock: p.stock,
        category: p.category,
        image: p.image,
        rating: p.rating,
        status: p.status,
        rejectReason: p.rejectReason,
        sales: p.sales,
        sellerId: p.sellerId,
        reviews: {
          create: p.reviews.map((r) => ({
            userName: r.userName,
            rating: r.rating,
            comment: r.comment,
            verified: r.verified,
          })),
        },
      },
    });
  }

  for (const o of INITIAL_ORDERS) {
    const customer = INITIAL_USERS.find((u) => u.name === o.customerName);
    await db.order.create({
      data: {
        id: o.id,
        groupId: o.groupId,
        customerId: customer?.id ?? null,
        customerName: o.customerName,
        phone: o.phone,
        address: o.address,
        area: o.area,
        payment: o.payment,
        subtotal: o.subtotal,
        delivery: o.delivery,
        total: o.total,
        commission: o.commission,
        sellerEarning: o.sellerEarning,
        status: o.status,
        sellerId: o.sellerId,
        items: {
          create: o.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
        },
      },
    });
  }

  for (const n of INITIAL_NOTIFICATIONS) {
    await db.notification.create({ data: { text: n.text, role: n.role } });
  }

  console.log("সিড সম্পন্ন ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());