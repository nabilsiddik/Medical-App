"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ChevronRight, ArrowUp } from "lucide-react";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaPinterestP } from "react-icons/fa";

export default function MedicateFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0e2942] text-slate-300 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#1673b8] flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Medicate
              </span>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed">
              It helps designers plan out where the content will sit, the content to be written and approved. Providing specialized clinical treatments and patient care.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#13385a] hover:bg-[#1673b8] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-3 w-3" />
              </a>
              <a
                href="https://plus.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#13385a] hover:bg-[#1673b8] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Google Plus"
              >
                <FaGooglePlusG className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#13385a] hover:bg-[#1673b8] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-3 w-3" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded bg-[#13385a] hover:bg-[#1673b8] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Our Services / Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#1673b8]">
              Our Services
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-300">
              <Link href="/services" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> About Us
              </Link>
              <Link href="/contact" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Contact Us
              </Link>
              <Link href="/services" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Our Services
              </Link>
              <Link href="/services" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Our Process
              </Link>
              <Link href="/#doctors" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Specialist Doctor
              </Link>
              <Link href="/#faq" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> FAQ
              </Link>
              <Link href="/book" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Appointments
              </Link>
              <Link href="/services" className="hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="h-3 w-3 text-[#1673b8]" /> Departments
              </Link>
            </div>
          </div>

          {/* Column 3: Recent Posts */}
          <div>
            <h4 className="text-base font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#1673b8]">
              Recent Posts
            </h4>
            <div className="space-y-4">
              <Link href="/blog" className="flex items-start gap-3 group">
                <div className="w-16 h-14 rounded overflow-hidden relative shrink-0 bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&q=80"
                    alt="Post thumbnail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    DECEMBER 13, 2025
                  </span>
                  <p className="text-xs font-semibold text-white group-hover:text-[#1673b8] transition-colors line-clamp-2">
                    Get The Exercise Limited Mobility
                  </p>
                </div>
              </Link>

              <Link href="/blog" className="flex items-start gap-3 group">
                <div className="w-16 h-14 rounded overflow-hidden relative shrink-0 bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80"
                    alt="Post thumbnail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    DECEMBER 13, 2025
                  </span>
                  <p className="text-xs font-semibold text-white group-hover:text-[#1673b8] transition-colors line-clamp-2">
                    Transfusion Strategy And Heart Surgery
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#1673b8]">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#1673b8] shrink-0" />
                <span>+1800-001-658</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#1673b8] shrink-0" />
                <span>info@peacefulthemes.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#1673b8] shrink-0 mt-0.5" />
                <span>Themeforest, Envato HQ 24 Fifth st., Los Angeles, USA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#091e32] py-4 text-xs text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-center sm:text-left">
            Copyright 2026 medicate All Rights Reserved
          </p>
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded bg-[#1673b8] hover:bg-[#0f5991] flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
