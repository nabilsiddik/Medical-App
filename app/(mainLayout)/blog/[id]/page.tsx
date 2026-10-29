"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { User, MessageSquare, Search, Tag, Folder, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getBlogBySlug, getBlogs } from "@/services/doctor/cmsServices";
import { IBlogPost } from "@/types/doctor.interface";

export default function SingleBlogPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap Next.js 15/16 params
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const slugOrId = resolvedParams?.id || "";

  const [post, setPost] = useState<IBlogPost | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentWebsite, setCommentWebsite] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittedComment, setSubmittedComment] = useState(false);

  useEffect(() => {
    if (slugOrId) {
      setLoading(true);
      Promise.all([getBlogBySlug(slugOrId), getBlogs()])
        .then(([blogData, allBlogs]) => {
          if (blogData) {
            setPost(blogData);
          } else {
            // Find by slug or id in all blogs
            const found = allBlogs.find((b) => b.slug === slugOrId || b.id === slugOrId);
            if (found) setPost(found);
          }
          setRecentBlogs(allBlogs.slice(0, 4));
        })
        .finally(() => setLoading(false));
    }
  }, [slugOrId]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentText) {
      toast.error("Please fill in your name, email, and comment.");
      return;
    }
    setSubmittedComment(true);
    toast.success("Thank you! Your comment has been submitted for moderation.");
    setCommentName("");
    setCommentEmail("");
    setCommentWebsite("");
    setCommentText("");
  };

  const categories = [
    { name: "Clinical Cardiology", count: 4 },
    { name: "Neurology", count: 2 },
    { name: "Endocrinology", count: 5 },
    { name: "Optometry", count: 3 },
    { name: "General Medicine", count: 6 },
  ];

  const tags = ["Coronavirus", "Hospital", "Illness", "Doctors", "Health", "Medicine", "Cardiology"];

  const postTitle = post?.title || "Hard Content We Decide Ourselves A Intently";
  const postAuthor = post?.authorName || "Prof. Dr. Sarah Rahman";
  const postCategory = post?.category || "Clinical Care";
  const postDate = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
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
                <div className="absolute bottom-4 left-4 bg-[#1673b8] text-white text-xs font-bold tracking-wider px-4 py-2 uppercase shadow-sm rounded-sm">
                  {postDate}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#1673b8]" />
                  <span>By {postAuthor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Folder className="h-3.5 w-3.5 text-[#1673b8]" />
                  <span>{postCategory}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#1673b8]" />
                  <span>0 Comments</span>
                </div>
              </div>

              {/* Rich Body Paragraphs / HTML Content */}
              {post?.content ? (
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="prose max-w-none text-slate-700 leading-relaxed space-y-5">
                  <p>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-black text-[#0b1c2e] pt-2">
                    Results Are From The Clinical Trial
                  </h3>

                  <p>
                    Medical research proves that early identification of systemic inflammatory markers reduces long-term hospitalization risk by over forty percent. Our chamber integrates modern diagnostic panels alongside comprehensive patient lifestyle evaluations.
                  </p>

                  {/* Quote Callout Box */}
                  <div className="border-l-4 border-[#1673b8] bg-[#f8fafd] p-6 rounded-r-xl italic text-slate-700 font-medium my-6">
                    “Regular preventative screening allows clinicians to detect asymptomatic cardiovascular stress before critical events emerge.”
                    <span className="block mt-2 text-xs font-bold text-[#1673b8] not-italic uppercase">
                      — {postAuthor} (SENIOR PHYSICIAN)
                    </span>
                  </div>
                </div>
              )}

              {/* Write A Reply Or Comment Form */}
              <div className="pt-10 border-t border-slate-200">
                <h3 className="text-2xl font-black text-[#0b1c2e] mb-2">
                  Write A Reply Or Comment
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Your email address will not be published. Required fields are marked *
                </p>

                <form onSubmit={handleComment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full h-12 px-4 rounded border border-slate-200 text-sm focus:outline-none focus:border-[#1673b8]"
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      required
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded border border-slate-200 text-sm focus:outline-none focus:border-[#1673b8]"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="Your Website"
                    value={commentWebsite}
                    onChange={(e) => setCommentWebsite(e.target.value)}
                    className="w-full h-12 px-4 rounded border border-slate-200 text-sm focus:outline-none focus:border-[#1673b8]"
                  />

                  <textarea
                    rows={6}
                    placeholder="Write your comment here... *"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-4 rounded border border-slate-200 text-sm focus:outline-none focus:border-[#1673b8]"
                  />

                  <button
                    type="submit"
                    className="bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-xs uppercase tracking-wider h-11 px-7 rounded shadow-xs"
                  >
                    POST COMMENT
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              {/* Widget: Search */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-base font-bold text-[#0b1c2e] mb-4">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    className="w-full h-11 pl-4 pr-10 rounded border border-slate-200 text-sm focus:outline-none focus:border-[#1673b8] bg-white"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              {/* Widget: Categories */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-base font-bold text-[#0b1c2e] mb-4">Categories</h4>
                <ul className="space-y-2.5">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between text-slate-600 hover:text-[#1673b8] text-sm py-1 border-b border-slate-200/50"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs font-mono text-slate-400">({cat.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Widget: Recent Posts */}
              <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl">
                <h4 className="text-base font-bold text-[#0b1c2e] mb-4">Recent Posts</h4>
                <div className="space-y-4">
                  {recentBlogs.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={
                          item.coverImage ||
                          "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200"
                        }
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <Link
                          href={`/blog/${item.slug || item.id}`}
                          className="font-bold text-sm text-[#0b1c2e] hover:text-[#1673b8] line-clamp-2 leading-snug"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-slate-400 font-mono mt-1 block">
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
                <h4 className="text-base font-bold text-[#0b1c2e] mb-4">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-white text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:border-[#1673b8] hover:text-[#1673b8] cursor-pointer"
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
