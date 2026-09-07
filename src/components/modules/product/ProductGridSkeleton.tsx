import { Skeleton } from "@/components/ui/Skeleton";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
