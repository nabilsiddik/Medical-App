"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

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
];

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Use backend testimonials if available, merged or falling back to high-res dummy slides
  const items: TestimonialItem[] =
    testimonials && testimonials.length >= 2
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
          <span className="inline-block bg-[#dceaf8] text-[#1a73e8] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-sm mb-3">
            OUR CLIENTS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2137] tracking-tight">
            Our Client Happy Say About Us
          </h2>
        </div>

        {/* Swiper Slider */}
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
            loop={true}
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            className="pb-4"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="h-full bg-[#edf2f7] hover:bg-[#e7edf5] transition-colors rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xs border border-slate-200/50">
                  {/* Quote Paragraph */}
                  <p className="text-slate-600 leading-relaxed mb-8 text-base sm:text-lg font-normal">
                    {item.quote}
                  </p>

                  {/* Client Info Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-300/40">
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
                        <span className="text-[#1a73e8] font-bold text-xs tracking-wider uppercase mt-0.5 block">
                          {item.role}
                        </span>
                      </div>
                    </div>

                    {/* Quotation Mark Graphic */}
                    <div
                      aria-hidden="true"
                      className="text-6xl sm:text-7xl font-serif text-[#1a73e8]/20 select-none leading-none -mt-4"
                    >
                      “
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Custom Swiper Pagination Styling */}
      <style jsx global>{`
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
          background: #1a73e8;
        }
      `}</style>
    </section>
  );
}
