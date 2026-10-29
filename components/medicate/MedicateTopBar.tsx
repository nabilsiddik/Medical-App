"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaPinterestP, FaTwitter } from "react-icons/fa";
import { useBranding } from "@/components/branding/BrandingProvider";

interface MedicateTopBarProps {
  phone?: string;
  email?: string;
}

export default function MedicateTopBar({ phone, email }: MedicateTopBarProps) {
  const { siteConfig } = useBranding();

  const displayPhone =
    phone ||
    siteConfig?.contact?.phone ||
    siteConfig?.contactPhone ||
    "+880 1700-112233";

  const displayEmail =
    email ||
    siteConfig?.contact?.email ||
    siteConfig?.contactEmail ||
    "doctor@chamber.com";

  return (
    <div className="bg-[#0b1c2e] text-slate-300 text-base py-2.5 border-b border-white/10 hidden sm:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Dynamic Contact Info */}
        <div className="flex items-center gap-6">
          <a
            href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span>{displayPhone}</span>
          </a>
          <a
            href={`mailto:${displayEmail}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4 text-primary" />
            <span>{displayEmail}</span>
          </a>
        </div>

        {/* Right: Social Media Links */}
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <FaFacebookF className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-4 w-4" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Pinterest"
          >
            <FaPinterestP className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
