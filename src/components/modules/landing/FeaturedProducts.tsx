// components/modules/landing/FeaturedProducts.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/libs/api";
import { AnimatedProductsGrid } from "./AnimatedProductsGrid";

export async function FeaturedProducts() {
  const { data: products } = await fetchProducts({ limit: 4, isActive: true });

  if (!products?.length) return null;

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div className="mb-8 flex items-baseline justify-between md:mb-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Featured products
          </h2>
          <Link
            href="/products"
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <AnimatedProductsGrid products={products} />
      </div>
    </section>
  );
}
