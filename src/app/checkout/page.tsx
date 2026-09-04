"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCartStore, useCartTotal } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { validateRequired, validateZipCode } from "@/libs/validation";
import type { ShippingAddress } from "@/libs/types";
import Field from "@/components/modules/auth/Field";

interface FormErrors {
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  const cart = useCartStore((s) => s.cart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const total = useCartTotal();

  const submitShipping = useCheckoutStore((s) => s.submitShipping);
  const isLoading = useCheckoutStore((s) => s.isLoading);
  const checkoutError = useCheckoutStore((s) => s.error);

  const [form, setForm] = useState<ShippingAddress>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isHydrated && user) fetchCart();
  }, [isHydrated, user, fetchCart]);

  function update<K extends keyof ShippingAddress>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((p) => ({ ...p, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {
      fullName: validateRequired(form.fullName, "Full name") ?? undefined,
      street: validateRequired(form.street, "Street address") ?? undefined,
      city: validateRequired(form.city, "City") ?? undefined,
      state: validateRequired(form.state, "State") ?? undefined,
      zipCode: validateZipCode(form.zipCode) ?? undefined,
      country: validateRequired(form.country, "Country") ?? undefined,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const ok = await submitShipping(form);
    if (ok) router.push("/checkout/payment");
  }

  if (isHydrated && !user) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Sign in to checkout
        </h1>
        <Link
          href="/login"
          className="mt-6 flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const items = cart?.cartItems ?? [];

  if (isHydrated && user && items.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Your cart is empty
        </h1>
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
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Shipping details
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <Field
            label="Full name"
            value={form.fullName}
            onChange={(v) => update("fullName", v)}
            error={errors.fullName}
            autoComplete="name"
          />
          <Field
            label="Street address"
            value={form.street}
            onChange={(v) => update("street", v)}
            error={errors.street}
            autoComplete="street-address"
          />
          <div className="flex gap-3">
            <Field
              label="City"
              value={form.city}
              onChange={(v) => update("city", v)}
              error={errors.city}
              autoComplete="address-level2"
              className="flex-1"
            />
            <Field
              label="State"
              value={form.state}
              onChange={(v) => update("state", v)}
              error={errors.state}
              autoComplete="address-level1"
              className="flex-1"
            />
          </div>
          <div className="flex gap-3">
            <Field
              label="ZIP / postal code"
              value={form.zipCode}
              onChange={(v) => update("zipCode", v)}
              error={errors.zipCode}
              autoComplete="postal-code"
              className="flex-1"
            />
            <Field
              label="Country"
              value={form.country}
              onChange={(v) => update("country", v)}
              error={errors.country}
              autoComplete="country-name"
              className="flex-1"
            />
          </div>
          <Field
            label="Phone (optional)"
            value={form.phone ?? ""}
            onChange={(v) => update("phone", v)}
            autoComplete="tel"
          />

          {checkoutError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
              {checkoutError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 flex h-12 items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Processing…" : "Continue to payment"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-border p-5">
          <p className="text-[13px] font-medium text-foreground">
            Order summary
          </p>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="text-foreground">
                  {currency.format(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-[14px] font-semibold text-foreground">
            <span>Total</span>
            <span>{currency.format(total)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

