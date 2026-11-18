import React from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
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
      slug: "high-blood-pressure-silent-warning-signs-and-daily-management",
      title: "High Blood Pressure: The Silent Warning Signs and Daily Management",
      summary:
        "Learn how silent hypertension damages vital organs and the practical daily habits that keep your blood pressure within a healthy target range.",
      content:
        "<h2>Understanding Blood Pressure: Why Early Detection Saves Lives</h2><p>Blood pressure often rises quietly without pronounced symptoms, earning its medical reputation as a silent condition. Left unchecked, persistent high pressure strains the arterial walls, overworking the heart muscle and significantly increasing the risk of stroke, heart attack, and progressive kidney damage.</p><h3>Critical Daily Habits to Keep Blood Pressure in Check</h3><p>Adopting simple, consistent lifestyle habits plays a profound role in stabilizing arterial pressure:</p><ul><li><strong>Reduce Dietary Sodium:</strong> Aim to keep daily salt intake under one teaspoon (less than 2,000 mg) by minimizing processed snacks and table salt.</li><li><strong>Daily Aerobic Exercise:</strong> Just 30 minutes of brisk walking, cycling, or swimming 5 days a week improves vascular elasticity.</li><li><strong>Stress Management:</strong> Prioritize 7 to 8 hours of restorative sleep to prevent chronic cortisol spikes that constrict blood vessels.</li></ul><h3>When Should You Consult a Doctor?</h3><p>If home blood pressure readings consistently surpass 130/80 mmHg, or if you experience unexplained morning headaches, visual blurriness, or chest tightness, seek a clinical evaluation immediately.</p>",
      coverImage:
        "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80",
      category: "Clinical Cardiology",
      tags: ["HeartHealth", "Hypertension", "Cardiology", "PreventiveMedicine"],
      authorName: "MD. Nabil Siddik",
      publishedAt: "2026-11-18T00:00:00.000Z",
    },
    {
      id: "2",
      slug: "managing-blood-sugar-effective-strategies-for-diabetes-insulin-resistance",
      title: "Managing Blood Sugar: Effective Strategies for Diabetes & Insulin Resistance",
      summary:
        "Simple dietary adjustments, post-meal walking, and routine HbA1c screening can significantly reduce diabetes complications.",
      content:
        "<h2>The Reality of Glucose Spikes and Metabolic Health</h2><p>Type 2 diabetes and prediabetes develop when body cells gradually become resistant to insulin. Achieving balanced blood sugar is not about extreme deprivation—it is about adopting sustainable dietary habits and consistent daily movement.</p><h3>Three Golden Rules for Glycemic Balance</h3><p>Implementing targeted daily strategies keeps energy steady and prevents hazardous glucose spikes:</p><ul><li><strong>Follow the Healthy Plate Method:</strong> Fill half your plate with colorful vegetables, one-quarter with lean protein, and one-quarter with complex whole grains.</li><li><strong>Take a 10-Minute Post-Meal Walk:</strong> A gentle walk immediately following meals stimulates muscle cells to absorb circulating glucose directly from the bloodstream.</li><li><strong>Prioritize Pure Hydration:</strong> Eliminate sugary beverages, energy drinks, and packaged fruit juices.</li></ul><h3>The Importance of Routine HbA1c Monitoring</h3><p>An HbA1c blood test every 3 to 6 months provides a reliable snapshot of your average 90-day glycemic control. Timely clinical adjustments protect vital nerve endings, eyesight, and cardiovascular vessels.</p>",
      coverImage:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      category: "Diabetes & Endocrinology",
      tags: ["Diabetes", "BloodSugar", "Nutrition", "Endocrinology", "HealthTips"],
      authorName: "MD. Nabil Siddik",
      publishedAt: "2026-11-15T00:00:00.000Z",
    },
    {
      id: "3",
      slug: "preventive-health-checkups-why-waiting-for-symptoms-is-a-mistake",
      title: "Preventive Health Checkups: Why Waiting for Symptoms Is a Mistake",
      summary:
        "Routine clinical evaluations detect underlying chronic illnesses years before symptoms manifest. Discover which tests are essential for your age.",
      content:
        "<h2>The Power of Early Clinical Intervention</h2><p>Most individuals schedule a medical appointment only when pain, severe fatigue, or acute discomfort becomes impossible to ignore. However, conditions such as elevated cholesterol, fatty liver, borderline hypertension, and early diabetes develop quietly over years without generating overt symptoms.</p><h3>Essential Screenings Every Adult Should Prioritize</h3><p>Key routine diagnostic investigations provide comprehensive insight into internal organ health:</p><ul><li><strong>Fasting Lipid Panel:</strong> Measures total cholesterol, LDL, HDL, and triglycerides to accurately calculate your 10-year cardiovascular risk score.</li><li><strong>Liver & Kidney Function Profiles (LFT & Creatinine):</strong> Crucial for evaluating vital metabolic detoxification and filtration efficiency.</li><li><strong>Complete Blood Count (CBC) & Vitamin D:</strong> Detects subclinical anemias, hidden infections, and vitamin deficiencies.</li></ul><h3>Building a Lifelong Partnership with Your Physician</h3><p>An annual comprehensive health assessment allows your doctor to identify subtle biomarker trends before they evolve into chronic illness.</p>",
      coverImage:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      category: "Health Tips",
      tags: ["Wellness", "Checkup", "PreventiveMedicine", "Healthcare", "Diagnostics"],
      authorName: "MD. Nabil Siddik",
      publishedAt: "2026-11-12T00:00:00.000Z",
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
    </div>
  );
}
