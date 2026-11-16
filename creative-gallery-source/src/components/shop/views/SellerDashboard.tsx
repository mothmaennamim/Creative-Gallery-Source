"use client";

import { useState } from "react";
import {
  TrendingUp, Package, Wallet, Store, Plus, Send, Clock, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  CATEGORIES, categoryName, ORDER_STATUS_LABEL, PAYMENT_LABEL,
  type OrderStatus, type Product, IMG,
} from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

const PRESET_IMAGES = [
  IMG.pottery2, IMG.honey2, IMG.jute2, IMG.jewelry2, IMG.saree1, IMG.bamboo2, IMG.field1, IMG.leather1,
];

const NEXT_STATUS: Partial<Record<OrderStatus, { next: OrderStatus; label: string }>> = {
  confirmed: { next: "processing", label: "প্রস্তুত শুরু করুন" },
  processing: { next: "shipping", label: "ডেলিভারিতে পাঠান" },
  shipping: { next: "delivered", label: "ডেলিভারি সম্পন্ন" },
};

export function SellerDashboardView() {
  const store = useStore();
  const { currentUser, users, products, orders, payouts, openSeller, sellerTab, addProduct, updateOrderStatus, requestPayout, navigate, commissionRate } = store;
  const { toast } = useToast();

  const [dlgOpen, setDlgOpen] = useState(false);
  const [nName, setNName] = useState("");
  const [nDesc, setNDesc] = useState("");
  const [nPrice, setNPrice] = useState("");
  const [nStock, setNStock] = useState("10");
  const [nCat, setNCat] = useState("handicraft");
  const [nImg, setNImg] = useState(PRESET_IMAGES[0]);

  // সেলার না হলে গেট
  if (!currentUser || currentUser.role !== "seller") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-up">
        <p className="text-5xl">🏪</p>
        <h1 className="mt-3 text-xl font-extrabold">সেলার ড্যাশবোর্ড</h1>
        <p className="mt-1 text-sm text-muted-foreground">সেলার অ্যাকাউন্ট দিয়ে লগইন করুন — ডেমো সেলার “করিম হস্তশিল্প” দিয়ে দেখুন।</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => navigate("auth")}>লগইন পেজ</Button>
          {currentUser && <Button variant="outline" onClick={() => { store.logout(); store.login("u2"); navigate("seller"); }}>ডেমো সেলার দিয়ে দেখুন</Button>}
        </div>
      </div>
    );
  }

  const myProducts = products.filter((p) => p.sellerId === currentUser.id);
  const myOrders = orders.filter((o) => o.sellerId === currentUser.id);
  const earned = myOrders.filter((o) => o.status !== "cancelled" && o.status !== "pending").reduce((s, o) => s + o.sellerEarning, 0);
  const pendingPayout = payouts.filter((p) => p.sellerId === currentUser.id && p.status === "অপেক্ষমাণ").reduce((s, p) => s + p.amount, 0);
  const balance = earned - pendingPayout;

  const pendingCount = myProducts.filter((p) => p.status === "pending").length;

  const submitProduct = () => {
    if (!nName.trim() || !nPrice.trim()) {
      toast({ description: "পণ্যের নাম ও দাম দিন", variant: "destructive" });
      return;
    }
    addProduct({
      name: nName, desc: nDesc || "বিবরণ শীঘ্রই যোগ হবে।",
      price: Number(nPrice) || 0, stock: Number(nStock) || 1,
      category: nCat, image: nImg,
    });
    setDlgOpen(false);
    setNName(""); setNDesc(""); setNPrice(""); setNStock("10");
    toast({ description: "পণ্য জমা হয়েছে — অ্যাডমিন রিভিউ করে প্রকাশ করবেন ✅" });
  };

  const statCards = [
    { icon: <TrendingUp className="h-5 w-5" />, label: "মোট বিক্রয় (আয়)", value: tk(earned) },
    { icon: <Package className="h-5 w-5" />, label: "মোট অর্ডার", value: `${bn(myOrders.length)}টি` },
    { icon: <Store className="h-5 w-5" />, label: "আমার পণ্য", value: `${bn(myProducts.length)}টি` },
    { icon: <Wallet className="h-5 w-5" />, label: "পেআউটযোগ্য ব্যালান্স", value: tk(Math.max(0, balance)) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold md:text-2xl">সেলার ড্যাশবোর্ড</h1>
          <p className="text-sm text-muted-foreground">🏪 {currentUser.shopName} · কমিশন হার {bn(commissionRate)}%</p>
        </div>
        <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> নতুন পণ্য আপলোড</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>নতুন পণ্য আপলোড</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1"><Label>পণ্যের নাম</Label><Input value={nName} onChange={(e) => setNName(e.target.value)} placeholder="যেমন: মাটির ফুলের টব" /></div>
              <div className="space-y-1"><Label>বিবরণ</Label><Textarea value={nDesc} onChange={(e) => setNDesc(e.target.value)} placeholder="মাপ, উপাদান, ব্যবহার লিখুন…" rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>দাম (৳)</Label><Input value={nPrice} onChange={(e) => setNPrice(e.target.value)} placeholder="850" inputMode="numeric" /></div>
                <div className="space-y-1"><Label>স্টক</Label><Input value={nStock} onChange={(e) => setNStock(e.target.value)} inputMode="numeric" /></div>
              </div>
              <div className="space-y-1">
                <Label>ক্যাটাগরি</Label>
                <Select value={nCat} onValueChange={setNCat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>পণ্যের ছবি (ডেমো লাইব্রেরি থেকে বেছে নিন)</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setNImg(src)}
                      className={`overflow-hidden rounded-lg border-2 transition-all ${nImg === src ? "border-primary ring-2 ring-primary/30" : "border-transparent"}`}
                    >
                      <img src={src} alt="প্রিসেট" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={submitProduct}><Send className="h-4 w-4" /> অ্যাডমিন রিভিউর জন্য জমা দিন</Button>
              <p className="text-center text-xs text-muted-foreground">অ্যাডমিন অনুমোদন করলে পণ্যটি সাইটে প্রকাশ হবে</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* স্ট্যাট কার্ড */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-primary">{s.icon}</span>
            <p className="mt-2 text-lg font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs value={sellerTab} onValueChange={(v) => openSeller(v as typeof sellerTab)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
          <TabsTrigger value="products">আমার পণ্য ({bn(myProducts.length)}){pendingCount > 0 && ` · ${bn(pendingCount)} অপেক্ষমাণ`}</TabsTrigger>
          <TabsTrigger value="orders">অর্ডার ({bn(myOrders.length)})</TabsTrigger>
          <TabsTrigger value="payout">হিসাব ও পেআউট</TabsTrigger>
        </TabsList>

        {/* ওভারভিউ */}
        <TabsContent value="overview" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="font-bold">📋 আজকের করণীয়</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>• {bn(myOrders.filter((o) => o.status === "confirmed").length)}টি নতুন অর্ডার প্রস্তুত করতে হবে</li>
              <li>• {bn(myOrders.filter((o) => o.status === "processing").length)}টি অর্ডার ডেলিভারিতে পাঠাতে হবে</li>
              <li>• {bn(pendingCount)}টি পণ্য অ্যাডমিন অনুমোদনের অপেক্ষায়</li>
            </ul>
          </div>
          <h2 className="mt-6 mb-3 font-bold">বেশি বিক্রি হওয়া পণ্য</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[...myProducts].sort((a, b) => b.sales - a.sales).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </TabsContent>

        {/* আমার পণ্য */}
        <TabsContent value="products" className="mt-4">
          {myProducts.length === 0 ? (
            <div className="rounded-xl border bg-card py-14 text-center">
              <p className="font-semibold">এখনো কোনো পণ্য নেই</p>
              <Button className="mt-4" onClick={() => setDlgOpen(true)}><Plus className="h-4 w-4" /> প্রথম পণ্য আপলোড করুন</Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="nice-scroll overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">পণ্য</th>
                      <th className="px-4 py-2.5 font-semibold">দাম</th>
                      <th className="px-4 py-2.5 font-semibold">স্টক</th>
                      <th className="px-4 py-2.5 font-semibold">বিক্রি</th>
                      <th className="px-4 py-2.5 font-semibold">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProducts.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <img src={p.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                            <span className="line-clamp-1 max-w-[180px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-semibold">{tk(p.price)}</td>
                        <td className="px-4 py-2.5">{bn(p.stock)}</td>
                        <td className="px-4 py-2.5">{bn(p.sales)}</td>
                        <td className="px-4 py-2.5">
                          {p.status === "approved" && <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">✔ প্রকাশিত</Badge>}
                          {p.status === "pending" && <Badge className="bg-amber-500 text-white hover:bg-amber-500">রিভিউর অপেক্ষায়</Badge>}
                          {p.status === "rejected" && (
                            <span className="text-xs text-destructive">
                              ফেরত পাঠানো হয়েছে{p.rejectReason ? ` — ${p.rejectReason}` : ""}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* অর্ডার */}
        <TabsContent value="orders" className="mt-4">
          {myOrders.length === 0 ? (
            <div className="rounded-xl border bg-card py-14 text-center">
              <p className="font-semibold">এখনো কোনো অর্ডার আসেনি</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((o) => (
                <div key={o.id} className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold">{o.customerName} · <span className="font-mono text-xs">{o.id}</span></p>
                      <p className="text-xs text-muted-foreground">{o.createdAt} · {PAYMENT_LABEL[o.payment]} · {o.phone}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={o.status === "delivered" ? "bg-emerald-600 text-white" : ""}>{ORDER_STATUS_LABEL[o.status]}</Badge>
                      <p className="mt-1 text-sm font-extrabold text-primary">{tk(o.sellerEarning)} <span className="text-xs font-normal text-muted-foreground">(কমিশন {tk(o.commission)} কাটা)</span></p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-2">
                    {o.items.map((it) => (
                      <span key={it.productId} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                        {it.name} × {bn(it.qty)}
                      </span>
                    ))}
                    <span className="ml-auto text-xs text-muted-foreground">📍 {o.address}, {o.area}</span>
                    {NEXT_STATUS[o.status] && (
                      <Button size="sm" className="h-8" onClick={() => { updateOrderStatus(o.id, NEXT_STATUS[o.status]!.next); toast({ description: `স্ট্যাটাস আপডেট: ${ORDER_STATUS_LABEL[NEXT_STATUS[o.status]!.next]}` }); }}>
                        {NEXT_STATUS[o.status]!.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* পেআউট */}
        <TabsContent value="payout" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="font-bold">💰 হিসাব</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">মোট আয় (কমিশন বাদে)</span><span className="font-semibold">{tk(earned)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">পেআউট অনুরোধে আছে</span><span className="font-semibold">− {tk(pendingPayout)}</span></div>
                <div className="flex justify-between border-t pt-2 text-base font-extrabold"><span>পেআউটযোগ্য</span><span className="text-primary">{tk(Math.max(0, balance))}</span></div>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={Math.max(0, balance) <= 0 || pendingPayout > 0}
                onClick={() => { requestPayout(); toast({ description: "পেআউট অনুরোধ পাঠানো হয়েছে — অ্যাডমিন পরিশোধ করবেন 💸" }); }}
              >
                <Wallet className="h-4 w-4" /> পেআউট অনুরোধ করুন
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                প্রতি বিক্রয়ে সাইট {bn(commissionRate)}% কমিশন কাটে — বাকিটা আপনার হিসাবে জমা হয়।
              </p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="font-bold">📜 পেআউট ইতিহাস</p>
              {payouts.filter((p) => p.sellerId === currentUser.id).length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো পেআউট অনুরোধ করা হয়নি।</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {payouts.filter((p) => p.sellerId === currentUser.id).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                      <span>{tk(p.amount)}</span>
                      <span className="flex items-center gap-1 text-xs">
                        {p.status === "অপেক্ষমাণ" ? <><Clock className="h-3.5 w-3.5 text-amber-600" /> {p.status}</> : <><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {p.status}</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">ডেলিভারি সম্পন্ন অর্ডারের টাকাই পেআউটযোগ্য।</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
