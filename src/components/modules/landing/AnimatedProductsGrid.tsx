// components/modules/landing/AnimatedProductsGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Product } from "@/libs/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function AnimatedProductsGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-6 md:grid-cols-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {products.map((p) => (
        <motion.div key={p.id} variants={item}>
          <Link
            href={`/products/${p.id}`}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-background transition-colors duration-300 group-hover:border-foreground/30">
              {p.imageUrl && (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              {currency.format(p.price)}
            </p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
