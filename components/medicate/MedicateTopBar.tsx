import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaPinterestP, FaTwitter } from "react-icons/fa";

interface MedicateTopBarProps {
  phone?: string;
  email?: string;
}

export default function MedicateTopBar({
  phone = "+1800-001-658",
  email = "info@peacefulthemes.com",
}: MedicateTopBarProps) {
  return (
    <div className="bg-[#0b1c2e] text-slate-300 text-xs py-2.5 border-b border-white/10 hidden sm:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-[#1673b8]" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-[#1673b8]" />
            <span>{email}</span>
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
            <FaFacebookF className="h-3 w-3" />
          </a>
          <a
            href="https://plus.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Google Plus"
          >
            <FaGooglePlusG className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-3 w-3" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Pinterest"
          >
            <FaPinterestP className="h-3 w-3" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
