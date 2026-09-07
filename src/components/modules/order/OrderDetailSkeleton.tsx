import { Skeleton } from "@/components/ui/Skeleton";

export function OrderDetailSkeleton() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Skeleton className="h-4 w-24" />

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-3.5 w-32" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4">
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-4 h-14 w-full rounded-2xl" />
    </main>
  );
}
