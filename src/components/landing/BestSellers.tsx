"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/libs/types";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import { fetchProducts } from "@/libs/api";
import { useCartStore } from "@/store/cart-store";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export interface BestSellersProps { products?: Product[] }

export function BestSellers({ products: suppliedProducts }: BestSellersProps) {
  const { data, isLoading } = useApiFetch(() => fetchProducts({ limit: 4, isActive: true }), [], { enabled: !suppliedProducts });
  const products = suppliedProducts ?? data?.data ?? [];

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-4"><h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">Best Sellers</h2><Link href="/products" className="text-sm font-medium hover:underline">View all <span aria-hidden="true">→</span></Link></div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {isLoading && !suppliedProducts ? Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />) : products.map((product) => <BestSellerCard key={product.id} product={product} />)}
        </div>
        {!isLoading && products.length === 0 && <p className="mt-10 text-sm text-muted-foreground">Our best sellers are being selected. Check back soon.</p>}
      </div>
    </section>
  );
}

function BestSellerCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const originalPrice = product.price >= 100 ? product.price * 1.15 : undefined;
  const handleAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); event.stopPropagation(); setAdding(true);
    await addItem(product.id); setAdding(false); setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };
  return <Link href={`/products/${product.id}`} className="group block rounded-2xl transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"><div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f5f7]">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <ProductPlaceholder />}<span className="absolute left-3 top-3 rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Best Seller</span><button type="button" onClick={handleAdd} disabled={adding || product.stock <= 0} aria-label={`Add ${product.name} to cart`} className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-black text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-40">{added ? <Check className="h-4 w-4 text-green-400" /> : <Plus className="h-4 w-4" />}</button></div><div className="mt-3"><p className="truncate text-sm font-medium text-foreground">{product.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{product.category}</p><div className="mt-1 flex items-center gap-2"><span className="text-sm font-semibold">{currency.format(product.price)}</span>{originalPrice && <><span className="text-xs text-muted-foreground line-through">{currency.format(originalPrice)}</span><span className="text-xs font-medium text-red-500">15% off</span></>}</div></div></Link>;
}

function SkeletonCard() { return <div className="animate-pulse"><div className="aspect-square rounded-xl bg-zinc-200" /><div className="mt-3 h-3 w-3/4 rounded bg-zinc-200" /><div className="mt-2 h-3 w-1/2 rounded bg-zinc-200" /></div>; }
function ProductPlaceholder() { return <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_35%_25%,white,transparent_28%),linear-gradient(135deg,#e4e4e7,#f4f4f5)]"><div className="h-[44%] w-[38%] rounded-[2rem] bg-zinc-800 shadow-xl" /></div>; }
