"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import { OrderDetailSkeleton } from "@/components/modules/order/OrderDetailSkeleton";
import * as api from "@/libs/api";
import type { OrderStatus, OrderSummary } from "@/libs/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  const {
    data: fetchedOrder,
    isLoading,
    error,
  } = useApiFetch(() => api.fetchOrderById(params.id), [params.id, user?.id], {
    enabled: isHydrated && !!user,
    fallbackError: "Could not load order",
  });

  // Local copy so a successful cancel can update the badge/button
  // immediately without waiting on a refetch.
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const activeOrder = order ?? fetchedOrder ?? null;

  async function handleCancel() {
    if (!activeOrder) return;
    if (!confirm("Cancel this order? This cannot be undone.")) return;

    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await api.cancelOrder(activeOrder.id);
      if (updated) setOrder(updated);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Could not cancel this order",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  if (isHydrated && !user) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Sign in to see this order
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

  if (!isHydrated || isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !activeOrder) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
        <p className="text-[14px] text-red-600">{error ?? "Order not found"}</p>
        <Link
          href="/orders"
          className="mt-4 text-[13px] font-medium text-foreground underline underline-offset-2"
        >
          Back to orders
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-2xl animate-fade-in px-4 py-10">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to orders
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Order #{activeOrder.orderNumber}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Placed on {dateFormat.format(new Date(activeOrder.createdAt))}
          </p>
        </div>
        <StatusBadge status={activeOrder.status} />
      </div>

      <ul className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {activeOrder.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p className="text-[13.5px] font-medium text-foreground">
                {item.productName}
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {currency.format(item.price)} × {item.quantity}
              </p>
            </div>
            <span className="text-[13.5px] font-semibold text-foreground">
              {currency.format(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-between rounded-2xl border border-border p-4 text-[14px] font-semibold text-foreground">
        <span>Total</span>
        <span>{currency.format(activeOrder.total)}</span>
      </div>

      <div className="mt-6">
        <p className="text-[13px] font-medium text-foreground">
          Shipping address
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {activeOrder.shippingAddress}
        </p>
      </div>

      {activeOrder.status === "PENDING" && (
        <div className="mt-6 border-t border-border pt-6">
          {cancelError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
              {cancelError}
            </p>
          )}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex h-10 items-center gap-2 rounded-full border border-red-200 px-5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {isCancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isCancelling ? "Cancelling…" : "Cancel order"}
          </button>
          <p className="mt-2 text-[11.5px] text-muted-foreground">
            You can cancel this order because it hasn&apos;t been processed yet.
          </p>
        </div>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    COMPLETED: "bg-green-50 text-green-700",
    CANCELED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={[
        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {status.toLowerCase()}
    </span>
  );
}
