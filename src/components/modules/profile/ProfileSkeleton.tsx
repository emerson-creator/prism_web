import { Skeleton } from "@/components/ui/Skeleton";

export function ProfileSkeleton() {
  return (
    <main className="container mx-auto max-w-lg px-4 py-10">
      <Skeleton className="h-7 w-28" />

      <div className="mt-6 flex flex-col gap-5">
        <Skeleton className="h-3.5 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-11 flex-1 rounded-lg" />
          <Skeleton className="h-11 flex-1 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
    </main>
  );
}
