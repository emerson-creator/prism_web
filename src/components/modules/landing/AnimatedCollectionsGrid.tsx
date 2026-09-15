// components/modules/landing/AnimatedCollectionsGrid.tsx
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Category } from "@/libs/types";

const SPECTRUM = ["#6366f1", "#ec4899", "#f59e0b"];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function AnimatedCollectionsGrid({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <motion.div
      className="grid gap-5 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {categories.map((category, index) => {
        const accent = SPECTRUM[index % SPECTRUM.length];
        return (
          <motion.div key={category.id} variants={itemVariants}>
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block"
              style={{ ["--accent" as string]: accent }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted transition-colors duration-300 group-hover:border-[color:var(--accent)]/40">
                <CollectionArtwork index={index} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                  <h3 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {category.name}
                  </h3>

                  <span
                    className="
                      flex h-10 w-10 shrink-0 items-center justify-center
                      rounded-full border border-foreground/10
                      bg-background text-foreground
                      transition-all duration-300
                      group-hover:translate-x-1 group-hover:border-[color:var(--accent)]/40 group-hover:text-[color:var(--accent)]
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function CollectionArtwork({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10" />
        <div className="absolute left-[-20%] top-1/2 h-px w-[140%] rotate-[-18deg] bg-foreground/15" />
        <div
          className="absolute left-[55%] top-[40%] h-3 w-3 rounded-full transition-colors duration-300"
          style={{ backgroundColor: "var(--accent, currentColor)" }}
        />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute inset-0 opacity-30
            [background-image:linear-gradient(to_right,hsl(var(--foreground)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.08)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />
        <div className="absolute left-1/2 top-1/2 h-52 w-72 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-2xl border border-foreground/10 transition-transform duration-700 group-hover:rotate-[-5deg] group-hover:scale-105" />
        <div className="absolute left-1/2 top-1/2 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-xl border border-foreground/10" />
        <div
          className="absolute right-[22%] top-[25%] h-6 w-6 rotate-45 border transition-colors duration-300"
          style={{ borderColor: "var(--accent, currentColor)" }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-72 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-3xl border border-foreground/10 transition-transform duration-700 group-hover:rotate-[33deg] group-hover:scale-105" />
      <div className="absolute left-[58%] top-[48%] h-72 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[28deg] rounded-3xl border border-foreground/10 opacity-50" />
      <div className="absolute left-[-10%] top-[45%] h-px w-[120%] rotate-[28deg] bg-foreground/10" />
      <div
        className="absolute left-[25%] top-[25%] h-4 w-4 rounded-full border transition-colors duration-300"
        style={{ borderColor: "var(--accent, currentColor)" }}
      />
    </div>
  );
}
