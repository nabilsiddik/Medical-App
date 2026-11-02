"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

interface SkillItem {
  label: string;
  percent: number;
}

function AnimatedCounter({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 1600; // ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo for a premium clinical countdown effect
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [inView, target]);

  return <span>{count}%</span>;
}

export default function ProtectLifeSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const skills: SkillItem[] = [
    { label: "Heart Rate & Cardiology Care", percent: 85 },
    { label: "Diagnostic Accuracy & Screening", percent: 95 },
    { label: "Post-Treatment Patient Recovery", percent: 90 },
  ];

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Text & Animated Progress Bars */}
          <div ref={containerRef} className="lg:col-span-6 space-y-6">
            <ScrollReveal delay={0} yOffset={20}>
              <span className="inline-block text-primary font-bold text-base tracking-widest uppercase">
                FEATURE
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] leading-tight mt-2">
                We Protect You In Any Sphere Of Life
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.12} yOffset={20}>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Our clinical protocol is built on preventive medicine and personalized therapeutic pathways. We combine evidence-based clinical assessments with patient-centered communication to optimize outcomes across all ages.
              </p>
            </ScrollReveal>

            {/* Animated Progress / Skill Bars */}
            <div className="space-y-6 pt-3">
              {skills.map((s, idx) => (
                <ScrollReveal key={idx} delay={0.18 + idx * 0.1} yOffset={18}>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-base font-bold text-[#0b1c2e]">
                      <span>{s.label}</span>
                      <span className="text-primary font-mono text-lg font-black">
                        <AnimatedCounter target={s.percent} inView={isInView} />
                      </span>
                    </div>

                    {/* Enhanced Bar: Increased height (h-4) with smooth progress fill */}
                    <div className="h-4 w-full bg-[#eaedf2] rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-[#258bd6] rounded-full transition-all duration-[1600ms] ease-out shadow-xs"
                        style={{
                          width: isInView ? `${s.percent}%` : "0%",
                          transitionDelay: `${idx * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right: Consultation Photo */}
          <div className="lg:col-span-6">
            <ScrollReveal delay={0.2} yOffset={24}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                  alt="Doctor consulting with patient"
                  className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
