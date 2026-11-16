"use client";

import { useState } from "react";
import {
  ShoppingBag, Bell, Menu, Search, UserCircle2, LogOut,
  LayoutDashboard, Heart, Package, Home, Store, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ROLE_LABEL } from "@/data/mock";
import { bn } from "@/lib/format";
import { useStore } from "@/lib/store";

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="flex items-center gap-2" onClick={onClick} aria-label="ক্রিয়েটিভ গ্যালারি হোম">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg text-primary-foreground shadow-sm">
        
      </span>
      <span className="text-left leading-tight">
        <span className="block text-base font-extrabold text-primary">ক্রিয়েটিভ গ্যালারি</span>
        <span className="hidden text-[10px] text-muted-foreground sm:block">সৃজনশীলতার অনলাইন বাজার · রংপুর</span>
      </span>
    </button>
  );
}

export function Header() {
  const { view, navigate, cart, currentUser, notifications, logout, setSearch, searchQuery } = useStore();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const myNotifs = currentUser
    ? notifications.filter((n) => n.role === currentUser.role)
    : [];

  const go = (v: Parameters<typeof navigate>[0]) => {
    navigate(v);
    setMenuOpen(false);
  };

  const navLinks: { label: string; view: Parameters<typeof navigate>[0]; icon: React.ReactNode }[] = [
    { label: "হোম", view: "home", icon: <Home className="h-4 w-4" /> },
    { label: "পণ্য", view: "products", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: "আমার অর্ডার", view: "orders", icon: <Package className="h-4 w-4" /> },
  ];

  const submitSearch = () => {
    setSearch({ q, sellerId: null });
    go("products");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      {/* শীর্ষ স্ট্রিপ */}
      <div className="hidden bg-primary text-primary-foreground sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1 text-xs">
          <p>🚚 রংপুর সদরে ৬০৳ ডেলিভারি — ২–৩ দিনে পণ্য হাতে</p>
          <p>যাচাইকৃত সেলার · নিরাপদ পেমেন্ট · ☎ জরুরি হেল্পলাইন ৯৯৯</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Logo onClick={() => go("home")} />

        {/* ডেস্কটপ নেভ */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="প্রধান মেনু">
          {navLinks.map((l) => (
            <Button
              key={l.label}
              variant={view === l.view ? "secondary" : "ghost"}
              size="sm"
              className="text-sm"
              onClick={() => go(l.view)}
            >
              {l.label}
            </Button>
          ))}
          {currentUser?.role === "seller" && (
            <Button variant="ghost" size="sm" onClick={() => go("seller")}>
              সেলার প্যানেল
            </Button>
          )}
          {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
            <Button variant="ghost" size="sm" onClick={() => go("admin")}>
              {currentUser.role === "superadmin" ? "সুপার অ্যাডমিন" : "অ্যাডমিন প্যানেল"}
            </Button>
          )}
        </nav>

        {/* ডেস্কটপ সার্চ */}
        <div className="ml-auto hidden max-w-xs flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="পণ্য খুঁজুন…"
              className="h-9 pl-8"
              aria-label="পণ্য সার্চ"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          {/* নোটিফিকেশন */}
          {currentUser && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="নোটিফিকেশন">
                  <Bell className="h-5 w-5" />
                  {myNotifs.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                      {bn(myNotifs.length)}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b px-3 py-2 text-sm font-semibold">নোটিফিকেশন</p>
                <div className="nice-scroll max-h-72 overflow-y-auto">
                  {myNotifs.length === 0 && (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">কোনো নোটিফিকেশন নেই</p>
                  )}
                  {myNotifs.map((n) => (
                    <div key={n.id} className="border-b px-3 py-2 last:border-0">
                      <p className="text-sm">{n.text}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* কার্ট */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => go("cart")} aria-label="কার্ট">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {bn(cartCount)}
              </span>
            )}
          </Button>

          {/* ইউজার */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1.5 px-2" aria-label="ইউজার মেনু">
                  <UserCircle2 className="h-6 w-6 text-primary" />
                  <span className="hidden text-sm sm:inline">{currentUser.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <Badge variant="secondary" className="mt-0.5 bg-blue-100 text-blue-900">
                    {ROLE_LABEL[currentUser.role]}
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.role === "seller" && (
                  <DropdownMenuItem onClick={() => go("seller")}>
                    <LayoutDashboard className="h-4 w-4" /> সেলার ড্যাশবোর্ড
                  </DropdownMenuItem>
                )}
                {(currentUser.role === "admin" || currentUser.role === "superadmin") && (
                  <DropdownMenuItem onClick={() => go("admin")}>
                    <LayoutDashboard className="h-4 w-4" /> অ্যাডমিন প্যানেল
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => go("orders")}>
                  <Package className="h-4 w-4" /> আমার অর্ডার
                </DropdownMenuItem>
                {currentUser.role === "customer" && (
                  <DropdownMenuItem onClick={() => go("orders")}>
                    <Heart className="h-4 w-4" /> উইশলিস্ট
                  </DropdownMenuItem>
                )}
                {currentUser.role === "customer" && currentUser.sellerStatus === "pending" && (
                  <DropdownMenuItem disabled>
                    <Clock className="h-4 w-4" /> আবেদন যাচাইয়ের অপেক্ষায়
                  </DropdownMenuItem>
                )}
                {currentUser.role === "customer" && currentUser.sellerStatus !== "pending" && (
                  <DropdownMenuItem onClick={() => go("auth")}>
                    <Store className="h-4 w-4" /> সেলার হিসেবে আবেদন করুন
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="h-4 w-4" /> লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => go("auth")}>
              লগইন / রেজিস্ট্রেশন
            </Button>
          )}

          {/* মোবাইল মেনু */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="মেনু খুলুন">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-primary">ক্রিয়েটিভ গ্যালারি</SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex flex-col gap-1 px-4">
                <div className="relative mb-2">
                  <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                    placeholder="পণ্য খুঁজুন…"
                    className="h-9 pl-8"
                  />
                </div>
                {navLinks.map((l) => (
                  <Button key={l.label} variant="ghost" className="justify-start gap-2" onClick={() => go(l.view)}>
                    {l.icon} {l.label}
                  </Button>
                ))}
                {currentUser?.role === "seller" && (
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => go("seller")}>
                    <LayoutDashboard className="h-4 w-4" /> সেলার প্যানেল
                  </Button>
                )}
                {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && (
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => go("admin")}>
                    <LayoutDashboard className="h-4 w-4" />
                    {currentUser.role === "superadmin" ? "সুপার অ্যাডমিন" : "অ্যাডমিন প্যানেল"}
                  </Button>
                )}
                {currentUser?.role === "customer" && currentUser.sellerStatus !== "pending" && (
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => go("auth")}>
                    <Store className="h-4 w-4" /> সেলার হিসেবে আবেদন করুন
                  </Button>
                )}
                {!currentUser && (
                  <Button className="mt-2 justify-start gap-2" onClick={() => go("auth")}>
                    <Store className="h-4 w-4" /> লগইন / রেজিস্ট্রেশন
                  </Button>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  মোবাইল-প্রথম ডিজাইন — ফোন থেকেও আরামদায়ক ব্রাউজিং 📱
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* চলমান সার্চ কনটেক্সট ইন্ডিকেটর */}
      {view === "products" && searchQuery.q && (
        <div className="border-t bg-blue-50/60">
          <div className="mx-auto max-w-6xl px-4 py-1.5 text-xs text-blue-900">
            “{searchQuery.q}” এর ফলাফল দেখানো হচ্ছে
          </div>
        </div>
      )}
    </header>
  );
}