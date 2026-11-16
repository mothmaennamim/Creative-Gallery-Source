"use client";

import { useSyncExternalStore } from "react";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { FloatingButtons } from "@/components/shop/Floating";
import { HomeView } from "@/components/shop/views/Home";
import { ProductsView } from "@/components/shop/views/Products";
import { ProductDetailView } from "@/components/shop/views/ProductDetail";
import { CartView } from "@/components/shop/views/Cart";
import { CheckoutView } from "@/components/shop/views/Checkout";
import { SuccessView, OrdersView } from "@/components/shop/views/Orders";
import { AuthView } from "@/components/shop/views/Auth";
import { SellerDashboardView } from "@/components/shop/views/SellerDashboard";
import { AdminPanelView } from "@/components/shop/views/AdminPanel";
import { useStore } from "@/lib/store";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function AppShell() {
  const view = useStore((s) => s.view);
  // localStorage persist-state ক্লায়েন্টে হাইড্রেট হওয়া পর্যন্ত অপেক্ষা (hydration mismatch এড়াতে)
  const ready = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <span className="inline-flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-primary text-2xl">🎨</span>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">ক্রিয়েটিভ গ্যালারি লোড হচ্ছে…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {view === "home" && <HomeView />}
        {view === "products" && <ProductsView />}
        {view === "product" && <ProductDetailView />}
        {view === "cart" && <CartView />}
        {view === "checkout" && <CheckoutView />}
        {view === "success" && <SuccessView />}
        {view === "orders" && <OrdersView />}
        {view === "auth" && <AuthView />}
        {view === "seller" && <SellerDashboardView />}
        {view === "admin" && <AdminPanelView />}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
