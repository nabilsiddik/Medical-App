"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

interface HeroSlide {
  id: number;
  subtitle: string;
  title: string;
  description: string;
  bgImage: string;
  buttonText: string;
  buttonLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    subtitle: "GREAT EXPERIENCE IN BUILDING",
    title: "Orthopedic Treatment & Acute Pain Relief",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Evidence-based care tailored to your recovery.",
    bgImage:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000&auto=format&fit=crop",
    buttonText: "BOOK APPOINTMENT",
    buttonLink: "/book",
  },
  {
    id: 2,
    subtitle: "SPECIALIZED MEDICAL CARE",
    title: "Cardiology & Comprehensive Heart Health",
    description:
      "Advanced cardiovascular evaluations, preventative heart screenings, and continuous patient support designed for lifelong cardiac wellness and vitality.",
    bgImage:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
    buttonText: "BOOK APPOINTMENT",
    buttonLink: "/book",
  },
  {
    id: 3,
    subtitle: "MODERN CLINICAL DIAGNOSTICS",
    title: "Compassionate Family Healthcare & Checkups",
    description:
      "Dedicated to delivering personalized medical care with cutting-edge diagnostics, patient education, and compassionate bedside manner across all chambers.",
    bgImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop",
    buttonText: "BOOK APPOINTMENT",
    buttonLink: "/book",
  },
];

interface HeroSectionProps {
  doctorName?: string;
  tagline?: string;
}

export default function HeroSection({
  doctorName = "Prof. Dr. Sarah Rahman",
  tagline,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative w-full min-h-[600px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[780px] bg-slate-100 overflow-hidden select-none">
      {/* Full Hero Swiper Slider */}
      <Swiper
        modules={[EffectFade, Autoplay, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full h-full min-h-[600px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[780px]"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide
              key={slide.id}
              className="relative w-full h-full min-h-[600px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[780px] flex items-center"
            >
              {/* Background Image Layer using high-performance <img> */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={slide.bgImage}
                  alt={slide.title}
                  className="w-full h-full object-cover object-right md:object-center pointer-events-none select-none"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              {/* Gradient Overlay for Crisp Text Readability on Left */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10 sm:from-white/95 sm:via-white/75 sm:to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent md:hidden pointer-events-none" />

              {/* Slide Content with Framer Motion Right-to-Left Animation */}
              <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 w-full flex items-center pt-16 sm:pt-20 pb-28 sm:pb-36 md:pb-40">
                <div className="max-w-2xl">
                  {isActive && (
                    <motion.div
                      key={`content-${slide.id}-${activeIndex}`}
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.12,
                            delayChildren: 0.05,
                          },
                        },
                      }}
                      className="space-y-4 sm:space-y-5"
                    >
                      {/* Subtitle Badge (Animates Right to Left) */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 70 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.6,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                      >
                        <span className="inline-block bg-[#1673b8]/15 border border-[#1673b8]/20 text-[#1673b8] font-bold text-xs sm:text-sm tracking-wider uppercase px-4 py-2 rounded-[3px]">
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Main Title (Animates Right to Left) */}
                      <motion.h1
                        variants={{
                          hidden: { opacity: 0, x: 80 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.7,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#0b1c2e] leading-[1.15] tracking-tight"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Description Paragraph (Animates Right to Left) */}
                      <motion.p
                        variants={{
                          hidden: { opacity: 0, x: 90 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.8,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                        className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl font-normal"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Book Appointment Button (Animates Right to Left) */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 100 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.85,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                        className="pt-2 sm:pt-4"
                      >
                        <Link href={slide.buttonLink}>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2.5 bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-sm sm:text-base uppercase tracking-wider h-13 sm:h-14 px-9 rounded-[4px] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98 group"
                          >
                            <span>{slide.buttonText}</span>
                            <Plus className="h-4 w-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
                          </button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Floating Left Navigation Arrow Button */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 bg-white/70 hover:bg-white text-slate-800 hover:text-[#1673b8] backdrop-blur-md flex items-center justify-center rounded-[3px] border border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
      >
        <ChevronLeft className="h-6 w-6 stroke-[2.2] group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Floating Right Navigation Arrow Button */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 bg-white/70 hover:bg-white text-slate-800 hover:text-[#1673b8] backdrop-blur-md flex items-center justify-center rounded-[3px] border border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
      >
        <ChevronRight className="h-6 w-6 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators / Dots at bottom right */}
      <div className="absolute right-8 sm:right-16 bottom-24 sm:bottom-28 md:bottom-32 z-20 hidden sm:flex items-center gap-2">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => swiperRef.current?.slideToLoop(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? "w-8 bg-[#1673b8]"
                : "w-2.5 bg-slate-400/50 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
