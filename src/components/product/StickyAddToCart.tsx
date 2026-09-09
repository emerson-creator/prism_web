"use client";

import Link from "next/link";
import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/libs/types";
import { useCartStore } from "@/store/cart-store";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export interface StickyAddToCartProps { product: Product; mainButtonId?: string }

export function StickyAddToCart({ product, mainButtonId = "main-add-to-cart" }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const alreadyInCart = useCartStore((state) => state.cart?.cartItems.some((item) => item.productId === product.id) ?? false);

  useEffect(() => {
    const target = document.getElementById(mainButtonId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [mainButtonId]);

  const addToCart = async () => { setAdding(true); await addItem(product.id); setAdding(false); if (!useCartStore.getState().error && !useCartStore.getState().needsAuth) { setAdded(true); window.setTimeout(() => setAdded(false), 2000); } };
  if (product.stock <= 0) return null;
  return <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}><div className="mx-auto flex max-w-lg items-center gap-3"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">{product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-100" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-sm font-semibold">{currency.format(product.price)}</p></div>{alreadyInCart ? <Link href="/cart" className="rounded-full border border-black px-5 py-2.5 text-sm font-medium">View cart</Link> : <button type="button" onClick={addToCart} disabled={adding} className="inline-flex min-w-28 items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{adding ? <LoaderCircle className="h-4 w-4 animate-spin" /> : added ? <><Check className="mr-1 h-4 w-4 text-green-400" />Added</> : "Add to cart"}</button>}</div></div>;
}
