"use client";

import React from "react";
import Link from "next/link";
import { Phone, Calendar, Clock, Stethoscope, Activity, ClipboardList, ShieldAlert, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

interface HeroThreeCardsSectionProps {
  emergencyPhone?: string;
  inquiryPhone?: string;
}

export default function HeroThreeCardsSection({
  emergencyPhone = "+880 1700-112233",
  inquiryPhone = "987 654 321",
}: HeroThreeCardsSectionProps) {
  const displayPhone = emergencyPhone || inquiryPhone || "987 654 321";

  return (
    <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden gap-5">
        {/* CARD 1: Emergency Cases (Primary Blue #1673b8) */}
        <ScrollReveal delay={0} yOffset={24} className="h-full">
          <div className="bg-[#1673b8] text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] h-full group transition-transform rounded-2xl shadow-lg">
            {/* Subtle Watermark Icon in Top-Right */}
            <div className="absolute -top-3 -right-3 text-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert className="w-36 h-36" strokeWidth={1} />
            </div>

            <div>
              {/* Outline Icon */}
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-white">
                <Stethoscope className="w-10 h-10 stroke-[1.75]" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
                Emergency Cases
              </h3>

              <p className="text-white/85 text-base leading-relaxed mb-6 font-normal">
                Prompt medical triage and immediate clinical guidance available for acute emergencies and urgent consultations.
              </p>
            </div>

            {/* Emergency Phone Button */}
            <div className="pt-2">
              <a
                href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-3.5 group/phone text-white hover:text-white/90 transition-colors"
              >
                <span className="w-12 h-12 rounded-full bg-white text-[#1673b8] flex items-center justify-center shadow-md group-hover/phone:scale-105 transition-transform shrink-0">
                  <Phone className="w-6 h-6 stroke-[2.5]" />
                </span>
                <span className="text-xl lg:text-2xl font-black tracking-wide font-mono">
                  {displayPhone}
                </span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* CARD 2: Doctors Timetable (Dark Navy #0b1c2e) */}
        <ScrollReveal delay={0.12} yOffset={24} className="h-full">
          <div className="bg-[#0b1c2e] text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] h-full group transition-transform border border-white/10 rounded-2xl shadow-lg">
            {/* Subtle Watermark Icon in Top-Right */}
            <div className="absolute -top-3 -right-3 text-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-36 h-36" strokeWidth={1} />
            </div>

            <div>
              {/* Outline Icon */}
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-white">
                <Calendar className="w-10 h-10 stroke-[1.75]" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mb-3">
                Doctors Timetable
              </h3>

              <p className="text-white/80 text-base leading-relaxed mb-6 font-normal">
                Review specialized consultation schedules, chamber locations, and book your verified slot in our digital queue.
              </p>
            </div>

            {/* Timetable Button */}
            <div className="pt-2">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base tracking-wider uppercase shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
              >
                <span>TIMETABLE +</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* CARD 3: Opening Hours (Primary Blue #1673b8) */}
        <ScrollReveal delay={0.24} yOffset={24} className="h-full">
          <div className="bg-[#1673b8] text-white p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] h-full group transition-transform rounded-2xl shadow-lg">
            {/* Subtle Watermark Icon in Top-Right */}
            <div className="absolute -top-3 -right-3 text-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
              <Activity className="w-36 h-36" strokeWidth={1} />
            </div>

            <div>
              {/* Outline Icon */}
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-white">
                <ClipboardList className="w-10 h-10 stroke-[1.75]" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">
                Opening Hours
              </h3>

              {/* Timetable List */}
              <div className="space-y-3 text-base font-medium">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/20 text-white/90">
                  <span>Monday - Friday</span>
                  <span className="font-mono text-white font-bold">8:00 - 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-white/20 text-white/90">
                  <span>Saturday</span>
                  <span className="font-mono text-white font-bold">6:00 - 5:00 PM</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-white/20 text-white/90">
                  <span>Sunday</span>
                  <span className="font-mono text-white font-bold">9:00 - 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-white">
                  <span className="font-bold">Emergency Hotline</span>
                  <span className="font-mono bg-white/20 px-2.5 py-0.5 rounded-md font-bold text-sm tracking-wider uppercase">
                    24HRS 7Days
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2"></div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
