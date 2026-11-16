"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatMsg {
  from: "bot" | "me";
  text: string;
}

const WHATSAPP_URL = "https://wa.me/8801711009999?text=" +
  encodeURIComponent("আসসালামু আলাইকুম! ক্রিয়েটিভ গ্যালারি সম্পর্কে জানতে চাই।");

function botReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("অর্ডার") || t.includes("ডেলিভারি") || t.includes("কুরিয়ার"))
    return "অর্ডার ট্র্যাক করতে 'আমার অর্ডার' পেজে যান। রংপুর সদরে ডেলিভারি ৬০৳, সাধারণত ২–৩ দিন লাগে। 🚚";
  if (t.includes("পেমেন্ট") || t.includes("বিকাশ") || t.includes("নগদ") || t.includes("কার্ড"))
    return "আমরা বিকাশ, নগদ, SSLCommerz (কার্ড) ও ক্যাশ অন ডেলিভারি সাপোর্ট করি। পেমেন্ট গেটওয়ে চূড়ান্ত করা হবে শীঘ্রই। 💳";
  if (t.includes("সেলার") || t.includes("দোকান") || t.includes("বিক্রি"))
    return "সেলার হতে 'লগইন/রেজিস্ট্রেশন' → রেজিস্ট্রেশন → 'সেলার' বেছে নিন। অ্যাডমিন অনুমোদনের পর পণ্য আপলোড করা যাবে। 🏪";
  if (t.includes("কমিশন"))
    return "প্রতি বিক্রয়ে সাইট নির্দিষ্ট কমিশন কাটে (এখন ১০%), বাকিটা সেলারের হিসাবে জমা হয়। সেলার পেআউট অনুরোধ করতে পারেন। 💰";
  if (t.includes("রিভিউ") || t.includes("রেটিং"))
    return "যে কাস্টমার পণ্য কিনেছেন, শুধু তিনিই রিভিউ দিতে পারবেন — ভুয়া রিভিউ রোধে এটা জরুরি। ⭐";
  return "ধন্যবাদ আপনার বার্তার জন্য! 🙏 জরুরি প্রয়োজনে কল করুন ০১৭১১-০০৯৯৯৯ (সকাল ৯টা–রাত ৯টা) অথবা হোয়াটসঅ্যাপ বাটনে চাপুন।";
}

export function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "bot", text: "আসসালামু আলাইকুম! 👋 আমি ক্রিয়েটিভ গ্যালারির চ্যাট সহকারী। অর্ডার, পেমেন্ট বা সেলার হওয়া নিয়ে জিজ্ঞেস করুন।" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: botReply(text) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      {/* চ্যাট উইন্ডো */}
      {open && (
        <div className="fixed right-4 bottom-36 z-50 flex h-[26rem] w-[calc(100vw-2rem)] max-w-sm animate-fade-up flex-col overflow-hidden rounded-xl border bg-card shadow-2xl sm:right-5 sm:bottom-40">
          <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <Bot className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">চ্যাটবট — ক্রিয়েটিভ গ্যালারি</p>
              <p className="text-xs text-blue-100">সাধারণত সাথে সাথে উত্তর দেয়</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="চ্যাট বন্ধ করুন">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div ref={scrollRef} className="nice-scroll flex-1 space-y-2 overflow-y-auto bg-blue-50/40 p-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                  m.from === "bot" ? "bg-white text-foreground shadow-sm" : "ml-auto bg-primary text-primary-foreground"
                )}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="w-16 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">লিখছে…</div>
            )}
          </div>
          <div className="flex gap-2 border-t p-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="বার্তা লিখুন…"
              className="h-9 text-sm"
              aria-label="চ্যাট বার্তা"
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={send} aria-label="পাঠান">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ফ্লোটিং বাটন */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 sm:right-5 sm:bottom-5">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          title="হোয়াটসঅ্যাপ"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="চ্যাটবট খুলুন"
          title="চ্যাটবট"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}
