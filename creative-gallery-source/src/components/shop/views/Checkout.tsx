"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DELIVERY_FEE, PAYMENT_LABEL, type PaymentMethod } from "@/data/mock";
import { bn, tk } from "@/lib/format";
import { useStore } from "@/lib/store";

const PAYMENTS: { id: PaymentMethod; label: string; icon: string; note: string }[] = [
  { id: "bkash", label: "বিকাশ", icon: "📲", note: "মোবাইল ব্যাংকিং — ডেমো গেটওয়ে" },
  { id: "nagad", label: "নগদ", icon: "📲", note: "মোবাইল ব্যাংকিং — ডেমো গেটওয়ে" },
  { id: "sslcommerz", label: "SSLCommerz (কার্ড)", icon: "💳", note: "ভিসা/মাস্টারকার্ড — ডেমো গেটওয়ে" },
  { id: "cod", label: "ক্যাশ অন ডেলিভারি", icon: "💵", note: "পণ্য হাতে পেয়ে টাকা দিন" },
];

const AREAS = ["রংপুর সদর", "কোতোয়ালী", "মহিগঞ্জ", "গঙ্গাচড়া", "মিঠাপুকুর", "পীরগঞ্জ", "কাউনিয়া", "জেলার বাইরে"];

export function CheckoutView() {
  const { cart, products, currentUser, placeOrder, navigate } = useStore();
  const { toast } = useToast();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("রংপুর সদর");
  const [payment, setPayment] = useState<PaymentMethod>("bkash");

  const rows = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) }))
    .filter((r): r is typeof r & { product: NonNullable<typeof r.product> } => !!r.product);

  const sellerCount = new Set(rows.map((r) => r.product.sellerId)).size;
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const total = subtotal + DELIVERY_FEE * sellerCount;

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-up">
        <p className="text-lg font-semibold">চেকআউটের জন্য কার্টে পণ্য নেই</p>
        <Button className="mt-4" onClick={() => navigate("products")}>পণ্য দেখুন</Button>
      </div>
    );
  }

  const submit = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast({ description: "নাম, ফোন ও ঠিকানা দিন", variant: "destructive" });
      return;
    }
    if (payment !== "cod") {
      toast({ description: `${PAYMENT_LABEL[payment]} ডেমো গেটওয়ে — পেমেন্ট নিশ্চিত করা হলো ✅` });
    }
    placeOrder({ name, phone, address, area, payment });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-up">
      <h1 className="mb-1 text-xl font-extrabold md:text-2xl">চেকআউট</h1>
      <p className="mb-5 text-sm text-muted-foreground">ডেলিভারি তথ্য ও পেমেন্ট পদ্ধতি বেছে নিন</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* ডেলিভারি তথ্য */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="mb-3 font-bold">📦 ডেলিভারি তথ্য</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>নাম</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" />
              </div>
              <div className="space-y-1">
                <Label>মোবাইল নম্বর</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="০১XXXXXXXXX" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>সম্পূর্ণ ঠিকানা</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="বাড়ি/ফ্ল্যাট, রোড, এলাকা" />
              </div>
              <div className="space-y-1">
                <Label>এলাকা</Label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none"
                  aria-label="এলাকা নির্বাচন"
                >
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* পেমেন্ট */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="mb-3 font-bold">💳 পেমেন্ট পদ্ধতি</p>
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="grid gap-2 sm:grid-cols-2">
              {PAYMENTS.map((p) => (
                <Label
                  key={p.id}
                  htmlFor={`pay-${p.id}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${payment === p.id ? "border-primary bg-blue-50" : "hover:bg-secondary"}`}
                >
                  <RadioGroupItem id={`pay-${p.id}`} value={p.id} className="mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">{p.icon} {p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">
              🔐 পেমেন্ট গেটওয়ে চূড়ান্ত করা হবে উন্নয়নের পরবর্তী ধাপে (SSLCommerz / বিকাশ / নগদ)। কার্ড ও ব্যাংকিং তথ্য সাইটের সার্ভারে রাখা হয় না।
            </p>
          </div>
        </div>

        {/* সামারি */}
        <div>
          <div className="sticky top-24 rounded-xl border bg-card p-5 shadow-sm">
            <p className="mb-3 font-bold">অর্ডার সারসংক্ষেপ</p>
            <div className="nice-scroll mb-3 max-h-56 space-y-2 overflow-y-auto pr-1">
              {rows.map((r) => (
                <div key={r.productId} className="flex items-center gap-2 text-sm">
                  <img src={r.product.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1">{r.product.name}</p>
                    <p className="text-xs text-muted-foreground">{bn(r.qty)} × {tk(r.product.price)}</p>
                  </div>
                  <p className="font-semibold">{tk(r.product.price * r.qty)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">পণ্যের মূল্য</span><span>{tk(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারি ({bn(sellerCount)}টি অর্ডার)</span><span>{tk(DELIVERY_FEE * sellerCount)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-extrabold">
                <span>সর্বমোট</span><span className="text-primary">{tk(total)}</span>
              </div>
            </div>
            <Button size="lg" className="mt-4 w-full" onClick={submit}>
              অর্ডার নিশ্চিত করুন ({tk(total)})
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {sellerCount > 1
                ? `অর্ডারটি ${bn(sellerCount)}টি সেলারে ভাগ হয়ে ${bn(sellerCount)}টি আলাদা অর্ডার হবে`
                : "একটি সেলারের পণ্য — একটি অর্ডার হবে"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
