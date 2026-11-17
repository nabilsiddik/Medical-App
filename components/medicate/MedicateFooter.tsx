"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ChevronRight, ArrowUp } from "lucide-react";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { useBranding } from "@/components/branding/BrandingProvider";

export default function MedicateFooter() {
  const { branding, siteConfig } = useBranding();

  const brandName = branding?.brandName || "Care Medical Chamber";
  const tagline = branding?.brandTagline || "Trusted Clinical Care & Preventive Health";
  const phone = siteConfig?.contact?.phone || siteConfig?.contactPhone || "+880 1700-112233";
  const email = siteConfig?.contact?.email || siteConfig?.contactEmail || "doctor@chamber.com";
  const address = siteConfig?.contact?.address || "Suite 402, Green Crescent Tower, Road 7/A, Dhanmondi, Dhaka";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0e2942] text-slate-300 relative text-base">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Dynamic Brand Info */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center">
              <div className="bg-white/95 rounded-lg px-3 py-1.5 shadow-sm inline-flex items-center">
                <Image
                  src={branding?.logoUrl || "/images/logo/site-logo.png"}
                  alt={brandName}
                  width={200}
                  height={60}
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-base text-slate-300 leading-relaxed">
              {tagline}. Dedicated to providing evidence-based outpatient consultations, verified digital prescriptions, and compassionate care.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded bg-[#13385a] hover:bg-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded bg-[#13385a] hover:bg-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded bg-[#13385a] hover:bg-primary flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary">
              Our Services
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-base text-slate-300">
              <Link href="/services" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> About Us
              </Link>
              <Link href="/contact" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> Contact Us
              </Link>
              <Link href="/services" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> Services
              </Link>
              <Link href="/book" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> Bookings
              </Link>
              <Link href="/blog" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> Articles
              </Link>
              <Link href="/contact" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary" /> Chamber
              </Link>
            </div>
          </div>

          {/* Column 3: Chambers & Operating Times */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary">
              Visiting Hours
            </h4>
            <div className="space-y-3 text-base text-slate-300">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Saturday – Thursday:</span>
                <span className="font-semibold text-white">05:00 PM - 09:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Friday:</span>
                <span className="font-semibold text-amber-400">By Appointment</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Emergency Hotline:</span>
                <span className="font-semibold text-emerald-400">24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Chamber Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-primary">
              Chamber Info
            </h4>
            <div className="space-y-3 text-base text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-slate-400">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">{brandName}</span>. All Rights Reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full bg-[#13385a] group-hover:bg-primary flex items-center justify-center text-white transition-colors">
              <ArrowUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
