"use client";

import { useState } from "react";
import { Package, Heart, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/shop/ProductCard";
import { ORDER_STATUS_LABEL, PAYMENT_LABEL, type OrderStatus } from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

const TIMELINE: OrderStatus[] = ["pending", "confirmed", "processing", "shipping", "delivered"];

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    processing: "bg-sky-100 text-sky-800",
    shipping: "bg-violet-100 text-violet-800",
    delivered: "bg-emerald-600 text-white",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>{ORDER_STATUS_LABEL[status]}</span>;
}

export function SuccessView() {
  const { lastOrderIds, orders, navigate } = useStore();
  const { toast } = useToast();
  const myOrders = orders.filter((o) => lastOrderIds.includes(o.id));
  const grandTotal = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center animate-fade-up">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-11 w-11 text-primary" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold">অর্ডার সফল হয়েছে! 🎉</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ধন্যবাদ! আপনার অর্ডার {bn(myOrders.length)}টি সেলারের কাছে পাঠানো হয়েছে — এখন প্রতিটি সেলার নিজের অংশ প্রস্তুত করবেন।
        ইমেইল/এসএমএসে খবর পাবেন (নোটিফিকেশন সিস্টেম ডেমো)।
      </p>
      <div className="mt-5 space-y-2 rounded-xl border bg-card p-4 text-left shadow-sm">
        {myOrders.map((o) => (
          <div key={o.id} className="flex items-center justify-between border-b pb-2 text-sm last:border-0 last:pb-0">
            <span className="font-mono">{o.id}</span>
            <span className="text-muted-foreground">{PAYMENT_LABEL[o.payment]}</span>
            <span className="font-bold">{tk(o.total)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-1 text-sm font-extrabold">
          <span>সর্বমোট</span><span className="text-primary">{tk(grandTotal)}</span>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <Button onClick={() => navigate("orders")}><Package className="h-4 w-4" /> অর্ডার ট্র্যাক করুন</Button>
        <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(myOrders.map((o) => o.id).join(", ")); toast({ description: "অর্ডার নম্বর কপি হয়েছে" }); }}>
          <Copy className="h-4 w-4" /> নম্বর কপি
        </Button>
        <Button variant="ghost" onClick={() => navigate("home")}>হোমে যান</Button>
      </div>
    </div>
  );
}

export function OrdersView() {
  const { orders, currentUser, products, wishlist, navigate } = useStore();
  const [tab, setTab] = useState("orders");

  const wishProducts = products.filter((p) => wishlist.includes(p.id) && p.status === "approved");
  const myOrders = currentUser
    ? orders.filter((o) => o.customerName === currentUser.name)
    : orders.slice(0, 4); // লগইন ছাড়া ডেমো

  const wishList = (
    <TabsContent value="wishlist" className="mt-4">
      {wishProducts.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">উইশলিস্ট খালি</p>
          <p className="text-sm text-muted-foreground">পছন্দের পণ্যে ❤️ চাপুন</p>
          <Button className="mt-4" onClick={() => navigate("products")}>পণ্য দেখুন</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {wishProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </TabsContent>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 animate-fade-up">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-extrabold md:text-2xl">আমার অ্যাকাউন্ট</h1>
        </div>
        <TabsList>
          <TabsTrigger value="orders" className="gap-1"><Package className="h-4 w-4" /> অর্ডার ({bn(myOrders.length)})</TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-1"><Heart className="h-4 w-4" /> উইশলিস্ট ({bn(wishProducts.length)})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          {!currentUser && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              ডেমো অর্ডার দেখানো হচ্ছে — নিজের অর্ডার দেখতে <button className="font-bold underline" onClick={() => navigate("auth")}>লগইন</button> করুন।
            </div>
          )}
          {myOrders.length === 0 ? (
            <div className="rounded-xl border bg-card py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">কোনো অর্ডার নেই</p>
              <Button className="mt-4" onClick={() => navigate("products")}>প্রথম অর্ডার করুন</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((o) => {
                const stageIdx = TIMELINE.indexOf(o.status);
                return (
                  <div key={o.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold">অর্ডার <span className="font-mono">{o.id}</span></p>
                        <p className="text-xs text-muted-foreground">{o.createdAt} · {PAYMENT_LABEL[o.payment]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={o.status} />
                        <span className="text-base font-extrabold text-primary">{tk(o.total)}</span>
                      </div>
                    </div>

                    {/* স্ট্যাটাস টাইমলাইন */}
                    {o.status !== "cancelled" && (
                      <div className="mt-3 flex items-center">
                        {TIMELINE.map((s, i) => (
                          <div key={s} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center">
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i <= stageIdx ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                {bn(i + 1)}
                              </span>
                              <span className={`mt-1 hidden text-[10px] sm:block ${i <= stageIdx ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                                {ORDER_STATUS_LABEL[s]}
                              </span>
                            </div>
                            {i < TIMELINE.length - 1 && (
                              <div className={`mx-1 h-0.5 flex-1 ${i < stageIdx ? "bg-primary" : "bg-muted"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 space-y-2 border-t pt-3">
                      {o.items.map((it) => (
                        <div key={it.productId} className="flex items-center gap-3">
                          <img src={it.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <button className="line-clamp-1 text-left text-sm font-medium hover:text-primary" onClick={() => useStore.getState().openProduct(it.productId)}>
                              {it.name}
                            </button>
                            <p className="text-xs text-muted-foreground">{bn(it.qty)} × {tk(it.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      ঠিকানা: {o.address}, {o.area} · ডেলিভারি ফি {tk(o.delivery)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        {wishList}
      </Tabs>
    </div>
  );
}
