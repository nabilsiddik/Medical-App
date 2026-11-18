"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import BlogCommentsSection from "@/components/medicate/blog/BlogCommentsSection";
import BlogSidebar from "@/components/medicate/blog/BlogSidebar";
import { User, MessageSquare, Folder } from "lucide-react";
import { getBlogBySlug, getBlogs } from "@/services/doctor/cmsServices";
import { IBlogPost } from "@/types/doctor.interface";

export default function SingleBlogPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Unwrap Next.js 15/16 params
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const slugOrId = resolvedParams?.id || "";

  const [post, setPost] = useState<IBlogPost | null>(null);
  const [allBlogs, setAllBlogs] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState<number>(0);

  useEffect(() => {
    if (slugOrId) {
      setLoading(true);
      Promise.all([getBlogBySlug(slugOrId), getBlogs()])
        .then(([blogData, blogsList]) => {
          setAllBlogs(blogsList || []);
          if (blogData) {
            setPost(blogData);
          } else {
            // Find by slug or id in all blogs
            const found = (blogsList || []).find(
              (b) => b.slug === slugOrId || b.id === slugOrId
            );
            if (found) setPost(found);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slugOrId]);

  const postTitle = post?.title || "Medical Insights & Clinical Care Update";
  const postAuthor = post?.authorName || "MD. Nabil Siddik";
  const postCategory = post?.category || "Clinical Care";
  const postDate = post?.publishedAt
    ? new Date(post.publishedAt)
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase()
    : "OCTOBER 29, 2026";
  const postImage =
    post?.coverImage ||
    "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return (
    <div className="bg-white">
      {/* 1. Header Breadcrumb Banner */}
      <PageBanner
        title={postTitle}
        breadcrumbs={[
          { label: "BLOG", href: "/blog" },
          { label: "BLOG DETAIL" },
        ]}
      />

      {/* 2. Main Blog Article & Sidebar */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Article Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Image with Date Badge */}
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <img
                  src={postImage}
                  alt={postTitle}
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-[#1673b8] text-white text-base font-bold tracking-wider px-4 py-2 uppercase shadow-sm rounded-sm">
                  {postDate}
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-base font-semibold text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#1673b8]" />
                  <span>By {postAuthor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-[#1673b8]" />
                  <span>{postCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#1673b8]" />
                  <span>{commentsCount} Comments</span>
                </div>
              </div>

              {/* Rich Body Paragraphs / HTML Content */}
              {post?.content ? (
                <div
                  className="blog-article-content blog-content prose max-w-none text-slate-800 text-base leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="prose max-w-none text-slate-700 text-base leading-relaxed space-y-5">
                  <p>
                    Clinical research emphasizes the value of regular health screenings and preventive measures. Early identification of systemic inflammatory markers reduces long-term hospitalization risk by over forty percent. Our chamber integrates modern diagnostic panels alongside comprehensive patient lifestyle evaluations.
                  </p>

                  <h3 className="text-2xl font-black text-[#0b1c2e] pt-2">
                    Evidence-Based Clinical Protocols
                  </h3>

                  <p>
                    Preventative screenings allow clinicians to detect asymptomatic cardiovascular stress before critical events emerge.
                  </p>

                  {/* Quote Callout Box */}
                  <div className="border-l-4 border-[#1673b8] bg-[#f8fafd] p-6 rounded-r-xl italic text-slate-700 font-medium my-6 text-base">
                    “Regular preventative screening allows clinicians to detect asymptomatic cardiovascular stress before critical events emerge.”
                    <span className="block mt-2 text-base font-bold text-[#1673b8] not-italic">
                      — {postAuthor} (Senior Physician)
                    </span>
                  </div>
                </div>
              )}

              {/* Facebook-style Threaded Comments & Replies Section */}
              <BlogCommentsSection
                blogIdentifier={slugOrId}
                authorName={postAuthor}
                onCommentsCountChange={setCommentsCount}
              />
            </div>

            {/* Right Column: Dynamic Standard Sidebar */}
            <div className="lg:col-span-4">
              <BlogSidebar allBlogs={allBlogs} currentPostSlugOrId={slugOrId} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Reusable Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
