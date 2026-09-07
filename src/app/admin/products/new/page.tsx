"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import { ProductForm } from "@/components/modules/admin/ProductForm";
import * as api from "@/libs/api";

export default function NewProductPage() {
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useApiFetch(() => api.fetchCategories({ limit: 100 }), [], {
    fallbackError: "Could not load categories",
  });

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to products
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
        New product
      </h1>

      {isLoading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-[13px] text-red-600">{error}</p>
      ) : (
        <ProductForm categories={categoriesResponse?.data ?? []} />
      )}
    </div>
  );
}
