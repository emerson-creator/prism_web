"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCheckoutStore } from "@/store/checkout-store";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutSuccessPage() {
  const order = useCheckoutStore((s) => s.order);
  const reset = useCheckoutStore((s) => s.reset);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    // The cart should now be checked out on the backend; refresh our copy.
    fetchCart();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-12 w-12 text-foreground" strokeWidth={1.5} />
      <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground">
        Order confirmed
      </h1>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        {order
          ? `Order #${order.id.slice(0, 8)} is on its way.`
          : "Thank you for your purchase."}
      </p>
      <Link
        href="/products"
        className="mt-8 flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
      >
        Continue shopping
      </Link>
    </main>
  );
}
