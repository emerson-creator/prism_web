"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const headline = ["See technology,", "refracted clearly."];

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="relative flex flex-col hero:block hero:h-[92vh] hero:min-h-[640px]">
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[42vh] min-h-[300px] w-full overflow-hidden hero:absolute hero:inset-0 hero:h-full hero:min-h-0"
        >
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src="/hero__.jpg"
              alt="Person wearing Prism headphones, facing right toward the headline"
              fill
              priority
              sizes="100vw"
              className="scale-x-[-1] object-cover object-[50%_top] hero:object-[68%_top]"
            />
          </motion.div>

          {/* Scrims only make sense once text sits on top of the image —
              desktop only */}
          <div className="hidden hero:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background/70 to-transparent" />
          <div className="hidden hero:block absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-background via-background/85 to-transparent" />
          <div className="hidden hero:block absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/60 to-transparent" />

          {/* Spectrum glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] top-[38%] h-72 w-72 opacity-50 blur-3xl hero:left-[14%]"
            style={{
              background:
                "radial-gradient(closest-side, #6366f1 0%, #ec4899 45%, #f59e0b 75%, transparent 100%)",
            }}
          />

          {/* Gaze line — desktop only, needs the wide overlay stage */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden h-full w-full hero:block"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="30%"
              y1="30%"
              x2="58%"
              y2="24%"
              stroke="url(#gazeGradient)"
              strokeWidth="1.5"
              strokeDasharray="1 7"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gazeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Text column — flows below the image on mobile with a solid
            background; becomes the absolute overlay column on desktop */}
        <div className="relative z-10 bg-background px-6 py-10 hero:absolute hero:inset-0 hero:flex hero:h-full hero:items-start hero:justify-end hero:bg-transparent hero:py-0 hero:pl-[56%] hero:pr-14 hero:pt-[16vh] lg:pr-20">
          <div className="max-w-xs hero:max-w-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5"
            >
              <BeamMark />
              <span className="text-xs font-medium text-muted-foreground">
                Curated tech, since day one
              </span>
            </motion.div>

            <h1 className="mt-5 font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1] tracking-tight text-foreground">
              {headline.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.15 + i * 0.09,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 max-w-xs text-base text-muted-foreground hero:text-lg"
            >
              Prism curates smart gadgets and everyday tech essentials —
              thoughtfully designed, built to last, priced fairly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop the catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Browse collections
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            >
              <span>Free shipping over $75</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>30-day returns</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>2-year warranty</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeamMark() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10L1 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="text-foreground/50"
      />
      <path
        d="M7 2L13 10L7 18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground/70"
      />
      <path
        d="M13 10L21 4.5"
        stroke="#6366f1"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 10L21 10"
        stroke="#ec4899"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13 10L21 15.5"
        stroke="#f59e0b"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
