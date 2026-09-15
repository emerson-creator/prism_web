// app/(main)/products/page.tsx
import { Suspense } from "react";
import { fetchCategories, fetchProducts } from "@/libs/api";
import { ProductGrid } from "@/components/modules/product/ProductGrid";
import { ProductFilters } from "@/components/modules/product/ProductFilters";
import { Pagination } from "@/components/modules/product/Pagination";

export const revalidate = 60;

const PAGE_SIZE = 18;

interface ProductsPageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { search, category, page: pageParam } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;

  const [{ data: products, meta }, categoriesResponse] = await Promise.all([
    fetchProducts({
      search,
      category,
      page,
      limit: PAGE_SIZE,
      isActive: true,
    }),
    fetchCategories({ limit: 100 }),
  ]);

  const hasFilters = !!(search || category);
  const totalPages = Math.max(1, Math.ceil(meta.totalItems / PAGE_SIZE));

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Catalog
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {meta.totalItems} product{meta.totalItems === 1 ? "" : "s"}
          {hasFilters ? " found" : ""}
        </p>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <ProductFilters categories={categoriesResponse.data} />
      </Suspense>

      <div className="mt-8">
        {products.length === 0 && hasFilters ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[15px] font-medium text-foreground">
              No products match your filters
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={{ search, category }}
            />
          </>
        )}
      </div>
    </main>
  );
}
