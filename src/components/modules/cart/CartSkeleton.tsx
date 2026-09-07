import { Skeleton } from "@/components/ui/Skeleton";

export function CartSkeleton() {
  return (
    <main className="container mx-auto px-4 py-10">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="mt-2 h-4 w-16" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex gap-4 py-5">
              <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-1.5 h-3 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </main>
  );
}
