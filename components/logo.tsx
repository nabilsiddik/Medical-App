"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBranding } from "./branding/BrandingProvider";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const { branding } = useBranding();

  const brandName = branding?.brandName || "Nabils Chamber";
  const logoSrc = branding?.logoUrl || "/images/logo/site-logo.png";

  const sizeStyles = {
    sm: "h-8 sm:h-9 w-auto max-w-[160px]",
    md: "h-10 sm:h-12 w-auto max-w-[210px]",
    lg: "h-13 sm:h-16 w-auto max-w-[280px]",
  };

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 group transition-opacity hover:opacity-95 shrink-0",
        className
      )}
    >
      <div className="relative flex items-center">
        <Image
          src={logoSrc}
          alt={brandName}
          width={200}
          height={65}
          className={cn("object-contain", sizeStyles[size])}
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
