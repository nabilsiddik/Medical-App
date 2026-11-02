"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

function CounterNumber({ target, inView, suffix = "" }: { target: number; inView: boolean; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 1600;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [inView, target]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export default function MedicalHealthCareSection() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Dynamic Primary Info Block */}
        <div className="bg-primary text-primary-foreground p-10 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="max-w-xl lg:ml-auto space-y-6">
            <ScrollReveal delay={0} yOffset={20}>
              <span className="inline-block text-primary-foreground/80 font-bold text-base tracking-widest uppercase mb-3">
                SPECIAL SERVICES
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                A Great Piece Of Medical Health Care
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.12} yOffset={20}>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed">
                Our clinical practice delivers continuous care across diagnostic medicine, targeted therapies, and preventive regimens. Every treatment protocol is formulated to maximize patient recovery with safety and precision.
              </p>
            </ScrollReveal>

            {/* Stat Counters with Animated Count-Up */}
            <div ref={statsRef} className="border-t border-white/20 pt-8">
              <ScrollReveal delay={0.24} yOffset={20}>
                <div className="flex items-center gap-14">
                  <div>
                    <span className="block text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                      <CounterNumber target={85} inView={isInView} suffix="+" />
                    </span>
                    <span className="text-base font-semibold text-primary-foreground/85 tracking-wider uppercase mt-1 block">
                      Medical Specialists
                    </span>
                  </div>

                  <div>
                    <span className="block text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                      <CounterNumber target={1205} inView={isInView} suffix="+" />
                    </span>
                    <span className="text-base font-semibold text-primary-foreground/85 tracking-wider uppercase mt-1 block">
                      Happy Patients
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Right Side: Doctor Image with Smooth Scroll Reveal */}
        <div className="relative min-h-[380px] lg:min-h-[500px] bg-slate-100 overflow-hidden">
          <ScrollReveal delay={0.15} yOffset={20} className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
              alt="Doctor examining clinical charts"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
