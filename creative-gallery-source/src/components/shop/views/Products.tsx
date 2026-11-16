"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES, categoryName } from "@/data/mock";
import { bn } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductsView() {
  const { products, users, searchQuery, setSearch } = useStore();
  const [localQ, setLocalQ] = useState(searchQuery.q);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  const sellers = users.filter((u) => u.role === "seller" && u.status === "active");
  const activeCategory = searchQuery.category;
  const activeSeller = searchQuery.sellerId;

  const setCategory = (id: string | null) => setSearch({ category: id });
  const setSeller = (id: string | null) => setSearch({ sellerId: id });

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === "approved");
    if (searchQuery.q.trim()) {
      const q = searchQuery.q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          categoryName(p.category).toLowerCase().includes(q)
      );
    }
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeSeller) list = list.filter((p) => p.sellerId === activeSeller);
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => b.sales - a.sales);
    }
    return list;
  }, [products, searchQuery, activeCategory, activeSeller, maxPrice, minRating, sort]);

  const FiltersBody = (
    <div className="space-y-5">
      {/* ক্যাটাগরি */}
      <div>
        <p className="mb-2 text-sm font-bold">ক্যাটাগরি</p>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={!activeCategory} onCheckedChange={() => setCategory(null)} />
            সব ক্যাটাগরি
          </label>
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={activeCategory === c.id} onCheckedChange={() => setCategory(activeCategory === c.id ? null : c.id)} />
              {c.emoji} {c.name}
            </label>
          ))}
        </div>
      </div>
      {/* দোকান */}
      <div>
        <p className="mb-2 text-sm font-bold">দোকান ধরে দেখুন</p>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={!activeSeller} onCheckedChange={() => setSeller(null)} />
            সব দোকান
          </label>
          {sellers.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={activeSeller === s.id} onCheckedChange={() => setSeller(activeSeller === s.id ? null : s.id)} />
              🏪 {s.shopName}
            </label>
          ))}
        </div>
      </div>
      {/* দাম */}
      <div>
        <p className="mb-2 text-sm font-bold">সর্বোচ্চ দাম: ৳{bn(maxPrice.toLocaleString("en-IN"))}</p>
        <Slider
          value={[maxPrice]}
          onValueChange={(v) => setMaxPrice(v[0])}
          min={300}
          max={4000}
          step={50}
          aria-label="সর্বোচ্চ দাম"
        />
      </div>
      {/* রেটিং */}
      <div>
        <p className="mb-2 text-sm font-bold">সর্বনিম্ন রেটিং</p>
        <div className="flex gap-1.5">
          {[0, 4, 4.5].map((r) => (
            <Button key={r} size="sm" variant={minRating === r ? "default" : "outline"}
              onClick={() => setMinRating(r)}
              className="h-8 gap-1 text-xs">
              {r === 0 ? "সব" : <>{bn(r)}+ <Star className="h-3 w-3 fill-amber-400 text-amber-400" /></>}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-extrabold md:text-2xl">সব পণ্য</h1>
        <span className="text-sm text-muted-foreground">({bn(filtered.length)}টি পণ্য পাওয়া গেছে)</span>
        <div className="ml-auto flex items-center gap-2">
          {/* মোবাইল ফিল্টার */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> ফিল্টার
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>ফিল্টার</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">{FiltersBody}</div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-[150px] text-sm" aria-label="সাজানো">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">জনপ্রিয়তা অনুযায়ী</SelectItem>
              <SelectItem value="price-asc">কম দাম আগে</SelectItem>
              <SelectItem value="price-desc">বেশি দাম আগে</SelectItem>
              <SelectItem value="rating">রেটিং অনুযায়ী</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* সার্চ বার */}
      <div className="relative mb-5">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch({ q: localQ })}
          placeholder="নাম দিয়ে পণ্য সার্চ করুন…"
          className="pl-9"
          aria-label="পণ্য সার্চ"
        />
        {searchQuery.q && (
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => { setSearch({ q: "" }); setLocalQ(""); }}
            aria-label="সার্চ মুছুন"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* সক্রিয় ফিল্টার চিপ */}
      {(activeCategory || activeSeller) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeCategory && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 rounded-full text-xs" onClick={() => setCategory(null)}>
              {categoryName(activeCategory)} <X className="h-3 w-3" />
            </Button>
          )}
          {activeSeller && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 rounded-full text-xs" onClick={() => setSeller(null)}>
              🏪 {sellers.find((s) => s.id === activeSeller)?.shopName} <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* ডেস্কটপ ফিল্টার */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-4">{FiltersBody}</div>
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-card py-16 text-center">
              <p className="text-4xl">🔍</p>
              <p className="mt-3 font-semibold">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-sm text-muted-foreground">অন্য কিছু লিখে খুঁজুন বা ফিল্টার বদলান</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
