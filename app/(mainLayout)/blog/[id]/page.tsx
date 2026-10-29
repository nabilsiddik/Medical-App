"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import BlogCommentsSection from "@/components/medicate/blog/BlogCommentsSection";
import { User, MessageSquare, Search, Tag, Folder, Calendar } from "lucide-react";
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
  const [recentBlogs, setRecentBlogs] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsCount, setCommentsCount] = useState<number>(0);

  useEffect(() => {
    if (slugOrId) {
      setLoading(true);
      Promise.all([getBlogBySlug(slugOrId), getBlogs()])
        .then(([blogData, allBlogs]) => {
          if (blogData) {
            setPost(blogData);
          } else {
            // Find by slug or id in all blogs
            const found = allBlogs.find(
              (b) => b.slug === slugOrId || b.id === slugOrId
            );
            if (found) setPost(found);
          }
          setRecentBlogs(allBlogs.slice(0, 4));
        })
        .finally(() => setLoading(false));
    }
  }, [slugOrId]);

  const categories = [
    { name: "Clinical Cardiology", count: 4 },
    { name: "Neurology", count: 2 },
    { name: "Endocrinology", count: 5 },
    { name: "Optometry", count: 3 },
    { name: "General Medicine", count: 6 },
  ];

  const tags = [
    "Coronavirus",
    "Hospital",
    "Illness",
    "Doctors",
    "Health",
    "Medicine",
    "Cardiology",
  ];

  const postTitle = post?.title || "Medical Insights & Clinical Care Update";
  const postAuthor = post?.authorName || "Prof. Dr. Sarah Rahman";
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

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              {/* Widget: Search */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-[#0b1c2e] mb-4">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-[#1673b8] bg-white shadow-xs"
                  />
                  <Search className="h-5 w-5 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              {/* Widget: Categories */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-[#0b1c2e] mb-4">Categories</h4>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between text-slate-600 hover:text-[#1673b8] text-base py-1.5 border-b border-slate-200/50 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="font-mono text-slate-400">({cat.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Widget: Recent Posts */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-[#0b1c2e] mb-4">Recent Posts</h4>
                <div className="space-y-4">
                  {recentBlogs.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img
                        src={
                          item.coverImage ||
                          "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200"
                        }
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                      />
                      <div>
                        <Link
                          href={`/blog/${item.slug || item.id}`}
                          className="font-bold text-base text-[#0b1c2e] hover:text-[#1673b8] line-clamp-2 leading-snug transition-colors"
                        >
                          {item.title}
                        </Link>
                        <span className="text-base text-slate-500 font-mono mt-1 block">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget: Tags */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-[#0b1c2e] mb-4">Popular Tags</h4>
                <div className="flex flex-wrap gap-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-base font-medium bg-white text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-[#1673b8] hover:text-[#1673b8] cursor-pointer shadow-xs transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Reusable Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
