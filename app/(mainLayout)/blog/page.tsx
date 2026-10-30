import React from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import BlogSidebar from "@/components/medicate/blog/BlogSidebar";
import { User, MessageSquare, Plus, X, Search, FileText } from "lucide-react";
import { getBlogs } from "@/services/doctor/cmsServices";
import { IBlogPost } from "@/types/doctor.interface";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams?:
    | Promise<{
        search?: string;
        category?: string;
        tag?: string;
      }>
    | {
        search?: string;
        category?: string;
        tag?: string;
      };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams =
    searchParams instanceof Promise ? await searchParams : searchParams || {};

  const search = resolvedSearchParams.search?.trim() || "";
  const category = resolvedSearchParams.category?.trim() || "";
  const tag = resolvedSearchParams.tag?.trim() || "";

  const dbBlogs: IBlogPost[] = await getBlogs().catch(() => []);

  // Standard template fallback posts if database is completely empty
  const defaultPosts: IBlogPost[] = [
    {
      id: "1",
      slug: "get-the-exercise-limited-mobility",
      title: "Get The Exercise Limited Mobility",
      summary:
        "Regular gentle movement and specialized physical therapy can dramatically preserve joint function and mobility in patients.",
      content: "",
      coverImage:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      category: "Rehabilitation",
      tags: ["Healthcare", "Exercise", "Mobility"],
      authorName: "Prof. Dr. Sarah Rahman",
      publishedAt: "2025-12-17T00:00:00.000Z",
    },
    {
      id: "2",
      slug: "transfusion-strategy-and-heart-surgery",
      title: "Transfusion Strategy And Heart Surgery",
      summary:
        "Modern intraoperative blood preservation techniques significantly improve cardiac surgery outcomes and accelerate post-op recovery.",
      content: "",
      coverImage:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      category: "Clinical Cardiology",
      tags: ["Cardiology", "Surgery", "Medicine"],
      authorName: "Prof. Dr. Sarah Rahman",
      publishedAt: "2025-12-15T00:00:00.000Z",
    },
    {
      id: "3",
      slug: "latest-equipment-for-heart-treatment",
      title: "Latest Equipment For The Heart Treatment",
      summary:
        "Advanced echocardiography and non-invasive hemodynamics provide earlier diagnostic precision for complex structural heart conditions.",
      content: "",
      coverImage:
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
      category: "Clinical Cardiology",
      tags: ["Cardiology", "Equipment", "Technology"],
      authorName: "Prof. Dr. Sarah Rahman",
      publishedAt: "2025-12-11T00:00:00.000Z",
    },
    {
      id: "4",
      slug: "what-is-future-of-blood-pressure-monitoring",
      title: "What Is Future Of Blood Pressure Monitoring?",
      summary:
        "Continuous ambulatory BP tracking combined with physician analytics helps detect nocturnal hypertension before cardiovascular harm occurs.",
      content: "",
      coverImage:
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      category: "General Medicine",
      tags: ["BloodPressure", "Preventive Care", "Health Tips"],
      authorName: "Prof. Dr. Sarah Rahman",
      publishedAt: "2025-12-09T00:00:00.000Z",
    },
  ];

  const sourceBlogs = dbBlogs && dbBlogs.length > 0 ? dbBlogs : defaultPosts;

  // Apply filters dynamically
  let filteredBlogs = [...sourceBlogs];

  if (search) {
    const q = search.toLowerCase();
    filteredBlogs = filteredBlogs.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(q);
      const summaryMatch = post.summary?.toLowerCase().includes(q);
      const contentMatch = post.content?.toLowerCase().includes(q);
      const categoryMatch = post.category?.toLowerCase().includes(q);
      const tagMatch = (post.tags || []).some((t) =>
        t.toLowerCase().includes(q)
      );
      return titleMatch || summaryMatch || contentMatch || categoryMatch || tagMatch;
    });
  }

  if (category) {
    const cat = category.toLowerCase();
    filteredBlogs = filteredBlogs.filter(
      (post) => (post.category || "").toLowerCase() === cat
    );
  }

  if (tag) {
    const t = tag.toLowerCase();
    filteredBlogs = filteredBlogs.filter((post) => {
      const postTags: string[] = Array.isArray(post.tags)
        ? post.tags
        : typeof post.tags === "string"
        ? (post.tags as string).split(",")
        : [];
      return postTags.some((pt) => pt.trim().toLowerCase() === t);
    });
  }

  const isFilterActive = Boolean(search || category || tag);

  return (
    <div className="bg-white">
      {/* 1. Header Breadcrumb Banner */}
      <PageBanner
        title={
          category
            ? `${category} Articles`
            : tag
            ? `#${tag} Medical Posts`
            : search
            ? `Search: "${search}"`
            : "Medical & Health Insights"
        }
        breadcrumbs={[
          { label: "BLOG", href: "/blog" },
          ...(category ? [{ label: category }] : []),
          ...(tag ? [{ label: `#${tag}` }] : []),
        ]}
      />

      {/* 2. Main Blog Section with 2-Column Responsive Grid + Sidebar */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Blog Posts (8 cols) */}
            <div className="lg:col-span-8">
              {/* Active Filter Bar */}
              {isFilterActive && (
                <div className="bg-[#f0f7fc] border border-[#1673b8]/30 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                  <div className="flex flex-wrap items-center gap-2.5 text-base text-[#0b1c2e]">
                    <span className="font-bold text-slate-700">Filter Applied:</span>
                    {category && (
                      <span className="inline-flex items-center gap-1.5 bg-[#1673b8] text-white px-3.5 py-1.5 rounded-xl text-base font-bold shadow-xs">
                        Category: {category}
                      </span>
                    )}
                    {tag && (
                      <span className="inline-flex items-center gap-1.5 bg-[#1673b8] text-white px-3.5 py-1.5 rounded-xl text-base font-bold shadow-xs">
                        Tag: #{tag}
                      </span>
                    )}
                    {search && (
                      <span className="inline-flex items-center gap-1.5 bg-[#1673b8] text-white px-3.5 py-1.5 rounded-xl text-base font-bold shadow-xs">
                        Search: &ldquo;{search}&rdquo;
                      </span>
                    )}
                    <span className="text-slate-500 font-semibold ml-1">
                      ({filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"} found)
                    </span>
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-base font-bold text-[#1673b8] hover:text-[#0f5991] bg-white px-4 py-2 rounded-xl border border-[#1673b8]/30 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <span>Clear Filters</span>
                    <X className="h-5 w-5" />
                  </Link>
                </div>
              )}

              {/* Blog Posts Grid */}
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.map((post) => {
                    const postDate = post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).toUpperCase()
                      : post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).toUpperCase()
                      : "RECENT";

                    const postAuthor = post.authorName || "Prof. Dr. Sarah Rahman";
                    const postSummary =
                      post.summary ||
                      post.content?.replace(/<[^>]+>/g, "").substring(0, 140) + "..." ||
                      "Read full clinical insights, medical advice, and patient guidelines in this article.";

                    const postImage =
                      post.coverImage ||
                      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80";

                    return (
                      <article
                        key={post.id}
                        className="bg-[#f8fafd] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Featured Image with Blue Date Tag */}
                          <div className="relative h-60 overflow-hidden bg-slate-100">
                            <img
                              src={postImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 bg-[#1673b8] text-white text-base font-bold tracking-wider px-4 py-2 uppercase shadow-xs">
                              {postDate}
                            </div>
                            {post.category && (
                              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0b1c2e] font-semibold text-base px-3 py-1 rounded-lg shadow-sm border border-slate-200/60">
                                {post.category}
                              </div>
                            )}
                          </div>

                          {/* Body Content */}
                          <div className="p-6">
                            {/* Meta info */}
                            <div className="flex items-center gap-4 text-base font-semibold text-slate-500 uppercase tracking-wider mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-[#1673b8]" />
                                <span>{postAuthor}</span>
                              </div>
                            </div>

                            {/* Post Title */}
                            <Link href={`/blog/${post.slug || post.id}`}>
                              <h3 className="text-xl font-bold text-[#0b1c2e] hover:text-[#1673b8] transition-colors line-clamp-2 mb-3">
                                {post.title}
                              </h3>
                            </Link>

                            {/* Excerpt */}
                            <p className="text-base text-slate-600 leading-relaxed line-clamp-3">
                              {postSummary}
                            </p>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <div className="p-6 pt-0">
                          <Link href={`/blog/${post.slug || post.id}`}>
                            <button className="h-11 px-6 rounded-xl bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base tracking-wider uppercase transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer">
                              <span>READ MORE</span>
                              <Plus className="h-5 w-5 stroke-[2.5]" />
                            </button>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no posts match filter */
                <div className="text-center py-20 bg-[#f8fafd] rounded-2xl border border-slate-200/80 p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#1673b8]/10 text-[#1673b8] flex items-center justify-center mb-5">
                    <Search className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1c2e] mb-2">
                    No Medical Posts Found
                  </h3>
                  <p className="text-base text-slate-600 max-w-md mx-auto mb-6">
                    {search
                      ? `We couldn't find any articles matching "${search}". Try searching with different keywords.`
                      : category
                      ? `There are currently no articles in category "${category}".`
                      : tag
                      ? `There are currently no articles tagged with "#${tag}".`
                      : "No articles are available at the moment."}
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base transition-colors shadow-sm cursor-pointer"
                  >
                    <FileText className="h-5 w-5" />
                    <span>View All Blog Articles</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Standard Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <BlogSidebar
                allBlogs={sourceBlogs}
                activeCategory={category}
                activeTag={tag}
                activeSearch={search}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
