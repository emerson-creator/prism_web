import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-20 grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold leading-tight text-foreground">
            Technology, made clear.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-md">
            Prism curates smart gadgets and everyday tech essentials —
            thoughtfully designed, built to last, priced fairly.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Shop the catalog
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Browse collections
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <PrismMark />
        </div>
      </div>
    </section>
  );
}

function PrismMark() {
  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full max-w-sm"
      role="img"
      aria-label="Beam of light passing through a prism"
    >
      <line
        x1="10"
        y1="120"
        x2="130"
        y2="120"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      <polygon
        points="130,60 190,120 130,180"
        fill="none"
        stroke="var(--color-foreground)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="160"
        y1="120"
        x2="300"
        y2="70"
        stroke="var(--color-accent)"
        strokeWidth="2"
        opacity="0.9"
      />
      <line
        x1="160"
        y1="120"
        x2="300"
        y2="100"
        stroke="var(--color-accent)"
        strokeWidth="2"
        opacity="0.65"
      />
      <line
        x1="160"
        y1="120"
        x2="300"
        y2="130"
        stroke="var(--color-accent)"
        strokeWidth="2"
        opacity="0.4"
      />
      <line
        x1="160"
        y1="120"
        x2="300"
        y2="160"
        stroke="var(--color-accent)"
        strokeWidth="2"
        opacity="0.25"
      />
    </svg>
  );
}
