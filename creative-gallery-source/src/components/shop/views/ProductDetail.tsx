"use client";

import { useState } from "react";
import {
  Star, ShoppingBag, Minus, Plus, Store, ShieldCheck,
  BadgeCheck, Heart, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/shop/ProductCard";
import { categoryName, ORDER_STATUS_LABEL } from "@/data/mock";
import { bn, tk, bnRate } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductDetailView() {
  const { productId, products, users, addToCart, navigate, openProduct, setSearch, currentUser, orders, toggleWishlist, wishlist, addReview } = useStore();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [imgOk, setImgOk] = useState(true);
  const [revRating, setRevRating] = useState("5");
  const [revText, setRevText] = useState("");

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-semibold">পণ্যটি পাওয়া যায়নি</p>
        <Button className="mt-4" onClick={() => navigate("products")}>সব পণ্য দেখুন</Button>
      </div>
    );
  }

  const seller = users.find((u) => u.id === product.sellerId);
  const discounted = !!product.oldPrice && product.oldPrice > product.price;
  const inWish = wishlist.includes(product.id);

  // কিনেছেন কিনা — রিভিউ দেওয়ার শর্ত (যাচাইকৃত ক্রেতা)
  const purchased = currentUser
    ? orders.some(
        (o) =>
          o.customerName === currentUser.name &&
          o.sellerId === product.sellerId &&
          o.items.some((i) => i.productId === product.id) &&
          (o.status === "delivered" || o.status === "shipping" || o.status === "processing" || o.status === "confirmed")
      )
    : false;

  const related = products.filter(
    (p) => p.status === "approved" && p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const buyNow = () => {
    addToCart(product.id, qty);
    navigate("checkout");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      {/* ব্রেডক্রাম্ব */}
      <p className="mb-4 text-sm text-muted-foreground">
        <button className="hover:text-primary" onClick={() => navigate("home")}>হোম</button>
        {" / "}
        <button className="hover:text-primary" onClick={() => { setSearch({ category: product.category, q: "" }); navigate("products"); }}>
          {categoryName(product.category)}
        </button>
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ছবি */}
        <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-50 to-orange-50">
          {imgOk ? (
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" onError={() => setImgOk(false)} />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-7xl">🖼️</div>
          )}
        </div>

        {/* তথ্য */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-900">{categoryName(product.category)}</Badge>
            {product.stock > 0 ? (
              product.stock <= 5
                ? <Badge className="bg-amber-500 text-white hover:bg-amber-500">মাত্র {bn(product.stock)}টি বাকি!</Badge>
                : <Badge variant="secondary">স্টকে আছে ({bn(product.stock)})</Badge>
            ) : (
              <Badge variant="destructive">স্টক শেষ</Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-snug md:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </span>
            <span className="font-semibold">{bnRate(product.rating)}</span>
            <span className="text-muted-foreground">({bn(product.reviews.length)}টি রিভিউ · {bn(product.sales)} বিক্রি)</span>
          </div>

          <div className="mt-3 flex items-end gap-3">
            <p className="text-3xl font-extrabold text-primary">{tk(product.price)}</p>
            {discounted && (
              <>
                <p className="text-lg text-muted-foreground line-through">{tk(product.oldPrice!)}</p>
                <Badge className="bg-rose-600 text-white">
                  {bn(Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100))}% ছাড়
                </Badge>
              </>
            )}
          </div>

          {seller && (
            <div className="mt-4 flex items-center justify-between rounded-xl border bg-card p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">🏪</span>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold">{seller.shopName} <BadgeCheck className="h-4 w-4 text-primary" /></p>
                  <p className="text-xs text-muted-foreground">{seller.shopDesc}</p>
                </div>
              </div>
              <Button
                variant="outline" size="sm"
                onClick={() => { setSearch({ sellerId: seller.id, q: "", category: null }); navigate("products"); }}
              >
                দোকান দেখুন
              </Button>
            </div>
          )}

          {/* কার্ট অ্যাকশন */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border">
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="কমান">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-bold">{bn(qty)}</span>
              <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} aria-label="বাড়ান">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 sm:flex-none"
              disabled={product.stock === 0}
              onClick={() => { addToCart(product.id, qty); toast({ description: "কার্টে যোগ হয়েছে 🛒" }); }}
            >
              <ShoppingBag className="h-4 w-4" /> কার্টে যোগ করুন
            </Button>
            <Button
              variant="secondary"
              disabled={product.stock === 0}
              onClick={buyNow}
            >
              এখনই কিনুন <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="icon"
              className={inWish ? "text-rose-600" : ""}
              onClick={() => { toggleWishlist(product.id); toast({ description: inWish ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যোগ হয়েছে ❤️" }); }}
              aria-label="উইশলিস্ট"
            >
              <Heart className={`h-4 w-4 ${inWish ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> যাচাইকৃত সেলার</span>
            <span className="flex items-center gap-1">🚚 রংপুর সদরে ডেলিভারি {tk(60)}</span>
            <span className="flex items-center gap-1">💳 বিকাশ · নগদ · কার্ড · ক্যাশ অন ডেলিভারি</span>
          </div>
        </div>
      </div>

      {/* বিবরণ ও রিভিউ */}
      <Tabs defaultValue="desc" className="mt-8">
        <TabsList>
          <TabsTrigger value="desc">পণ্যের বিবরণ</TabsTrigger>
          <TabsTrigger value="reviews">রিভিউ ({bn(product.reviews.length)})</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="mt-3">
          <div className="rounded-xl border bg-card p-5 leading-relaxed text-foreground/90">
            {product.desc}
            <p className="mt-3 text-sm text-muted-foreground">
              লক্ষ্য করুন: প্রতিটি পণ্য অ্যাডমিন রিভিউ করে তবেই সাইটে প্রকাশ হয়। পণ্যে সমস্যা থাকলে অ্যাডমিন সেলারের কাছে কারণসহ ফেরত পাঠান।
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-3">
          <div className="space-y-3">
            {product.reviews.length === 0 && (
              <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                এখনো কোনো রিভিউ নেই — কিনে থাকলে প্রথম রিভিউটি আপনিই দিন!
              </p>
            )}
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{r.userName}</p>
                  <span className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </span>
                </div>
                <p className="mt-1.5 text-sm">{r.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.date} {r.verified && "· ✔ যাচাইকৃত ক্রেতা"}
                </p>
              </div>
            ))}

            {/* রিভিউ দেওয়ার ফর্ম */}
            <div className="rounded-xl border bg-card p-4">
              {!currentUser ? (
                <p className="text-sm text-muted-foreground">
                  রিভিউ দিতে <button className="font-semibold text-primary underline" onClick={() => navigate("auth")}>লগইন</button> করুন। মনে রাখবেন — শুধু পণ্য কেনা কাস্টমারই রিভিউ দিতে পারবেন।
                </p>
              ) : purchased ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">আপনার রিভিউ লিখুন (যাচাইকৃত ক্রেতা হিসেবে)</p>
                  <Select value={revRating} onValueChange={setRevRating}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>{bn(r)} স্টার</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea value={revText} onChange={(e) => setRevText(e.target.value)} placeholder="পণ্যটি কেমন লেগেছে?" rows={2} />
                  <Button
                    onClick={() => {
                      if (!revText.trim()) { toast({ description: "রিভিউ লিখুন", variant: "destructive" }); return; }
                      addReview(product.id, Number(revRating), revText.trim());
                      setRevText("");
                      toast({ description: "রিভিউ দেওয়া হয়েছে — ধন্যবাদ! ⭐" });
                    }}
                  >
                    রিভিউ দিন
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  🔒 নিরাপত্তা নোট: পণ্যটি <strong>কেনার পরেই</strong> রিভিউ দেওয়ার অপশন চালু হবে (ভুয়া রিভিউ রোধে ডকুমেন্টেশনের নিয়ম)।
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* সম্পর্কিত পণ্য */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold">একই ক্যাটাগরির পণ্য</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
