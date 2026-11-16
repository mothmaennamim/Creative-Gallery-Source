"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type User, type Product, type Order, type OrderStatus, type PaymentMethod,
  type Notification, type PayoutRequest, type Role,
  INITIAL_USERS, INITIAL_ORDERS, INITIAL_NOTIFICATIONS,
  DELIVERY_FEE,
} from "@/data/mock";

export type View =
  | "home" | "products" | "product" | "cart" | "checkout" | "success"
  | "orders" | "auth" | "seller" | "admin";

export type AdminTab = "overview" | "sellers" | "products" | "orders" | "users" | "commission" | "system";
export type SellerTab = "overview" | "products" | "orders" | "payout";

export interface SearchQuery {
  q: string;
  category: string | null;
  sellerId: string | null;
}

interface PlaceOrderInput {
  name: string;
  phone: string;
  address: string;
  area: string;
  payment: PaymentMethod;
}

interface NewProductInput {
  name: string;
  desc: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface AuthResult {
  ok: boolean;
  message?: string;
  pending?: boolean;
  user?: User;
}

interface StoreState {
  view: View;
  productId: string | null;
  adminTab: AdminTab;
  sellerTab: SellerTab;
  searchQuery: SearchQuery;
  lastOrderIds: string[];

  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  cart: { productId: string; qty: number }[];
  wishlist: string[];
  notifications: Notification[];
  payouts: PayoutRequest[];
  commissionRate: number;

  loadProducts: () => Promise<void>;
  loadMe: () => Promise<void>;

