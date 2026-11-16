"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type Product, categoryName } from "@/data/mock";
import { bn, tk, bnRate } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const openProduct = useStore((s) => s.openProduct);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const users = useStore((s) => s.users);
  const { toast } = useToast();
  const [imgOk, setImgOk] = useState(true);

  const seller = users.find((u) => u.id === product.sellerId);
  const discounted = !!product.oldPrice && product.oldPrice > product.price;
  const inWish = wishlist.includes(product.id);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="relative cursor-pointer overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50"
        onClick={() => openProduct(product.id)}
        role="button"
        aria-label={product.name}
      >
        {imgOk ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center text-5xl">🖼️</div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discounted && (
            <Badge className="bg-rose-600 text-white">
              {bn(Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100))}% ছাড়
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              মাত্র {bn(product.stock)}টি বাকি
            </Badge>
          )}
        </div>
        <button
          aria-label="উইশলিস্টে যোগ করুন"
          className={`absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow transition-colors ${
            inWish ? "text-rose-600" : "text-muted-foreground hover:text-rose-500"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            toast({ description: inWish ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যোগ হয়েছে ❤️" });
          }}
        >
          <Heart className={`h-4 w-4 ${inWish ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-xs text-muted-foreground">{categoryName(product.category)}</p>
        <h3
          className="line-clamp-2 cursor-pointer text-sm font-semibold leading-snug hover:text-primary"
          onClick={() => openProduct(product.id)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium">{bnRate(product.rating)}</span>
          <span className="text-muted-foreground">({bn(product.reviews.length)})</span>
          <span className="ml-auto text-muted-foreground">{bn(product.sales)} বিক্রি</span>
        </div>
        {seller && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Store className="h-3 w-3" /> {seller.shopName}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1.5">
          <div>
            <p className="text-base font-bold text-primary">{tk(product.price)}</p>
            {discounted && (
              <p className="text-xs text-muted-foreground line-through">{tk(product.oldPrice!)}</p>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => {
              addToCart(product.id);
              toast({ description: "কার্টে যোগ হয়েছে 🛒" });
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> কিনুন
          </Button>
        </div>
      </div>
    </div>
  );
}
