"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console for now; wire up to an error-tracking
    // service (Sentry, etc.) here when one is set up.
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <span className="text-xl text-red-500">!</span>
      </div>

      <h1 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">
        An unexpected error occurred. You can try again, or head back home.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-11 items-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-11 items-center rounded-full border border-border px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
