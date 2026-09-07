import { ProductGridSkeleton } from "@/components/modules/product/ProductGridSkeleton";

export default function ProductsLoading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
      <ProductGridSkeleton />
    </main>
  );
}
