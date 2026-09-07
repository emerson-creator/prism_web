"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function AdminProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: productsResponse,
    isLoading,
    error: loadError,
  } = useApiFetch(() => api.fetchProducts({ limit: 100 }), [refreshKey], {
    fallbackError: "Could not load products",
  });

  const products = productsResponse?.data ?? [];

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    setError(null);
    try {
      await api.deleteProduct(id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Products
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New product
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          Loading products…
        </p>
      ) : loadError ? (
        <p className="mt-8 text-[13px] text-red-600">{loadError}</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          No products yet. Create your first one.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {product.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {currency.format(product.price)}
                  </td>
                  <td className="px-4 py-3 text-foreground">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        product.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil
                          className="h-[15px] w-[15px]"
                          strokeWidth={1.75}
                        />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2
                          className="h-[15px] w-[15px]"
                          strokeWidth={1.75}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
