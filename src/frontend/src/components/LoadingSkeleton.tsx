import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_KEYS = Array.from({ length: 20 }, (_, i) => `sk-${i}`);

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SKELETON_KEYS.slice(0, count).map((k) => (
        <div
          key={k}
          className="rounded-lg border border-border bg-card p-6 space-y-4"
        >
          <Skeleton className="h-4 w-3/4 bg-secondary" />
          <Skeleton className="h-3 w-1/2 bg-secondary" />
          <Skeleton className="h-3 w-2/3 bg-secondary" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {SKELETON_KEYS.slice(0, rows).map((k) => (
        <div key={k} className="flex gap-4 p-4 rounded-md border border-border">
          <Skeleton className="h-4 w-8 bg-secondary" />
          <Skeleton className="h-4 w-36 bg-secondary" />
          <Skeleton className="h-4 w-12 bg-secondary ml-auto" />
          <Skeleton className="h-4 w-12 bg-secondary" />
          <Skeleton className="h-4 w-12 bg-secondary" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="w-full h-[400px] rounded-lg bg-card animate-pulse" />;
}
