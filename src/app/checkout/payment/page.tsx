"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCheckoutStore } from "@/store/checkout-store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const order = useCheckoutStore((s) => s.order);
  const paymentIntent = useCheckoutStore((s) => s.paymentIntent);
  const startPayment = useCheckoutStore((s) => s.startPayment);
  const isLoading = useCheckoutStore((s) => s.isLoading);
  const error = useCheckoutStore((s) => s.error);

  useEffect(() => {
    // No order in state (e.g. page refresh) → shipping step wasn't done yet.
    if (!order) {
      router.replace("/checkout");
      return;
    }
    if (!paymentIntent) startPayment();
  }, [order, paymentIntent, router, startPayment]);

  if (!order) return null;

  if (isLoading && !paymentIntent) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-[13px] text-muted-foreground">
        Preparing payment…
      </main>
    );
  }

  if (error && !paymentIntent) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
        <p className="text-[14px] text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => startPayment()}
          className="mt-4 flex h-10 items-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!paymentIntent) return null;

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Payment
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Total: {currency.format(order.total)}
      </p>

      <div className="mt-8">
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentIntent.clientSecret }}
        >
          <PaymentForm />
        </Elements>
      </div>
    </main>
  );
}

function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const confirm = useCheckoutStore((s) => s.confirm);

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const canSubmit = Boolean(stripe && elements);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setLocalError(null);

    // Confirms the payment with Stripe directly from the client.
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setLocalError(stripeError.message ?? "Payment failed");
      setSubmitting(false);
      return;
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      setLocalError("Payment could not be confirmed. Please try again.");
      setSubmitting(false);
      return;
    }

    // Let our backend know the payment succeeded, so it can update the order.
    const ok = await confirm(paymentIntent.id);
    setSubmitting(false);

    if (ok) {
      router.push("/checkout/success");
    } else {
      setLocalError(
        "Payment was captured but we couldn't confirm the order. Contact support.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />

      {localError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {localError}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className="flex h-12 items-center justify-center rounded-full bg-foreground text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}
