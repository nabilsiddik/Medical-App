"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBranding } from "./branding/BrandingProvider";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const { branding } = useBranding();

  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const brandName = branding?.brandName || "Dr. Sarah's Care Chamber";
  // Split name for visual distinction
  const parts = brandName.split(" ");
  const mainPart = parts.slice(0, 2).join(" ");
  const restPart = parts.slice(2).join(" ");

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95",
        className
      )}
    >
      <div
        className={cn(
          "rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-all duration-300",
          iconSizes[size]
        )}
      >
        <Activity className="h-5 w-5" />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-[280px]",
              textSizes[size]
            )}
          >
            {mainPart}{" "}
            {restPart && (
              <span className="text-primary font-medium">{restPart}</span>
            )}
          </span>
          {branding?.brandTagline && size !== "sm" && (
            <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">
              {branding.brandTagline}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default Logo;
