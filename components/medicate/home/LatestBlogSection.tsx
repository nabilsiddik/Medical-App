"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { User, MessageSquare } from "lucide-react";
import { IBlogPost } from "@/types/doctor.interface";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface LatestBlogSectionProps {
  blogs?: IBlogPost[];
}

export default function LatestBlogSection({ blogs = [] }: LatestBlogSectionProps) {
  // Use dynamic blogs from database or fallback to 3 clinical high-res posts
  const displayBlogs = useMemo(() => {
    if (blogs && blogs.length > 0) {
      return blogs.slice(0, 10).map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        summary:
          b.summary ||
          b.content?.replace(/<[^>]*>/g, " ").substring(0, 150) + "..." ||
          "Evidence-based clinical guidelines and outpatient care recommendations.",
        authorName: b.authorName || "Doctor",
        coverImage:
          b.coverImage ||
          "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800",
        formattedDate: b.publishedAt
          ? new Date(b.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently Published",
      }));
    }

    return [
      {
        id: "dummy-1",
        title: "Get The Exercise Limited Mobility",
        slug: "get-the-exercise-limited-mobility",
        summary:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        authorName: "Clinical Staff",
        coverImage:
          "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800",
        formattedDate: "December 17, 2021",
      },
      {
        id: "dummy-2",
        title: "Transfusion Strategy And Heart Surgery",
        slug: "transfusion-strategy-and-heart-surgery",
        summary:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        authorName: "Cardiology Unit",
        coverImage:
          "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800",
        formattedDate: "December 5, 2021",
      },
      {
        id: "dummy-3",
        title: "Latest Equipment For The Heart Treatment",
        slug: "latest-equipment-for-heart-treatment",
        summary:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        authorName: "Diagnostic Team",
        coverImage:
          "https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=800",
        formattedDate: "December 5, 2021",
      },
      {
        id: "dummy-4",
        title: "Preventive Cardiac Care Protocols",
        slug: "preventive-cardiac-care-protocols",
        summary:
          "Early diagnostic screening and lifestyle management for long-term cardiovascular resilience and vitality.",
        authorName: "Specialist Team",
        coverImage:
          "https://images.pexels.com/photos/7089017/pexels-photo-7089017.jpeg?auto=compress&cs=tinysrgb&w=800",
        formattedDate: "November 28, 2021",
      },
    ];
  }, [blogs]);

  return (
    <section className="py-20 md:py-28 bg-[#f8fafc] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-primary/15 text-primary text-base font-bold tracking-widest uppercase px-4 py-1.5 rounded-sm mb-3">
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
                    <div className="absolute bottom-0 left-0 bg-primary text-primary-foreground text-base font-bold px-4 py-2 tracking-wider uppercase">
                      {post.formattedDate}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta: Author & Comments */}
                      <div className="flex items-center gap-4 text-base font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 text-primary">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-slate-600 uppercase font-semibold">
                            {post.authorName}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 text-primary">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-slate-600 uppercase font-semibold">
                            0 COMMENTS
                          </span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-xl sm:text-2xl text-[#0f2137] group-hover:text-primary transition-colors leading-snug line-clamp-2">
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
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-bold text-base tracking-wider uppercase transition-colors"
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

      {/* Styled Swiper Pagination Dots */}
      <style jsx global>{`
        .blog-slider-container .swiper-pagination {
          bottom: 0px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .blog-slider-container .custom-bullet {
          width: 28px;
          height: 4px;
          border-radius: 2px;
          background: #cbd5e1;
          display: inline-block;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .blog-slider-container .custom-bullet-active {
          width: 38px;
          background: var(--primary) !important;
        }
      `}</style>
    </section>
  );
}
