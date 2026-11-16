"use client";

import { Minus, Plus, Trash2, ShoppingBag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DELIVERY_FEE } from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CartView() {
  const { cart, products, users, setCartQty, removeFromCart, navigate, currentUser } = useStore();
  const { toast } = useToast();

  const rows = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) }))
    .filter((r): r is typeof r & { product: NonNullable<typeof r.product> } => !!r.product);

  // সেলারভেদে গ্রুপ (এক কার্টে একাধিক সেলার)
  const groups = new Map<string, typeof rows>();
  rows.forEach((r) => {
    const arr = groups.get(r.product.sellerId) ?? [];
    arr.push(r);
    groups.set(r.product.sellerId, arr);
  });

  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const sellerCount = groups.size;

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-up">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-xl font-extrabold">কার্ট এখন খালি</h1>
        <p className="mt-1 text-sm text-muted-foreground">সুন্দর হস্তশিল্পে কার্ট ভরে ফেলুন!</p>
        <Button className="mt-5" onClick={() => navigate("products")}>পণ্য দেখুন</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      <h1 className="mb-1 text-xl font-extrabold md:text-2xl">আমার কার্ট</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        {bn(rows.length)}টি পণ্য · {bn(sellerCount)}টি দোকান থেকে
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[...groups.entries()].map(([sellerId, items]) => {
            const seller = users.find((u) => u.id === sellerId);
            return (
              <div key={sellerId} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between bg-secondary px-4 py-2.5">
                  <p className="text-sm font-bold">🏪 {seller?.shopName ?? "দোকান"}</p>
                  <p className="text-xs text-muted-foreground">{bn(items.length)}টি পণ্য</p>
                </div>
                {items.map((r) => (
                  <div key={r.productId} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
                    <img src={r.product.image} alt={r.product.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <button
                        className="line-clamp-1 text-left text-sm font-semibold hover:text-primary"
                        onClick={() => useStore.getState().openProduct(r.productId)}
                      >
                        {r.product.name}
                      </button>
                      <p className="text-sm font-bold text-primary">{tk(r.product.price)}</p>
                    </div>
                    <div className="flex items-center rounded-lg border">
                      <button className="px-2 py-1.5" onClick={() => setCartQty(r.productId, r.qty - 1)} aria-label="কমান">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{bn(r.qty)}</span>
                      <button className="px-2 py-1.5" onClick={() => setCartQty(r.productId, r.qty + 1)} aria-label="বাড়ান">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      className="p-1.5 text-muted-foreground hover:text-destructive"
                      onClick={() => { removeFromCart(r.productId); toast({ description: "কার্ট থেকে সরানো হয়েছে" }); }}
                      aria-label="সরান"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              একাধিক দোকানের পণ্য একই কার্টে রাখা যায়। চেকআউটে অর্ডারটি <strong>সেলারভেদে আলাদা আলাদা ভাগ</strong> হবে —
              প্রতিটি সেলার নিজের অংশ প্রস্তুত করে পাঠাবেন (ডকুমেন্টেশন অনুযায়ী)।
            </p>
          </div>
        </div>

        {/* সামারি */}
        <div>
          <div className="sticky top-24 rounded-xl border bg-card p-5 shadow-sm">
            <p className="mb-3 font-bold">অর্ডার সারসংক্ষেপ</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">পণ্যের মূল্য</span><span>{tk(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারি ফি (প্রতি অর্ডার)</span><span>{tk(DELIVERY_FEE)} × {bn(sellerCount)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-extrabold">
                <span>সর্বমোট</span>
                <span className="text-primary">{tk(subtotal + DELIVERY_FEE * sellerCount)}</span>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={() => {
                if (!currentUser) {
                  toast({ description: "চেকআউটের জন্য লগইন করুন" });
                  navigate("auth");
                  return;
                }
                navigate("checkout");
              }}
            >
              চেকআউটে যান
            </Button>
            <Button variant="ghost" className="mt-1 w-full" onClick={() => navigate("products")}>
              <ShoppingBag className="h-4 w-4" /> আরও কিছু কিনুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
