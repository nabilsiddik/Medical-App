"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface DemoNoticeBannerProps {
  role?: string;
  userEmail?: string;
}

export default function DemoNoticeBanner({ role, userEmail }: DemoNoticeBannerProps) {
  const isDoctor = role === "ADMIN" || role === "SUPER_ADMIN" || role === "DOCTOR";

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:via-sky-950/30 dark:to-emerald-950/30 p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-foreground">
                Live Demo Preview ({isDoctor ? "Doctor Portal" : "Patient Portal"})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Read-Only
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are exploring the live software in preview mode. To preserve sample data for doctors, creating, editing, and deleting records is disabled.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-1 md:pt-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all uppercase tracking-wider"
          >
            <span>Buy / Inquire Website</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

