import type { OrderSummary, OrderStatus, Product } from "@/libs/types";

export interface DailyRevenuePoint {
  date: string; // "YYYY-MM-DD"
  label: string; // short display label e.g. "Sep 8"
  revenue: number;
}

/** Sums order totals per day, only counting orders that actually represent revenue. */
export function revenueByDay(
  orders: OrderSummary[],
  days = 14,
): DailyRevenuePoint[] {
  const REVENUE_STATUSES: OrderStatus[] = [
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    if (!REVENUE_STATUSES.includes(order.status)) continue;
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + order.total);
    }
  }

  const dayLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return Array.from(buckets.entries()).map(([date, revenue]) => ({
    date,
    label: dayLabel.format(new Date(date)),
    revenue: Math.round(revenue * 100) / 100,
  }));
}

export interface StatusCount {
  status: OrderStatus;
  count: number;
}

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

export function ordersByStatus(orders: OrderSummary[]): StatusCount[] {
  const counts = new Map<OrderStatus, number>(ALL_STATUSES.map((s) => [s, 0]));
  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }
  return ALL_STATUSES.map((status) => ({
    status,
    count: counts.get(status) ?? 0,
  }));
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

/** Aggregates order items across all orders to find best-sellers by units sold. */
export function topProducts(orders: OrderSummary[], limit = 5): TopProduct[] {
  const map = new Map<string, TopProduct>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.productId);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          unitsSold: item.quantity,
          revenue: item.subtotal,
        });
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, limit);
}

/** Products at or below the given stock threshold, sorted lowest-first. */
export function lowStockProducts(
  products: Product[],
  threshold = 10,
): Product[] {
  return products
    .filter((p) => p.isActive && p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  averageOrderValue: number;
}

export function computeSummary(
  orders: OrderSummary[],
  products: Product[],
): DashboardSummary {
  const revenueOrders = orders.filter((o) =>
    (["PROCESSING", "SHIPPED", "DELIVERED"] as OrderStatus[]).includes(
      o.status,
    ),
  );
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders: orders.length,
    activeProducts: products.filter((p) => p.isActive).length,
    averageOrderValue:
      revenueOrders.length > 0
        ? Math.round((totalRevenue / revenueOrders.length) * 100) / 100
        : 0,
  };
}
