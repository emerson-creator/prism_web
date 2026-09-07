"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/libs/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const needsAuth = useCartStore((s) => s.needsAuth);
  const error = useCartStore((s) => s.error);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stock <= 0;
  const maxReached = quantity >= product.stock;

  async function handleAdd() {
    setAdding(true);
    setJustAdded(false);
    await addItem(product.id, quantity);
    setAdding(false);
    // Re-read the freshest needsAuth right after the call resolves.
    if (useCartStore.getState().needsAuth) return;
    if (!useCartStore.getState().error) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  }

  return (
    <div>
      {!outOfStock && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[13px] font-medium text-foreground">
            Quantity
          </span>
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span className="w-8 text-center text-[13.5px] font-medium text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={maxReached}
              className="flex h-9 w-9 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <span className="text-[12px] text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={adding || outOfStock}
        className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock
          ? "Out of stock"
          : justAdded
            ? "Added to cart ✓"
            : adding
              ? "Adding…"
              : "Add to cart"}
      </button>

      {needsAuth && (
        <p className="mt-3 text-center text-[13px] text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-medium text-foreground underline underline-offset-2"
          >
            Sign in
          </button>{" "}
          to add items to your cart.
        </p>
      )}

      {!needsAuth && error && (
        <p className="mt-3 text-center text-[13px] text-red-600">{error}</p>
      )}
    </div>
  );
}
