import { fetchProducts } from "@/libs/api";
import Link from "next/link";
import { AnimatedProductsGrid } from "./AnimatedProductsGrid";

export async function FeaturedProducts() {
  const { data: products } = await fetchProducts({ limit: 4, isActive: true });

  if (!products?.length) return null;

  return (
    <section className="bg-muted/40 border-y border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Featured products
          </h2>
          <Link href="/catalog" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <AnimatedProductsGrid products={products} />
      </div>
    </section>
  );
}
