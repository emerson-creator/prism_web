import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <PrismMark />

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-foreground">
        This page split off somewhere
      </h1>
      <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">
        We couldn&apos;t find what you were looking for. It may have moved, or
        never existed.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/products"
          className="flex h-11 items-center rounded-full border border-border px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          Browse products
        </Link>
      </div>
    </main>
  );
}

/** Same prism mark from the Header, static (no hover state needed here). */
function PrismMark() {
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
