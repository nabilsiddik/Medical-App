import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// 1. Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-3.5 w-36 rounded" />
      </CardContent>
    </Card>
  );
}

// 2. Stats Grid Skeleton
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 3. Chart Card Skeleton
export function ChartCardSkeleton() {
  return (
    <Card className="border border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-3.5 w-56 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

// 4. Data Table Skeleton
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="border-b bg-muted/40 p-4 flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="border-t bg-muted/20 p-4 flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// 5. User Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border border-border/60 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-36 rounded" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
