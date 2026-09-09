"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, DollarSign, Package, ShoppingBag } from "lucide-react";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";
import {
  computeSummary,
  lowStockProducts,
  ordersByStatus,
  revenueByDay,
  topProducts,
} from "@/libs/analytics";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PROCESSING: "#6366f1",
  SHIPPED: "#0ea5e9",
  DELIVERED: "#22c55e",
  CANCELED: "#ef4444",
};

export default function AdminOverviewPage() {
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useApiFetch(() => api.fetchAllOrdersAdmin({ limit: 200 }), [], {
    fallbackError: "Could not load orders",
  });

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useApiFetch(() => api.fetchProducts({ limit: 200 }), [], {
    fallbackError: "Could not load products",
  });

  const isLoading = isLoadingOrders || isLoadingProducts;
  const error = ordersError ?? productsError;

  const orders = ordersResponse?.data ?? [];
  const products = productsResponse?.data ?? [];

  const summary = computeSummary(orders, products);
  const revenueData = revenueByDay(orders);
  const statusData = ordersByStatus(orders);
  const bestSellers = topProducts(orders);
  const lowStock = lowStockProducts(products);

  if (isLoading) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Admin overview
        </h1>
        <p className="mt-8 text-[13px] text-muted-foreground">
          Loading dashboard…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Admin overview
        </h1>
        <p className="mt-8 text-[13px] text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Admin overview
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Based on the last 200 orders and products.
      </p>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={DollarSign}
          label="Revenue"
          value={currency.format(summary.totalRevenue)}
        />
        <SummaryCard
          icon={ShoppingBag}
          label="Orders"
          value={String(summary.totalOrders)}
        />
        <SummaryCard
          icon={Package}
          label="Active products"
          value={String(summary.activeProducts)}
        />
        <SummaryCard
          icon={DollarSign}
          label="Avg. order value"
          value={currency.format(summary.averageOrderValue)}
        />
      </div>

      {/* Revenue + status */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-[13px] font-medium text-foreground">
            Revenue (last 14 days)
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e4e4e7"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={{ stroke: "#e4e4e7" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v) => currency.format(v)}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? currency.format(value) : ""
                  }
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    borderColor: "#e4e4e7",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <p className="text-[13px] font-medium text-foreground">
            Orders by status
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    borderColor: "#e4e4e7",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {statusData.map((s) => (
              <div
                key={s.status}
                className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[s.status] }}
                />
                {s.status.toLowerCase()} ({s.count})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products + low stock */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-[13px] font-medium text-foreground">
            Top products
          </p>
          {bestSellers.length === 0 ? (
            <p className="mt-6 text-[12.5px] text-muted-foreground">
              No sales data yet.
            </p>
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestSellers}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      borderColor: "#e4e4e7",
                    }}
                  />
                  <Bar
                    dataKey="unitsSold"
                    fill="#18181b"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="h-4 w-4 text-amber-500"
              strokeWidth={1.75}
            />
            <p className="text-[13px] font-medium text-foreground">
              Low stock (≤10 units)
            </p>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-6 text-[12.5px] text-muted-foreground">
              All products are well stocked.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {lowStock.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-[12.5px] transition-colors hover:text-foreground"
                  >
                    <span className="truncate text-foreground">
                      {product.name}
                    </span>
                    <span
                      className={[
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        product.stock === 0
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {product.stock} left
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-[20px] font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}
