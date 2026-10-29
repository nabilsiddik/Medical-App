"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { User, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { IBlogPost } from "@/types/doctor.interface";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const DUMMY_BLOGS = [
  {
    id: "blog-1",
    title: "Get The Exercise Limited Mobility",
    slug: "get-the-exercise-limited-mobility",
    summary:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    coverImage:
      "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800",
    authorName: "Dr. Sarah Jenkins",
    publishedAt: "2026-10-17T09:00:00Z",
    formattedDate: "DECEMBER 17, 2026",
    category: "Rehabilitation",
  },
  {
    id: "blog-2",
    title: "Transfusion Strategy And Heart Surgery",
    slug: "transfusion-strategy-and-heart-surgery",
    summary:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    coverImage:
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800",
    authorName: "Dr. John Martin",
    publishedAt: "2026-10-05T10:00:00Z",
    formattedDate: "DECEMBER 5, 2026",
    category: "Cardiology",
  },
  {
    id: "blog-3",
    title: "Latest Equipment For The Heart Treatment",
    slug: "latest-equipment-for-the-heart-treatment",
    summary:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    coverImage:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
    authorName: "Dr. Sarah Jenkins",
    publishedAt: "2026-10-05T10:30:00Z",
    formattedDate: "DECEMBER 5, 2026",
    category: "Cardiology",
  },
  {
    id: "blog-4",
    title: "Preventive Cardiac Care & Nutrition Guidelines",
    slug: "preventive-cardiac-care-nutrition-guidelines",
    summary:
      "Essential lifestyle modifications and dietary adjustments that protect arterial health and stabilize blood pressure in senior adults.",
    coverImage:
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800",
    authorName: "Dr. Sarah Jenkins",
    publishedAt: "2026-09-28T14:00:00Z",
    formattedDate: "SEPTEMBER 28, 2026",
    category: "Wellness",
  },
  {
    id: "blog-5",
    title: "Understanding Hypertension: Symptoms & Diagnostics",
    slug: "understanding-hypertension-symptoms-diagnostics",
    summary:
      "Why early screening matters and how routine clinical blood pressure monitoring prevents chronic cardiovascular complications.",
    coverImage:
      "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800",
    authorName: "Dr. Sarah Jenkins",
    publishedAt: "2026-09-15T11:00:00Z",
    formattedDate: "SEPTEMBER 15, 2026",
    category: "Hypertension",
  },
];

interface LatestBlogSectionProps {
  blogs?: IBlogPost[];
}

export default function LatestBlogSection({ blogs }: LatestBlogSectionProps) {
  // Format date nicely e.g. "DECEMBER 17, 2026"
  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "RECENT POST";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase();
    } catch {
      return "RECENT POST";
    }
  };

  // Combine live blogs (up to 10) with realistic fallbacks if needed
  const displayBlogs =
    blogs && blogs.length > 0
      ? blogs.slice(0, 10).map((b, idx) => ({
          id: b.id || `live-${idx}`,
          title: b.title,
          slug: b.slug,
          summary: b.summary || "Explore recent medical breakthroughs, patient recovery guidance, and wellness tips.",
          coverImage:
            b.coverImage ||
            DUMMY_BLOGS[idx % DUMMY_BLOGS.length].coverImage,
          authorName: b.authorName || "Dr. Sarah Jenkins",
          formattedDate: formatDate(b.publishedAt || b.createdAt),
          category: b.category || "Health Care",
        }))
      : DUMMY_BLOGS;

  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-[#dceaf8] text-[#1a73e8] text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-sm mb-3">
            OUR BLOG
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2137] tracking-tight">
            See Our Latest Blog
          </h2>
        </div>

        {/* Swiper Slider (3 at a time, responsive, auto slide) */}
        <div className="blog-slider-container relative pb-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 28,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={displayBlogs.length >= 3}
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            className="pb-4"
          >
            {displayBlogs.map((post) => (
              <SwiperSlide key={post.id} className="h-auto">
                <article className="h-full bg-[#edf2f7] hover:bg-[#e6ecf4] transition-all rounded-xl overflow-hidden border border-slate-200/60 shadow-xs flex flex-col group">
                  {/* Image with Overlaid Date Badge */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-200">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute bottom-0 left-0 bg-[#1a73e8] text-white text-xs font-bold px-4 py-2 tracking-wider uppercase">
                      {post.formattedDate}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta: Author & Comments */}
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 text-[#1a73e8]">
                          <User className="h-3.5 w-3.5 text-[#1a73e8]" />
                          <span className="text-slate-600 uppercase font-semibold">
                            {post.authorName}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[#1a73e8]">
                          <MessageSquare className="h-3.5 w-3.5 text-[#1a73e8]" />
                          <span className="text-slate-600 uppercase font-semibold">
                            0 COMMENTS
                          </span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xl sm:text-2xl text-[#0f2137] group-hover:text-[#1a73e8] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blog/${post.slug || post.id}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="text-slate-600 text-base leading-relaxed line-clamp-3 font-normal">
                        {post.summary}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <div className="pt-2">
                      <Link
                        href={`/blog/${post.slug || post.id}`}
                        className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0f5991] font-bold text-sm tracking-wider uppercase transition-colors"
                      >
                        <span>READ MORE +</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Custom Swiper Pagination Styling */}
      <style jsx global>{`
        .blog-slider-container .swiper-pagination {
          bottom: 0px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .blog-slider-container .custom-bullet {
          display: inline-block;
          width: 16px;
          height: 6px;
          background: #cbd5e1;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .blog-slider-container .custom-bullet-active {
          width: 32px;
          background: #1a73e8;
        }
      `}</style>
    </section>
  );
}

