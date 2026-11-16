"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck, Store, Package, ClipboardList, Users, Percent, ServerCog,
  CheckCircle2, XCircle, Ban, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ROLE_LABEL, ORDER_STATUS_LABEL, PAYMENT_LABEL, categoryName,
} from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

interface SellerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  shopDesc: string;
}

export function AdminPanelView() {
  const store = useStore();
  const { currentUser, users, products, orders, payouts, adminTab, openAdmin, navigate,
    approveProduct, rejectProduct, updateOrderStatus,
    toggleUserBlock, setCommissionRate, markPayoutPaid, commissionRate } = store;
  const { toast } = useToast();

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [newRate, setNewRate] = useState(String(commissionRate));

  const [pendingSellers, setPendingSellers] = useState<SellerRow[]>([]);
  const [activeSellers, setActiveSellers] = useState<SellerRow[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const isSuper = currentUser?.role === "superadmin";

  const loadSellers = async () => {
    try {
      const res = await fetch("/api/admin/sellers");
      if (!res.ok) return;
      const data = await res.json();
      setPendingSellers(data.pending ?? []);
      setActiveSellers(data.active ?? []);
    } catch {
      // নেটওয়ার্ক সমস্যা হলে আগের তালিকাই থাকবে
    }
  };

  useEffect(() => {
    if (isAdmin) loadSellers();
  }, [isAdmin]);

  const actOnSeller = async (s: SellerRow, action: "approve" | "reject") => {
    setBusyId(s.id);
    try {
      const res = await fetch("/api/admin/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ description: data.message ?? "কাজটি করা যায়নি", variant: "destructive" });
      } else {
        await loadSellers();
        toast({
          description: action === "approve"
            ? `${s.shopName} অনুমোদিত — এখন পণ্য আপলোড করতে পারবেন`
            : "আবেদন বাতিল করা হয়েছে",
        });
      }
    } catch {
      toast({ description: "সার্ভারের সাথে যোগাযোগ করা যায়নি", variant: "destructive" });
    }
    setBusyId(null);
  };

  // গেট
  if (!currentUser || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-up">
        <p className="text-5xl">🛡️</p>
        <h1 className="mt-3 text-xl font-extrabold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          এই পেজ শুধু অ্যাডমিনদের জন্য। অনুমোদিত অ্যাকাউন্ট দিয়ে লগইন করুন।
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => navigate("auth")}>লগইন পেজ</Button>
        </div>
      </div>
    );
  }

  const pendingProducts = products.filter((p) => p.status === "pending");
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.commission, 0);
  const pendingPayouts = payouts.filter((p) => p.status === "অপেক্ষমাণ");

  const statCards = [
    { icon: <ClipboardList className="h-5 w-5" />, label: "মোট অর্ডার", value: `${bn(orders.length)}টি` },
    { icon: <Percent className="h-5 w-5" />, label: "কমিশন আয়", value: tk(totalRevenue) },
    { icon: <Store className="h-5 w-5" />, label: "সক্রিয় সেলার", value: `${bn(activeSellers.length)}টি দোকান` },
    { icon: <Package className="h-5 w-5" />, label: "রিভিউর অপেক্ষায়", value: `${bn(pendingProducts.length)}টি পণ্য` },
  ];

  const doRejectProduct = () => {
    if (!rejectId || !rejectReason.trim()) { toast({ description: "কারণ লিখুন", variant: "destructive" }); return; }
    rejectProduct(rejectId, rejectReason.trim());
    setRejectId(null); setRejectReason("");
    toast({ description: "পণ্য কারণসহ সেলারের কাছে ফেরত পাঠানো হয়েছে" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-xl font-extrabold md:text-2xl">
          <ShieldCheck className="h-6 w-6 text-primary" />
          {isSuper ? "সুপার অ্যাডমিন প্যানেল" : "অ্যাডমিন প্যানেল"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentUser.name} · {ROLE_LABEL[currentUser.role]} — {isSuper ? "সাইটের মালিক, সর্বোচ্চ ক্ষমতা" : "দৈনন্দিন ব্যবস্থাপনা"}
        </p>
      </div>

      {/* স্ট্যাট */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-primary">{s.icon}</span>
            <p className="mt-2 text-lg font-extrabold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs value={adminTab} onValueChange={(v) => openAdmin(v as typeof adminTab)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
          <TabsTrigger value="sellers">সেলার অনুমোদন {pendingSellers.length > 0 && `(${bn(pendingSellers.length)})`}</TabsTrigger>
          <TabsTrigger value="products">পণ্য রিভিউ {pendingProducts.length > 0 && `(${bn(pendingProducts.length)})`}</TabsTrigger>
          <TabsTrigger value="orders">অর্ডার</TabsTrigger>
          {isSuper && <TabsTrigger value="users">ইউজার</TabsTrigger>}
          {isSuper && <TabsTrigger value="commission">কমিশন হার</TabsTrigger>}
          <TabsTrigger value="system">সিস্টেম নোট</TabsTrigger>
        </TabsList>

        {/* ===== ওভারভিউ ===== */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="font-bold">⚡ দ্রুত কাজ</p>
              <div className="mt-3 flex flex-col gap-2">
                {pendingSellers.length > 0 && (
                  <Button variant="outline" className="justify-start" onClick={() => openAdmin("sellers")}>
                    {bn(pendingSellers.length)}টি সেলার আবেদন যাচাই করুন
                  </Button>
                )}
                {pendingProducts.length > 0 && (
                  <Button variant="outline" className="justify-start" onClick={() => openAdmin("products")}>
                    {bn(pendingProducts.length)}টি পণ্য রিভিউ করুন
                  </Button>
                )}
                {pendingPayouts.length > 0 && (
                  <Button variant="outline" className="justify-start" onClick={() => openAdmin("orders")}>
                    {bn(pendingPayouts.length)}টি পেআউট অনুরোধ আছে
                  </Button>
                )}
                {pendingSellers.length === 0 && pendingProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground">সব কাজ শেষ — চমৎকার! ✅</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="font-bold">🧾 পেআউট অনুরোধ</p>
              {pendingPayouts.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">কোনো পেআউট অনুরোধ নেই।</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {pendingPayouts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                      <span>🏪 {p.shopName} — <strong>{tk(p.amount)}</strong></span>
                      <Button size="sm" variant="secondary" className="h-7" onClick={() => { markPayoutPaid(p.id); toast({ description: "পেআউট পরিশোধিত হিসেবে চিহ্নিত হয়েছে" }); }}>
                        পরিশোধ করুন
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ===== সেলার অনুমোদন (ডাটাবেস থেকে) ===== */}
        <TabsContent value="sellers" className="mt-4 space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="font-bold">⏳ অপেক্ষমাণ আবেদন</p>
            {pendingSellers.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">কোনো নতুন আবেদন নেই।</p>
            ) : (
              <div className="mt-3 space-y-3">
                {pendingSellers.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                    <div>
                      <p className="font-bold">🏪 {s.shopName}</p>
                      <p className="text-sm text-muted-foreground">{s.name} · {s.phone} · {s.email}</p>
                      <p className="text-sm text-muted-foreground">{s.shopDesc}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={busyId === s.id} onClick={() => actOnSeller(s, "approve")}>
                        <CheckCircle2 className="h-4 w-4" /> অনুমোদন
                      </Button>
                      <Button size="sm" variant="destructive" disabled={busyId === s.id} onClick={() => actOnSeller(s, "reject")}>
                        <XCircle className="h-4 w-4" /> বাতিল
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="font-bold">✅ সক্রিয় সেলার ({bn(activeSellers.length)})</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {activeSellers.map((s) => {
                const count = products.filter((p) => p.sellerId === s.id && p.status === "approved").length;
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                    <span>🏪 {s.shopName}</span>
                    <span className="text-xs text-muted-foreground">{bn(count)}টি পণ্য</span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ===== পণ্য রিভিউ ===== */}
        <TabsContent value="products" className="mt-4">
          {pendingProducts.length === 0 ? (
            <div className="rounded-xl border bg-card py-14 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 font-semibold">সব পণ্য রিভিউ করা হয়েছে!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingProducts.map((p) => {
                const seller = activeSellers.find((u) => u.id === p.sellerId) ?? users.find((u) => u.id === p.sellerId);
                return (
                  <div key={p.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <img src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-1.5 p-4">
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{categoryName(p.category)} · 🏪 {seller?.shopName}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{p.desc}</p>
                      <p className="text-base font-extrabold text-primary">{tk(p.price)}</p>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1" onClick={() => { approveProduct(p.id); toast({ description: "পণ্য প্রকাশিত হয়েছে ✅" }); }}>
                          <CheckCircle2 className="h-4 w-4" /> অনুমোদন
                        </Button>
                        <Dialog open={rejectId === p.id} onOpenChange={(o) => !o && setRejectId(null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => setRejectId(p.id)}>
                              <XCircle className="h-4 w-4" /> ফেরত পাঠান
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ফেরত পাঠানোর কারণ</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                              সমস্যা থাকলে সেলার কারণ জেনে পণ্য ঠিক করে আবার জমা দেবেন।
                            </p>
                            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="যেমন: ছবি পরিষ্কার নয়, দাম বেশি মনে হচ্ছে…" rows={2} />
                            <Button onClick={doRejectProduct}>কারণসহ ফেরত পাঠান</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ===== অর্ডার ===== */}
        <TabsContent value="orders" className="mt-4">
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="nice-scroll overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">অর্ডার</th>
                    <th className="px-4 py-2.5 font-semibold">কাস্টমার</th>
                    <th className="px-4 py-2.5 font-semibold">সেলার</th>
                    <th className="px-4 py-2.5 font-semibold">পেমেন্ট</th>
                    <th className="px-4 py-2.5 font-semibold">টাকা</th>
                    <th className="px-4 py-2.5 font-semibold">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-4 py-2.5 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-2.5">{o.customerName}</td>
                      <td className="px-4 py-2.5">{(activeSellers.find((u) => u.id === o.sellerId) ?? users.find((u) => u.id === o.sellerId))?.shopName}</td>
                      <td className="px-4 py-2.5 text-xs">{PAYMENT_LABEL[o.payment]}</td>
                      <td className="px-4 py-2.5 font-semibold">{tk(o.total)}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{ORDER_STATUS_LABEL[o.status]}</span>
                          {o.status !== "cancelled" && o.status !== "delivered" && (
                            <button
                              className="text-rose-600 hover:underline"
                              title="অর্ডার বাতিল"
                              onClick={() => { updateOrderStatus(o.id, "cancelled"); toast({ description: "অর্ডার বাতিল করা হয়েছে" }); }}
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            অর্ডার পেমেন্ট নিশ্চিত হলে সেলার প্রস্তুত করে ডেলিভারি সম্পন্ন করবেন — প্রতিটি অর্ডার সেলারভেদে আলাদা।
          </p>
        </TabsContent>

        {/* ===== ইউজার (সুপার অ্যাডমিন) ===== */}
        <TabsContent value="users" className="mt-4">
          {!isSuper ? (
            <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
              🔒 শুধু সুপার অ্যাডমিন ইউজার ম্যানেজ করতে পারবেন — অ্যাডমিনের এই অধিকার নেই।
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="nice-scroll overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">নাম</th>
                      <th className="px-4 py-2.5 font-semibold">রোল</th>
                      <th className="px-4 py-2.5 font-semibold">ইমেইল</th>
                      <th className="px-4 py-2.5 font-semibold">স্ট্যাটাস</th>
                      <th className="px-4 py-2.5 font-semibold">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-2.5 font-semibold">{u.shopName ? `🏪 ${u.shopName} (${u.name})` : u.name}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-900">{ROLE_LABEL[u.role]}</Badge>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-2.5">
                          {u.status === "active" && <span className="text-xs font-semibold text-emerald-700">সক্রিয়</span>}
                          {u.status === "pending" && <span className="text-xs font-semibold text-amber-700">অপেক্ষমাণ</span>}
                          {u.status === "blocked" && <span className="text-xs font-semibold text-destructive">ব্লকড</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {u.role !== "superadmin" && (
                            <Button
                              size="sm" variant={u.status === "blocked" ? "outline" : "destructive"}
                              className="h-7 gap-1 text-xs"
                              onClick={() => { toggleUserBlock(u.id); toast({ description: u.status === "blocked" ? "ইউজার আনব্লক করা হয়েছে" : "ইউজার ব্লক করা হয়েছে" }); }}
                            >
                              {u.status === "blocked" ? <><RotateCcw className="h-3 w-3" /> আনব্লক</> : <><Ban className="h-3 w-3" /> ব্লক</>}
                            </Button>
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

        {/* ===== কমিশন (সুপার অ্যাডমিন) ===== */}
        <TabsContent value="commission" className="mt-4">
          {!isSuper ? (
            <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
              🔒 কমিশন হার বদলানোর ক্ষমতা শুধু সুপার অ্যাডমিনের — অ্যাডমিন এটা বদলাতে পারেন না।
            </div>
          ) : (
            <div className="max-w-lg rounded-xl border bg-card p-5 shadow-sm">
              <p className="font-bold">💵 প্ল্যাটফর্ম কমিশন হার</p>
              <p className="mt-1 text-sm text-muted-foreground">
                প্রতি বিক্রয়ের সাবটোটাল থেকে এই হারে কমিশন কাটা হবে, বাকিটা সেলারের হিসাবে জমা হবে।
              </p>
              <div className="mt-4 flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <Label>নতুন হার (%)</Label>
                  <Input value={newRate} onChange={(e) => setNewRate(e.target.value)} inputMode="numeric" />
                </div>
                <Button
                  onClick={() => {
                    const r = Number(newRate);
                    if (!r || r < 1 || r > 30) { toast({ description: "১ থেকে ৩০ এর মধ্যে হার দিন", variant: "destructive" }); return; }
                    setCommissionRate(r);
                    toast({ description: `কমিশন হার ${bn(r)}% সেট হয়েছে` });
                  }}
                >
                  সেট করুন
                </Button>
              </div>
              <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">
                বর্তমান হার: <strong>{bn(commissionRate)}%</strong> — যেমন ৳১,০০০ এর বিক্রয়ে সাইট পাবে {tk(Math.round(1000 * commissionRate / 100))}, সেলার পাবে {tk(1000 - Math.round(1000 * commissionRate / 100))}।
              </p>
            </div>
          )}
        </TabsContent>

        {/* ===== সিস্টেম নোট ===== */}
        <TabsContent value="system" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: "🔐", title: "২-ধাপের লগইন (2FA)", desc: "সুপার অ্যাডমিন ও অ্যাডমিন অ্যাকাউন্টে 2FA চালু করা হবে — অ্যাকাউন্ট দখল হলে পুরো সাইট ঝুঁকিতে পড়ে।" },
              { icon: "☁️", title: "Cloudflare প্রক্সি", desc: "অ্যাডমিন সাবডোমেইনসহ পুরো সাইট Cloudflare দিয়ে ঢাকা থাকবে, যাতে সার্ভারের আসল IP লুকানো থাকে।" },
              { icon: "💾", title: "ডেটা ব্যাকআপ", desc: "অর্ডার ও পেমেন্টের রেকর্ড হারালে ফেরানো যায় না — নিয়মিত স্বয়ংক্রিয় ব্যাকআপ নেওয়া হবে।" },
              { icon: "🗂️", title: "পেজিনেশন", desc: "পণ্য ২০টি করে পাতাভাগ করে লোড হবে — সেলার ও পণ্য বাড়লেও সাইট দ্রুত থাকবে।" },
              { icon: "🖼️", title: "ছবি WebP + ULID", desc: "আপলোডের সময় ছবি WebP-তে রূপান্তর হয়ে ULID নামে জমা হবে — একই নামে ছবি ঘুরিয়ে দেওয়া যাবে না।" },
              { icon: "🔔", title: "নোটিফিকেশন", desc: "নতুন অর্ডার, পণ্য অনুমোদন, পেমেন্ট ও ডেলিভারির খবর ইমেইল/এসএমএসে যাবে — নিবাচন সিস্টেম বাকি।" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border bg-card p-5 shadow-sm">
                <p className="font-bold">{c.icon} {c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}