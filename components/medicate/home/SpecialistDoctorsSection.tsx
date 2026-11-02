"use client";

import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

export default function SpecialistDoctorsSection() {
  const doctors = [
    {
      name: "Prof. Dr. Sarah Rahman",
      role: "Senior Consultant Physician & Cardiologist",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dr. Michael Chen",
      role: "Consultant Orthopedic & Sports Medicine",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dr. Emily Watson",
      role: "Clinical Diagnostics & Preventive Medicine",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="doctors" className="py-20 md:py-28 bg-[#f8fafd]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-[#1673b8] font-bold text-sm tracking-widest uppercase mb-2">
          OUR TEAM
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c2e] mb-14">
          Meet Our Specialist Doctors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {doctors.map((doc, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.15}
              className="bg-white rounded-sm overflow-hidden border border-slate-200/70 shadow-xs hover:shadow-lg transition-all group h-full flex flex-col justify-between"
            >
              {/* Doctor Image with fallback on error */}
              <div className="relative h-80 overflow-hidden bg-slate-100">
                <img
                  src={doc.image}
                  alt={doc.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80";
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Name & Specialty */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#0b1c2e] mb-1">
                  {doc.name}
                </h3>
                <p className="text-sm text-[#1673b8] font-semibold tracking-wider uppercase mb-4">
                  {doc.role}
                </p>

                {/* Social icons */}
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#1673b8] hover:text-white hover:border-[#1673b8] transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="h-3 w-3" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#1673b8] hover:text-white hover:border-[#1673b8] transition-colors"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="h-3 w-3" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#1673b8] hover:text-white hover:border-[#1673b8] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
