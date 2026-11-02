import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-7xl mx-auto">
      {/* 1. Header Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-muted" />
          <div className="h-4 w-96 rounded-lg bg-muted/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 rounded-xl bg-muted/70" />
          <div className="h-10 w-36 rounded-xl bg-primary/20" />
        </div>
      </div>

      {/* 2. Top Metric KPI Cards Skeleton (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-2xl border-border/70 shadow-xs bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 w-24 rounded bg-muted/70" />
              <div className="h-8 w-8 rounded-xl bg-muted" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-7 w-20 rounded-lg bg-muted" />
              <div className="h-3 w-32 rounded bg-muted/50" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Main Data Card / Table Skeleton */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-card/70 overflow-hidden">
        {/* Search & Filter Toolbar Skeleton */}
        <div className="p-4 sm:p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="h-10 w-full sm:w-72 rounded-xl bg-muted/70" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-24 rounded-xl bg-muted/60" />
            <div className="h-10 w-28 rounded-xl bg-muted/60" />
          </div>
        </div>

        {/* Data Rows Skeleton */}
        <div className="divide-y divide-border/50">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-56 rounded bg-muted/50" />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <div className="h-4 w-28 rounded bg-muted/60" />
                <div className="h-6 w-20 rounded-full bg-muted/70" />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-16 rounded-lg bg-muted/60" />
                <div className="h-8 w-8 rounded-lg bg-muted/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination Skeleton */}
        <div className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-muted/60" />
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8 rounded-lg bg-muted/70" />
            <div className="h-8 w-8 rounded-lg bg-muted/70" />
            <div className="h-8 w-8 rounded-lg bg-muted/70" />
          </div>
        </div>
      </Card>
    </div>
  );
}

