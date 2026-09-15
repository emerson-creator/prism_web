import Link from "next/link";
import { fetchCategories } from "@/libs/api";
import { AnimatedCollectionsGrid } from "./AnimatedCollectionsGrid";

export async function FeaturedCollections() {
  const { data: categories } = await fetchCategories({ limit: 3 });

  if (!categories?.length) return null;

  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Shop by collection
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground md:text-right">
            Every category, one point of view — pick where to start.
          </p>
        </div>

        <AnimatedCollectionsGrid categories={categories} />
      </div>
    </section>
  );
}
