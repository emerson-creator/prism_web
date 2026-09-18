// components/modules/product/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/libs/types";
import { useCartStore } from "@/store/cart-store";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stock <= 0;

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addItem(product.id, 1);
    setAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex cursor-pointer flex-col"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {outOfStock && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || outOfStock}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-2.5 right-2.5 flex h-9 cursor-pointer items-center rounded-full bg-foreground px-3.5 text-[12.5px] font-medium text-background opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 sm:opacity-100"
        >
          {justAdded ? "Added ✓" : adding ? "Adding…" : "Add to cart"}
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-foreground">
            {product.name}
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {product.category}
          </p>
        </div>
        <p className="shrink-0 text-[13.5px] font-semibold text-foreground">
          {currency.format(product.price)}
        </p>
      </div>
    </Link>
  );
}

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        width="32"
        height="30"
        viewBox="0 0 26 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-[0.15]"
      >
        <path
          d="M9 12L1 12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M9 3L16.5 12L9 21Z" fill="currentColor" />
      </svg>
    </div>
  );
}
