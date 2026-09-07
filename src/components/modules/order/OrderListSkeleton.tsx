import { Skeleton } from "@/components/ui/Skeleton";

export function OrdersListSkeleton() {
  return (
    <main className="container mx-auto px-4 py-10">
      <Skeleton className="h-7 w-32" />

      <ul className="mt-8 divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-4 py-5">
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-40" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-14" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
