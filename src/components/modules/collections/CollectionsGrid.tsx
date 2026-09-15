// components/modules/collections/CollectionsGrid.tsx
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Category } from "@/libs/types";

const SPECTRUM = ["#6366f1", "#ec4899", "#f59e0b"];
const COLUMN_OFFSET = ["lg:mt-0", "lg:mt-10", "lg:mt-20"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function CollectionsGrid({ categories }: { categories: Category[] }) {
  return (
    <motion.div
      className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {categories.map((category, index) => {
        const accent = SPECTRUM[index % SPECTRUM.length];
        const offset = COLUMN_OFFSET[index % COLUMN_OFFSET.length];

        return (
          <motion.div key={category.id} variants={item} className={offset}>
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative isolate block overflow-hidden rounded-2xl border border-border bg-white/70 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[color:var(--accent)]/40 hover:shadow-md"
              style={{ ["--accent" as string]: accent }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 -z-10 opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
                style={{
                  background:
                    "radial-gradient(closest-side, var(--accent), transparent 70%)",
                }}
              />

              <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {category.name}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-[color:var(--accent)]">
                Shop now
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
