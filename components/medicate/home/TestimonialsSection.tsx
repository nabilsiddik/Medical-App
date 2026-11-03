"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface TestimonialItem {
  id: string | number;
  name: string;
  role: string;
  photo: string;
  quote: string;
}

const DUMMY_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Nadim Kamal",
    role: "CANCER RESEARCH",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomized words which don't look even believable. There are many variations of passages.",
  },
  {
    id: 2,
    name: "Dr. John Martin",
    role: "NEUROLOGY",
    photo:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomized words which don't look even believable. There are many variations of passages.",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "CARDIOLOGY PATIENT",
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "The precision in diagnostic testing and personalized consultation was second to none. The chamber environment is comfortable, time slots are strictly honored, and medical advice is clear and reassuring.",
  },
  {
    id: 4,
    name: "Michael Evans",
    role: "INTERNAL MEDICINE",
    photo:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "Booking an appointment was effortless. Having digital prescriptions verified online and accessing scheduled follow-ups gave my family complete peace of mind during treatment.",
  },
  {
    id: 5,
    name: "Dr. Farhana Chowdhury",
    role: "PEDIATRIC HEALTHCARE",
    photo:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "The preventive health screening and detailed consultation schedule gave us tremendous clarity. Dr. Sarah's chamber is equipped with modern patient monitoring, and the appointment system eliminates long waiting times.",
  },
  {
    id: 6,
    name: "Tariqul Islam",
    role: "DIABETES & METABOLIC CARE",
    photo:
      "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote:
      "I visited for routine glycemic control and cardiovascular follow-up. The computerized serial tokens and immediate digital prescription delivery to my phone made the entire chamber visit seamless and stress-free.",
  },
];

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Use backend testimonials if available, merged or falling back to high-res dummy slides
  const items: TestimonialItem[] =
    testimonials && testimonials.length >= 4
      ? testimonials.map((t, idx) => ({
          id: t.id || idx,
          name: t.patientName || "Verified Patient",
          role: (t.serviceName || "PATIENT CARE").toUpperCase(),
          photo:
            t.patientPhoto ||
            DUMMY_TESTIMONIALS[idx % DUMMY_TESTIMONIALS.length].photo,
          quote:
            t.reviewText ||
            t.comment ||
            DUMMY_TESTIMONIALS[idx % DUMMY_TESTIMONIALS.length].quote,
        }))
      : DUMMY_TESTIMONIALS;

  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <ScrollReveal delay={0} yOffset={20}>
            <span className="inline-block bg-primary/15 text-primary text-base font-bold tracking-widest uppercase px-4 py-1.5 rounded-sm mb-3">
              OUR CLIENTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2137] tracking-tight">
              Our Happy Clients
            </h2>
          </ScrollReveal>
        </div>

        {/* Swiper Slider */}
        <ScrollReveal delay={0.15} yOffset={24}>
          <div className="testimonial-slider-container relative pb-14">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
              }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={items.length > 2}
              pagination={{
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
              }}
              className="pb-4"
            >
              {items.map((item) => (
                <SwiperSlide key={item.id} className="!h-auto flex">
                  <div className="w-full h-full bg-[#edf2f7] hover:bg-[#e7edf5] transition-colors rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xs border border-slate-200/50">
                    {/* Quote Paragraph */}
                    <p className="text-slate-600 leading-relaxed mb-8 text-base sm:text-lg font-normal flex-1">
                      {item.quote}
                    </p>

                    {/* Client Info Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-300/40 mt-auto">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                        />
                        <div>
                          <h4 className="font-black text-[#0f2137] text-lg sm:text-xl leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-primary font-bold text-base tracking-wider uppercase mt-0.5 block">
                            {item.role}
                          </span>
                        </div>
                      </div>

                      {/* Quotation Mark Graphic */}
                      <div
                        aria-hidden="true"
                        className="text-6xl sm:text-7xl font-serif text-primary/20 select-none leading-none -mt-4"
                      >
                        “
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </ScrollReveal>
      </div>

      {/* Custom Swiper Pagination Styling */}
      <style jsx global>{`
        .testimonial-slider-container .swiper-wrapper {
          display: flex !important;
          align-items: stretch !important;
        }
        .testimonial-slider-container .swiper-slide {
          height: auto !important;
          display: flex !important;
        }
        .testimonial-slider-container .swiper-pagination {
          bottom: 0px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .testimonial-slider-container .custom-bullet {
          display: inline-block;
          width: 16px;
          height: 6px;
          background: #cbd5e1;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .testimonial-slider-container .custom-bullet-active {
          width: 32px;
          background: var(--primary) !important;
        }
      `}</style>
    </section>
  );
}
