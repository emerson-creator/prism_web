import type { Product } from "@/libs/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[15px] font-medium text-foreground">
          No products here yet
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Come back soon, we&apos;re preparing the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="grid animate-fade-in grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
