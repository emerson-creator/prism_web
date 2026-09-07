"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import { OrdersListSkeleton } from "@/components/modules/order/OrderListSkeleton";
import * as api from "@/libs/api";
import type { OrderStatus } from "@/libs/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function OrdersPage() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);

  const {
    data: paginated,
    isLoading,
    error,
  } = useApiFetch(() => api.fetchMyOrders({ limit: 20 }), [user?.id], {
    enabled: isHydrated && !!user,
    fallbackError: "Could not load orders",
  });

  const orders = paginated?.data ?? [];

  if (isHydrated && !user) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Sign in to see your orders
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
    return <OrdersListSkeleton />;
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-16 text-center text-[13px] text-red-600">
        {error}
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          No orders yet
        </h1>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          When you place an order, it will show up here.
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
        Your orders
      </h1>

      <ul className="mt-8 divide-y divide-border">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="flex items-center justify-between gap-4 py-5 transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="text-[13.5px] font-medium text-foreground">
                  Order #{order.orderNumber}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {dateFormat.format(new Date(order.createdAt))} ·{" "}
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="text-[13.5px] font-semibold text-foreground">
                  {currency.format(order.total)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
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
        "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {status.toLowerCase()}
    </span>
  );
}
