"use client";

import { useState } from "react";
import { LogIn, UserPlus, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ROLE_LABEL } from "@/data/mock";
import { useStore } from "@/lib/store";

export function AuthView() {
  const { login, registerCustomer, registerSeller, applySeller, navigate, openSeller, openAdmin, currentUser, logout } = useStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [regRole, setRegRole] = useState<"customer" | "seller">("customer");
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rPass, setRPass] = useState("");
  const [rShop, setRShop] = useState("");
  const [rShopDesc, setRShopDesc] = useState("");
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  const [applyOpen, setApplyOpen] = useState(false);
  const [aShop, setAShop] = useState("");
  const [aDesc, setADesc] = useState("");

  const doApply = async () => {
    if (!aShop.trim()) {
      toast({ description: "দোকানের নাম দিন", variant: "destructive" });
      return;
    }
    setLoading(true);
    const r = await applySeller(aShop.trim(), aDesc.trim());
    setLoading(false);
    if (!r.ok) {
      toast({ description: r.message ?? "আবেদন করা যায়নি", variant: "destructive" });
      return;
    }
    setApplyOpen(false);
    toast({ description: "আবেদন জমা হয়েছে — অনুমোদনের পর সেলার হতে পারবেন ✅" });
  };

  if (currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-up">
        <p className="text-4xl">👋</p>
        <h1 className="mt-3 text-xl font-extrabold">আপনি লগইন করা আছেন</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentUser.name} — <Badge variant="secondary" className="bg-blue-100 text-blue-900">{ROLE_LABEL[currentUser.role]}</Badge>
        </p>
        <div className="mt-5 flex justify-center gap-2">
          {currentUser.role === "seller" && <Button onClick={() => openSeller("overview")}>সেলার ড্যাশবোর্ড</Button>}
          {(currentUser.role === "admin" || currentUser.role === "superadmin") && <Button onClick={() => openAdmin("overview")}>অ্যাডমিন প্যানেল</Button>}
          {currentUser.role === "customer" && <Button onClick={() => navigate("products")}>কেনাকাটা শুরু করুন</Button>}
          <Button variant="outline" onClick={() => logout()}>লগআউট</Button>
        </div>

        {currentUser.role === "customer" && currentUser.sellerStatus === "pending" && (
          <div className="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-left text-xs text-amber-900">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <p>আপনার সেলার আবেদন যাচাইয়ের অপেক্ষায় আছে। অনুমোদনের পর সেলার ড্যাশবোর্ড পাবেন।</p>
          </div>
        )}

        {currentUser.role === "customer" && currentUser.sellerStatus !== "pending" && (
          <div className="mt-6 text-left">
            {!applyOpen ? (
              <button type="button" onClick={() => setApplyOpen(true)} className="w-full text-center text-xs text-muted-foreground underline">
                দোকান খুলে বিক্রি করতে চান? সেলার হিসেবে আবেদন করুন
              </button>
            ) : (
              <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                <div className="space-y-1"><Label>দোকানের নাম</Label><Input value={aShop} onChange={(e) => setAShop(e.target.value)} placeholder="যেমন: রংপুর ক্রাফট হাউস" /></div>
                <div className="space-y-1"><Label>দোকানের সংক্ষিপ্ত পরিচয়</Label><Textarea value={aDesc} onChange={(e) => setADesc(e.target.value)} placeholder="কী ধরনের পণ্য বিক্রি করবেন?" rows={2} /></div>
                <div className="flex gap-2">
                  <Button className="flex-1" disabled={loading} onClick={doApply}>{loading ? "অপেক্ষা করুন..." : "আবেদন পাঠান"}</Button>
                  <Button variant="outline" onClick={() => setApplyOpen(false)}>বাতিল</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const doLogin = async (email: string, password: string) => {
    if (!email.trim() || !password) {
      toast({ description: "ইমেইল ও পাসওয়ার্ড দিন", variant: "destructive" });
      return;
    }
    setLoading(true);
    const r = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (!r.ok || !r.user) {
      toast({ description: r.message ?? "লগইন করা যায়নি", variant: "destructive" });
      return;
    }
    toast({ description: `স্বাগতম, ${r.user.name}! 🎉` });
    if (r.user.role === "seller") navigate("seller");
    else if (r.user.role === "admin" || r.user.role === "superadmin") navigate("admin");
    else navigate("home");
  };

  const doRegister = async () => {
    if (!rName.trim() || !rEmail.trim() || !rPhone.trim()) {
      toast({ description: "নাম, ইমেইল ও ফোন দিন", variant: "destructive" });
      return;
    }
    if (rPass.length < 6) {
      toast({ description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন", variant: "destructive" });
      return;
    }
    if (regRole === "seller" && !rShop.trim()) {
      toast({ description: "দোকানের নাম দিন", variant: "destructive" });
      return;
    }
    setLoading(true);
    const email = rEmail.trim().toLowerCase();
    const r = regRole === "customer"
      ? await registerCustomer(rName.trim(), email, rPhone.trim(), rPass)
      : await registerSeller(rName.trim(), email, rPhone.trim(), rPass, rShop.trim(), rShopDesc.trim());
    setLoading(false);
    if (!r.ok) {
      toast({ description: r.message ?? "রেজিস্ট্রেশন করা যায়নি", variant: "destructive" });
      return;
    }
    if (regRole === "customer") {
      toast({ description: "অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম 🎉" });
    } else {
      toast({ description: "আবেদন জমা হয়েছে — অনুমোদনের পর পণ্য আপলোড করতে পারবেন ✅" });
    }
    navigate("home");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-up">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-extrabold md:text-2xl">লগইন / রেজিস্ট্রেশন</h1>
      </div>

      <Tabs defaultValue="login">
        <TabsList className="mx-auto flex w-fit">
          <TabsTrigger value="login" className="gap-1"><LogIn className="h-4 w-4" /> লগইন</TabsTrigger>
          <TabsTrigger value="register" className="gap-1"><UserPlus className="h-4 w-4" /> রেজিস্ট্রেশন</TabsTrigger>
        </TabsList>

        {/* ===== লগইন ===== */}
        <TabsContent value="login" className="mt-6">
          <div className="mx-auto max-w-sm space-y-3">
            <p className="text-sm font-bold">ইমেইল দিয়ে লগইন</p>
            <Input value={lEmail} onChange={(e) => setLEmail(e.target.value)} placeholder="ইমেইল" />
            <Input
              type="password"
              value={lPass}
              onChange={(e) => setLPass(e.target.value)}
              placeholder="পাসওয়ার্ড"
              onKeyDown={(e) => { if (e.key === "Enter") doLogin(lEmail, lPass); }}
            />
            <Button className="w-full" disabled={loading} onClick={() => doLogin(lEmail, lPass)}>
              {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
            </Button>
          </div>
        </TabsContent>

        {/* ===== রেজিস্ট্রেশন ===== */}
        <TabsContent value="register" className="mt-6">
          <div className="mx-auto max-w-xl rounded-xl border bg-card p-6 shadow-sm">
            <p className="mb-4 text-center text-sm font-bold">
              {regRole === "customer" ? "নতুন অ্যাকাউন্ট খুলুন" : "সেলার হিসেবে আবেদন করুন"}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1"><Label>পূর্ণ নাম</Label><Input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="আপনার নাম" /></div>
              <div className="space-y-1"><Label>মোবাইল</Label><Input value={rPhone} onChange={(e) => setRPhone(e.target.value)} placeholder="০১XXXXXXXXX" /></div>
              <div className="space-y-1 sm:col-span-2"><Label>ইমেইল</Label><Input value={rEmail} onChange={(e) => setREmail(e.target.value)} placeholder="you@example.com" /></div>
              <div className="space-y-1 sm:col-span-2">
                <Label>পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</Label>
                <Input type="password" value={rPass} onChange={(e) => setRPass(e.target.value)} placeholder="পাসওয়ার্ড দিন" />
              </div>
              {regRole === "seller" && (
                <>
                  <div className="space-y-1 sm:col-span-2"><Label>দোকানের নাম</Label><Input value={rShop} onChange={(e) => setRShop(e.target.value)} placeholder="যেমন: রংপুর ক্রাফট হাউস" /></div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>দোকানের সংক্ষিপ্ত পরিচয়</Label>
                    <Textarea value={rShopDesc} onChange={(e) => setRShopDesc(e.target.value)} placeholder="কী ধরনের পণ্য বিক্রি করবেন?" rows={2} />
                  </div>
                </>
              )}
            </div>

            <Button className="mt-4 w-full" size="lg" disabled={loading} onClick={doRegister}>
              {loading ? "অপেক্ষা করুন..." : regRole === "customer" ? "অ্যাকাউন্ট খুলুন" : "সেলার আবেদন পাঠান"}
            </Button>

            <button
              type="button"
              onClick={() => setRegRole(regRole === "seller" ? "customer" : "seller")}
              className="mt-3 w-full text-center text-xs text-muted-foreground underline"
            >
              {regRole === "seller" ? "← সাধারণ অ্যাকাউন্ট খুলুন" : "দোকান খুলে বিক্রি করতে চান? সেলার হিসেবে আবেদন করুন"}
            </button>

            {regRole === "seller" ? (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  আবেদনের পর আমরা আপনার তথ্য যাচাই করব।
                  <strong> অনুমোদনের আগে পণ্য প্রকাশ করা যাবে না।</strong>
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>অ্যাকাউন্ট সাথে সাথেই চালু হবে — কেনাকাটা, রিভিউ ও অর্ডার ট্র্যাকিং শুরু করুন।</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}