"use client";

import { ShoppingBag, Store, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";

export function Footer() {
  const navigate = useStore((s) => s.navigate);

  return (
    <footer className="mt-auto border-t bg-[#132438] text-blue-50/90">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg">🎨</span>
              <p className="text-lg font-extrabold text-white">ক্রিয়েটিভ গ্যালারি</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/70">
              মাল্টিভেন্ডর ই-কমার্স প্ল্যাটফর্ম — যেখানে সেলাররা নিজের দোকান খুলে পণ্য আপলোড করেন, আর কাস্টমাররা সব পণ্য এক জায়গায় দেখে কেনেন।
            </p>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-white">
              <ShoppingBag className="h-4 w-4 text-orange-400" /> ই-কমার্স
            </p>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-orange-300" onClick={() => navigate("products")}>সব পণ্য</button></li>
              <li><button className="hover:text-orange-300" onClick={() => navigate("cart")}>কার্ট ও চেকআউট</button></li>
              <li><button className="hover:text-orange-300" onClick={() => navigate("orders")}>অর্ডার ট্র্যাকিং</button></li>
              <li><button className="hover:text-orange-300" onClick={() => navigate("auth")}>সেলার হন</button></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-white">
              <Phone className="h-4 w-4 text-orange-400" /> যোগাযোগ
            </p>
            <ul className="space-y-2 text-sm text-blue-100/80">
              <li>📍 রংপুর সিটি, উত্তরবঙ্গ, বাংলাদেশ</li>
              <li>☎ ০১৭১১-০০৯৯৯৯ (সকাল ৯টা – রাত ৯টা)</li>
              <li className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> hello@creativegallery.bd</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-blue-800/40" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-blue-100/60 sm:flex-row">
          <p>© ২০২৬ ক্রিয়েটিভ গ্যালারি — সর্বস্বত্ব সংরক্ষিত</p>
          <p className="flex items-center gap-2">
            <Store className="h-3.5 w-3.5" /> প্রোটোটাইপ সংস্করণ · ডকুমেন্টেশন অনুযায়ী নির্মিত
          </p>
        </div>
      </div>
    </footer>
  );
}
