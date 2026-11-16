"use client";

import { useState } from "react";
import { Search, ShieldCheck, Truck, CreditCard, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES, IMG } from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

export function HomeView() {
  const { navigate, products, setSearch, users } = useStore();
  const [q, setQ] = useState("");

  const approved = products.filter((p) => p.status === "approved");
  const activeShopCount = users.filter((u) => u.role === "seller" && u.status === "active").length;
  const featuredIds = ["p1", "p5", "p6", "p8", "p10", "p13", "p2", "p16"];
  const featured = featuredIds
    .map((id) => approved.find((p) => p.id === id))
    .filter((p): p is (typeof approved)[number] => !!p);

  const features = [
    { icon: <ShieldCheck className="h-6 w-6" />, title: "যাচাইকৃত সেলার", desc: "অ্যাডমিন অনুমোদন ছাড়া কোনো দোকান বা পণ্য সাইটে আসে না" },
    { icon: <CreditCard className="h-6 w-6" />, title: "নিরাপদ পেমেন্ট", desc: "বিকাশ, নগদ, কার্ড বা হাতে হাতে — যেভাবে খুশি পরিশোধ" },
    { icon: <Truck className="h-6 w-6" />, title: "দ্রুত ডেলিভারি", desc: "রংপুর সদরে ৬০৳ — সাধারণত ২–৩ দিনে পণ্য হাতে" },
    { icon: <Star className="h-6 w-6" />, title: "আসল রিভিউ", desc: "পণ্য কেনা কাস্টমারই কেবল রিভিউ ও রেটিং দিতে পারেন" },
  ];

  return (
    <div className="animate-fade-up">
      {/* ===== হিরো ===== */}
      <section className="hero-navy relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <Badge className="mb-3 bg-orange-600 text-white hover:bg-orange-500">🌟 উত্তরবঙ্গের প্রথম সৃজনশীল বাজার</Badge>
            <h1 className="text-3xl leading-tight font-extrabold md:text-5xl">
              সৃজনশীল পণ্যের <span className="text-orange-300">অনলাইন বাজার</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-50/90 md:text-base">
              হস্তশিল্প, নকশি কাঁথা, শিল্পকলা, খাঁটি মধু — যাচাইকৃত সেলারদের কাছ থেকে কিনুন, ঘরে বসেই।
            </p>
            <div className="mt-5 flex max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { setSearch({ q, sellerId: null }); navigate("products"); }
                  }}
                  placeholder="যেমন: নকশি কাঁথা, মধু, শাড়ি…"
                  className="h-11 border-0 bg-white pl-9 text-foreground"
                  aria-label="পণ্য সার্চ"
                />
              </div>
              <Button
                size="lg"
                className="h-11 bg-orange-600 text-white hover:bg-orange-500"
                onClick={() => { setSearch({ q, sellerId: null }); navigate("products"); }}
              >
                খুঁজুন
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => navigate("products")}>
                পণ্য দেখুন <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => navigate("auth")}>
                সেলার হন 🏪
              </Button>
            </div>
            <div className="mt-6 flex gap-6 text-sm">
              <div><p className="text-xl font-extrabold text-orange-300">{bn(approved.length)}+</p><p className="text-blue-50/80">পণ্য</p></div>
              <div><p className="text-xl font-extrabold text-orange-300">{bn(activeShopCount)}</p><p className="text-blue-50/80">যাচাইকৃত দোকান</p></div>
              <div><p className="text-xl font-extrabold text-orange-300">{bn(1200)}+</p><p className="text-blue-50/80">সন্তুষ্ট কাস্টমার</p></div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="animate-floaty overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl">
              <img src={IMG.hero} alt="কারিগরদের হস্তশিল্প তৈরির দৃশ্য" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white p-3 text-foreground shadow-xl">
              <p className="text-xs text-muted-foreground">আজকের সেরা ডিল</p>
              <p className="text-sm font-bold">নকশি কাঁথা {tk(1850)}</p>
            </div>
            <div className="absolute -top-3 -right-3 rounded-xl bg-orange-500 px-3 py-2 text-white shadow-xl">
              <p className="text-xs font-bold">🚚 ফ্রি ডেলিভারি ফি রংপুর সদরে</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ক্যাটাগরি ===== */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">পণ্যের ক্যাটাগরি</h2>
            <p className="text-sm text-muted-foreground">পছন্দের ক্যাটাগরি বেছে সরাসরি পণ্যে যান</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSearch({ category: c.id, sellerId: null, q: "" }); navigate("products"); }}
              className="group flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl transition-transform group-hover:scale-110">
                {c.emoji}
              </span>
              <span className="text-center text-xs font-medium leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== ফিচার্ড পণ্য ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">🔥 জনপ্রিয় পণ্য</h2>
            <p className="text-sm text-muted-foreground">কাস্টমারদের সবচেয়ে পছন্দের হস্তশিল্প</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setSearch({ q: "", category: null, sellerId: null }); navigate("products"); }}>
            সব দেখুন <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {featured.filter(Boolean).slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ===== কেন আমরা ===== */}
      <section className="bg-secondary py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-xl font-extrabold md:text-2xl">কেন ক্রিয়েটিভ গ্যালারি?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl bg-card p-5 shadow-sm">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-primary">{f.icon}</span>
                <p className="font-bold">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== সেলার CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="band-rust rounded-2xl px-6 py-10 text-center text-orange-50">
          <h2 className="text-2xl font-extrabold md:text-3xl">আপনার দোকান খুলুন ক্রিয়েটিভ গ্যালারিতে 🏪</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-orange-50/90">
            বিনামূল্যে রেজিস্ট্রেশন → অ্যাডমিন অনুমোদন → পণ্য আপলোড → বিক্রয় শুরু।
            প্রতি বিক্রয়ে ন্যূনতম কমিশন, বাকিটা সরাসরি আপনার হিসাবে।
          </p>
          <Button size="lg" className="mt-5 bg-white text-orange-800 hover:bg-orange-50" onClick={() => navigate("auth")}>
            সেলার রেজিস্ট্রেশন করুন <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
