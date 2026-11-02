import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardCommonLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-7xl mx-auto py-2">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-2">
          <div className="h-8 w-60 rounded-xl bg-muted" />
          <div className="h-4 w-80 rounded-lg bg-muted/60" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-muted/70" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-2xl border-border/70 shadow-xs bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
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

      {/* Main Content Area Skeleton */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-card/70 overflow-hidden">
        <div className="p-6 border-b border-border/60 flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-9 w-28 rounded-xl bg-muted/60" />
        </div>
        <div className="divide-y divide-border/50 p-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-56 rounded bg-muted/50" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-muted/60" />
              <div className="h-8 w-20 rounded-lg bg-muted/70" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

