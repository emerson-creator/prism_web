import Link from "next/link";

export const metadata = {
  title: "About | Prism",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <PrismGlyph />

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground">
        About Prism
      </h1>

      <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          Prism started with a simple idea: the best technology shouldn&apos;t
          need to shout. Every product in our catalog is chosen for what it does
          well, not for how much noise it makes doing it.
        </p>
        <p>
          Our name comes from what a prism actually does — it takes something
          singular and reveals everything it was made of all along. That&apos;s
          the standard we hold every product to: clear, considered, and built to
          last longer than the hype cycle around it.
        </p>
        <p>
          We&apos;re a small team obsessed with the details other stores skip —
          real specs, honest photos, and support from people who actually use
          what we sell.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <Link
          href="/products"
          className="flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Shop the catalog
        </Link>
        <Link
          href="/collections"
          className="flex h-11 items-center rounded-full border border-border px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          Browse collections
        </Link>
      </div>
    </main>
  );
}

function PrismGlyph() {
  return (
    <svg
      width="40"
      height="37"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground/20"
    >
      <path
        d="M9 12L1 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M9 3L16.5 12L9 21Z" fill="currentColor" />
      <path
        d="M16.5 12L25 6.5"
        stroke="#6366f1"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16.5 12L25 12"
        stroke="#ec4899"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16.5 12L25 17.5"
        stroke="#f59e0b"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
