/**
 * Base skeleton block. Composes into page-specific skeletons below.
 * Uses a subtle shimmer instead of a flat pulse for a more polished feel.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-lg bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        className,
      ].join(" ")}
    />
  );
}
