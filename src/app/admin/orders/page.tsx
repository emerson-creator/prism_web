"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";
import { ORDER_STATUS_TRANSITIONS } from "@/libs/types";
import type { OrderStatus, OrderSummary } from "@/libs/types";
import { AlertCircle } from "lucide-react";

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

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-sky-50 text-sky-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELED: "bg-red-50 text-red-700",
};

const STATUS_FILTERS: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useApiFetch(
    () =>
      api.fetchAllOrdersAdmin({
        limit: 100,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      }),
    [statusFilter, refreshKey],
    { fallbackError: "Could not load orders" },
  );

  const orders = ordersResponse?.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Orders
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={[
              "rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              statusFilter === s
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          Loading orders…
        </p>
      ) : error ? (
        <p className="mt-8 text-[13px] text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          No orders found.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId((cur) => (cur === order.id ? null : order.id))
              }
              onUpdated={() => setRefreshKey((k) => k + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onUpdated,
}: {
  order: OrderSummary;
  expanded: boolean;
  onToggle: () => void;
  onUpdated: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const canRefund = order.status === "PROCESSING" || order.status === "SHIPPED";

  async function handleRefund() {
    if (
      !confirm(
        `Refund order #${order.orderNumber}? This will refund the payment via Stripe, restore stock, and cancel the order. This cannot be undone.`,
      )
    ) {
      return;
    }
    setIsRefunding(true);
    setRefundError(null);
    try {
      await api.refundOrder(order.id);
      onUpdated();
    } catch (err) {
      setRefundError(
        err instanceof Error ? err.message : "Could not process refund",
      );
    } finally {
      setIsRefunding(false);
    }
  }
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? "",
  );
  const [notes, setNotes] = useState(order.notes ?? "");

  const allowedNextStatuses = ORDER_STATUS_TRANSITIONS[order.status];

  async function handleStatusChange(nextStatus: OrderStatus) {
    if (nextStatus === order.status) return;
    if (
      !confirm(
        `Change order #${order.orderNumber} from ${order.status} to ${nextStatus}?`,
      )
    ) {
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await api.adminUpdateOrder(order.id, { status: nextStatus });
      onUpdated();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not update status",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveDetails() {
    setIsSaving(true);
    setSaveError(null);
    try {
      await api.adminUpdateOrder(order.id, { trackingNumber, notes });
      onUpdated();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
      >
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-foreground">
            #{order.orderNumber}
            {order.userEmail && (
              <span className="ml-2 font-normal text-muted-foreground">
                {order.userEmail}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {dateFormat.format(new Date(order.createdAt))} ·{" "}
            {order.items.length} item{order.items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
              STATUS_STYLES[order.status],
            ].join(" ")}
          >
            {order.status.toLowerCase()}
          </span>
          <span className="text-[13.5px] font-semibold text-foreground">
            {currency.format(order.total)}
          </span>
          {expanded ? (
            <ChevronUp
              className="h-4 w-4 text-muted-foreground"
              strokeWidth={1.75}
            />
          ) : (
            <ChevronDown
              className="h-4 w-4 text-muted-foreground"
              strokeWidth={1.75}
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-4">
          {saveError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
              {saveError}
            </p>
          )}

          <div className="mb-4">
            <p className="mb-1.5 text-[12px] font-medium text-foreground">
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allowedNextStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isSaving || status === order.status}
                  onClick={() => handleStatusChange(status)}
                  className={[
                    "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors disabled:cursor-default",
                    status === order.status
                      ? STATUS_STYLES[status]
                      : "bg-background text-muted-foreground ring-1 ring-inset ring-border hover:text-foreground",
                  ].join(" ")}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {(order.status === "DELIVERED" || order.status === "CANCELED") && (
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                This is a final status — it can&apos;t be changed further.
              </p>
            )}
          </div>

          {canRefund && (
            <div className="mb-4">
              {refundError && (
                <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
                  {refundError}
                </p>
              )}
              <button
                type="button"
                onClick={handleRefund}
                disabled={isRefunding || isSaving}
                className="flex h-9 items-center gap-2 rounded-full border border-red-200 px-4 text-[12.5px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                {isRefunding ? "Processing refund…" : "Refund & cancel order"}
              </button>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                Refunds the payment via Stripe, restores stock, and cancels the
                order.
              </p>
            </div>
          )}

          <ul className="mb-4 space-y-1.5 rounded-xl bg-background p-3 text-[12.5px]">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.productName} × {item.quantity}
                </span>
                <span className="text-foreground">
                  {currency.format(item.subtotal ?? item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <p className="mb-1 text-[12px] font-medium text-foreground">
              Shipping address
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              {order.shippingAddress}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-foreground">
                Tracking number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="—"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-foreground">
                Internal notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="—"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveDetails}
            disabled={isSaving}
            className="mt-3 flex h-9 items-center rounded-full bg-foreground px-4 text-[12.5px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save details"}
          </button>
        </div>
      )}
    </div>
  );
}
