import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function UserDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-7xl mx-auto">
      {/* 1. Welcome Profile Banner Skeleton */}
      <div className="p-6 rounded-2xl bg-muted/60 border border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted shrink-0" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted/70" />
          </div>
        </div>
        <div className="h-11 w-44 rounded-xl bg-primary/20 shrink-0" />
      </div>

      {/* 2. Key Metrics Row Skeleton (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-2xl border-border/70 shadow-xs bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-28 rounded bg-muted/70" />
              <div className="h-8 w-8 rounded-xl bg-muted" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-7 w-16 rounded-lg bg-muted" />
              <div className="h-3 w-36 rounded bg-muted/50" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Two-Column Dashboard Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Column Skeleton */}
        <Card className="rounded-2xl border-border/80 shadow-xs bg-card/70">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted/60" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-36 rounded bg-muted" />
                  <div className="h-3 w-48 rounded bg-muted/50" />
                </div>
                <div className="h-6 w-20 rounded-full bg-muted/60" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prescriptions Column Skeleton */}
        <Card className="rounded-2xl border-border/80 shadow-xs bg-card/70">
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted/60" />
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 rounded bg-muted font-mono" />
                  <div className="h-3 w-44 rounded bg-muted/50" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-muted/70" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
