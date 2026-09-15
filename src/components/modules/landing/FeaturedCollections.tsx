import Link from "next/link";
import { fetchCategories } from "@/libs/api";
import { AnimatedCollectionsGrid } from "./AnimatedCollectionsGrid";

export async function FeaturedCollections() {
  const { data: categories } = await fetchCategories({ limit: 3 });

  if (!categories?.length) return null;

  return (
    <section className="container mx-auto px-4 py-24 sm:py-28">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Explore Prism
          </p>

          <h2 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Shop by collection
          </h2>
        </div>

        <Link
          href="/collections"
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
        >
          View all <span className="ml-1">→</span>
        </Link>
      </div>

      <AnimatedCollectionsGrid categories={categories} />
    </section>
  );
}