  navigate: (view: View) => void;
  openProduct: (id: string) => void;
  openAdmin: (tab: AdminTab) => void;
  openSeller: (tab: SellerTab) => void;
  setSearch: (sq: Partial<SearchQuery>) => void;

  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  registerCustomer: (name: string, email: string, phone: string, password: string) => Promise<AuthResult>;
  registerSeller: (name: string, email: string, phone: string, password: string, shopName: string, shopDesc: string) => Promise<AuthResult>;
  applySeller: (shopName: string, shopDesc: string) => Promise<AuthResult>;

  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  placeOrder: (input: PlaceOrderInput) => string[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  addProduct: (input: NewProductInput) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;

  approveSeller: (id: string) => void;
  rejectSeller: (id: string) => void;
  toggleUserBlock: (id: string) => void;
  setCommissionRate: (rate: number) => void;
  requestPayout: () => void;
  markPayoutPaid: (id: string) => void;

  addReview: (productId: string, rating: number, comment: string) => void;
}

const uid = () => `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

async function postAuth(url: string, body: unknown): Promise<AuthResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: data.message ?? "কিছু একটা সমস্যা হয়েছে" };
    return { ok: true, pending: data.pending, user: data.user };
  } catch {
    return { ok: false, message: "সার্ভারের সাথে যোগাযোগ করা যায়নি" };
  }
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      view: "home",
      productId: null,
      adminTab: "overview",
      sellerTab: "overview",
      searchQuery: { q: "", category: null, sellerId: null },
      lastOrderIds: [],

      currentUser: null,
      users: INITIAL_USERS,
      products: [],
      orders: INITIAL_ORDERS,
      cart: [],
      wishlist: [],
      notifications: INITIAL_NOTIFICATIONS,
      payouts: [],
      commissionRate: 10,

      loadProducts: async () => {
        try {
          const res = await fetch("/api/products");
          if (!res.ok) return;
          const products = await res.json();
          set({ products });
        } catch {
          // নেটওয়ার্ক সমস্যা হলে আগের তালিকাই থাকবে
        }
      },

      loadMe: async () => {
        try {
          const res = await fetch("/api/auth/me");
          
          if (!res.ok) return;
          const data = await res.json();
          set({ currentUser: data.user ?? null });
        } catch {
          // নেটওয়ার্ক সমস্যা হলে কিছু বদলাবে না
        }
      },

      navigate: (view) => { set({ view }); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); },
      openProduct: (id) => { set({ productId: id, view: "product" }); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); },
      openAdmin: (tab) => { set({ adminTab: tab, view: "admin" }); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); },
      openSeller: (tab) => { set({ sellerTab: tab, view: "seller" }); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); },
      setSearch: (sq) => set({ searchQuery: { ...get().searchQuery, ...sq } }),

      login: async (email, password) => {
        const r = await postAuth("/api/auth/login", { email, password });
        if (r.ok && r.user) set({ currentUser: r.user });
        return r;
      },

      logout: async () => {
        try { await fetch("/api/auth/logout", { method: "POST" }); } catch { /* উপেক্ষা */ }
        set({ currentUser: null, view: "home" });
      },

      registerCustomer: async (name, email, phone, password) => {
        const r = await postAuth("/api/auth/register", { role: "customer", name, email, phone, password });
        if (r.ok && r.user) set({ currentUser: r.user });
        return r;
      },

      registerSeller: async (name, email, phone, password, shopName, shopDesc) => {
        return postAuth("/api/auth/register", { role: "seller", name, email, phone, password, shopName, shopDesc });
      },

            applySeller: async (shopName, shopDesc) => {
        const r = await postAuth("/api/auth/apply-seller", { shopName, shopDesc });
        if (r.ok && r.user) set({ currentUser: r.user });
        return r;
      },

      addToCart: (productId, qty = 1) => {
        const existing = get().cart.find((c) => c.productId === productId);
        if (existing) {
          set({ cart: get().cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c)) });
        } else {
          set({ cart: [...get().cart, { productId, qty }] });
        }
      },
      setCartQty: (productId, qty) => {
        if (qty <= 0) { get().removeFromCart(productId); return; }
        set({ cart: get().cart.map((c) => (c.productId === productId ? { ...c, qty } : c)) });
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter((c) => c.productId !== productId) }),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => {
        const w = get().wishlist;
        set({ wishlist: w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId] });
      },

      placeOrder: (input) => {
        const { cart, products, currentUser, commissionRate } = get();
        const groups = new Map<string, typeof cart>();
        cart.forEach((c) => {
          const p = products.find((x) => x.id === c.productId);
          if (!p) return;
          const arr = groups.get(p.sellerId) ?? [];
          arr.push(c);
          groups.set(p.sellerId, arr);
        });
        const stamp = Date.now();
        const groupId = `grp-${stamp % 100000}`;
        const newOrders: Order[] = [];
        let seq = 1050;
        groups.forEach((items, sellerId) => {
          const orderItems = items.map((c) => {
            const p = products.find((x) => x.id === c.productId)!;
            return { productId: p.id, name: p.name, price: p.price, qty: c.qty, image: p.image };
          });
          const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
          const delivery = DELIVERY_FEE;
          const total = subtotal + delivery;
          const commission = Math.round((subtotal * commissionRate) / 100);
          const status: OrderStatus = input.payment === "cod" ? "pending" : "confirmed";
          newOrders.push({
            id: `ord-${stamp % 1000000}-${seq++}`,
            groupId,
            customerName: input.name,
            phone: input.phone,
            address: input.address,
            area: input.area,
            payment: input.payment,
            items: orderItems,
            sellerId,
            subtotal, delivery, total, commission,
            sellerEarning: subtotal - commission,
            status,
            createdAt: "২০২৬-১১-০৫",
          });
        });
        // স্টক কমানো ও বিক্রয় বাড়ানো
        const products2 = products.map((p) => {
          const item = cart.find((c) => c.productId === p.id);
          if (!item) return p;
          return { ...p, stock: Math.max(0, p.stock - item.qty), sales: p.sales + item.qty };
        });
        const sellerNotif = [...groups.keys()]
          .map((sid) => get().users.find((u) => u.id === sid)?.shopName ?? sid)
          .join(", ");
        set({
          orders: [...newOrders, ...get().orders],
          products: products2,
          cart: [],
          lastOrderIds: newOrders.map((o) => o.id),
          view: "success",
          notifications: [
            { id: uid(), text: `নতুন অর্ডার এসেছে — ${sellerNotif} (${newOrders.length}টি অর্ডার)`, time: "এইমাত্র", role: "seller" as Role },
            { id: uid(), text: `নতুন অর্ডার: ${input.name} — ${newOrders.length}টি সেলারে ভাগ হয়েছে`, time: "এইমাত্র", role: "admin" as Role },
            { id: uid(), text: `অর্ডার নিশ্চিত হয়েছে (${newOrders.length}টি অর্ডার) — ট্র্যাক করুন`, time: "এইমাত্র", role: (currentUser?.role ?? "customer") as Role },
            ...get().notifications,
          ],
        });
        if (typeof window !== "undefined") window.scrollTo({ top: 0 });
        return newOrders.map((o) => o.id);
      },

      updateOrderStatus: (orderId, status) =>
        set({ orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }),

      addProduct: (input) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const p: Product = {
          id: uid(), name: input.name, desc: input.desc, price: input.price,
          stock: input.stock, category: input.category, sellerId: currentUser.id,
          image: input.image, rating: 0, reviews: [], status: "pending", sales: 0,
          createdAt: "২০২৬-১১-০৫",
        };
        set({
          products: [p, ...get().products],
          notifications: [
            { id: uid(), text: `নতুন পণ্য রিভিউর অপেক্ষায়: ${input.name}`, time: "এইমাত্র", role: "admin" as Role },
            ...get().notifications,
          ],
        });
      },
      approveProduct: (id) =>
        set({ products: get().products.map((p) => (p.id === id ? { ...p, status: "approved" } : p)) }),
      rejectProduct: (id, reason) =>
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, status: "rejected", rejectReason: reason } : p)),
        }),

      approveSeller: (id) => {
        const u = get().users.find((x) => x.id === id);
        set({
          users: get().users.map((x) => (x.id === id ? { ...x, status: "active" } : x)),
          notifications: [
            ...(u ? [{ id: uid(), text: `অভিনন্দন! ${u.shopName ?? u.name} অনুমোদিত হয়েছে — এখন পণ্য আপলোড করতে পারবেন`, time: "এইমাত্র", role: "seller" as Role }] : []),
            ...get().notifications,
          ],
        });
      },
      rejectSeller: (id) =>
        set({ users: get().users.filter((x) => x.id !== id) }),
      toggleUserBlock: (id) =>
        set({
          users: get().users.map((x) =>
            x.id === id ? { ...x, status: x.status === "blocked" ? "active" : "blocked" } : x
          ),
        }),
      setCommissionRate: (rate) => set({ commissionRate: rate }),

      requestPayout: () => {
        const { currentUser, orders } = get();
        if (!currentUser || currentUser.role !== "seller") return;
        const myOrders = orders.filter((o) => o.sellerId === currentUser.id && o.status !== "cancelled" && o.status !== "pending");
        const balance = myOrders.reduce((s, o) => s + o.sellerEarning, 0);
        if (balance <= 0) return;
        const req: PayoutRequest = {
          id: uid(), sellerId: currentUser.id, sellerName: currentUser.name,
          shopName: currentUser.shopName ?? currentUser.name, amount: balance,
          date: "২০২৬-১১-০৫", status: "অপেক্ষমাণ",
        };
        set({
          payouts: [req, ...get().payouts],
          notifications: [
            { id: uid(), text: `পেআউট অনুরোধ: ${currentUser.shopName} — ৳${balance.toLocaleString("en-IN")}`, time: "এইমাত্র", role: "admin" as Role },
            ...get().notifications,
          ],
        });
      },
      markPayoutPaid: (id) =>
        set({ payouts: get().payouts.map((p) => (p.id === id ? { ...p, status: "পরিশোধিত" } : p)) }),

      addReview: (productId, rating, comment) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const rv = {
          id: uid(), userName: currentUser.name, rating, comment,
          date: "২০২৬-১১-০৫", verified: true,
        };
        set({
          products: get().products.map((p) => {
            if (p.id !== productId) return p;
            const reviews = [rv, ...p.reviews];
            const rating2 = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
            return { ...p, reviews, rating: Math.round(rating2 * 10) / 10 };
          }),
        });
      },
    }),
    {
      name: "creative-gallery-v2",
      partialize: (s) =>
        ({
          users: s.users,
          orders: s.orders,
          cart: s.cart,
          wishlist: s.wishlist,
          notifications: s.notifications,
          payouts: s.payouts,
          commissionRate: s.commissionRate,
        }) as unknown as StoreState,
    }
  )
);

if (typeof window !== "undefined") {
  useStore.getState().loadProducts();
  useStore.getState().loadMe();
}