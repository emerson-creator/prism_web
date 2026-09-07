"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, useCartTotal } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { CartSkeleton } from "@/components/modules/cart/CartSkeleton";
import type { CartItem } from "@/libs/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CartPage() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  const cart = useCartStore((s) => s.cart);
  const isLoading = useCartStore((s) => s.isLoading);
  const needsAuth = useCartStore((s) => s.needsAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const total = useCartTotal();

  useEffect(() => {
    if (isHydrated && user) fetchCart();
  }, [isHydrated, user, fetchCart]);

  if (isHydrated && !user) {
    return <SignInPrompt />;
  }

  if (needsAuth) {
    return <SignInPrompt />;
  }

  if (!isHydrated || (isLoading && !cart)) {
    return <CartSkeleton />;
  }

  const items = cart?.cartItems ?? [];

  if (items.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto animate-fade-in px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Your cart
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {items.length} item{items.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">
              {currency.format(total)}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity } = item;
  const maxReached = quantity >= product.stock;

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${product.id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              width="22"
              height="20"
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
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/products/${product.id}`}
              className="text-[13.5px] font-medium text-foreground hover:underline"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {currency.format(product.price)} each
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => removeItem(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateItem(item.id, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span className="w-7 text-center text-[13px] font-medium text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateItem(item.id, quantity + 1)}
              disabled={maxReached}
              className="flex h-8 w-8 items-center justify-center text-foreground/70 transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <span className="text-[13.5px] font-semibold text-foreground">
            {currency.format(product.price * quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}

function SignInPrompt() {
  return (
    <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Sign in to view your cart
      </h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Your cart is saved to your account.
      </p>
      <Link
        href="/login"
        className="mt-6 flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
      >
        Sign in
      </Link>
    </main>
  );
}
