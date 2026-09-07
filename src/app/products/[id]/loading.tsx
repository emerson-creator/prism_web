import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-2/3" />
          <Skeleton className="mt-4 h-6 w-24" />

          <div className="mt-6 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>

          <Skeleton className="mt-8 h-12 w-full rounded-full" />
        </div>
      </div>
    </main>
  );
}
