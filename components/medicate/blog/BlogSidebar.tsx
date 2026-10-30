"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Folder, Tag, Calendar, ChevronRight } from "lucide-react";
import { IBlogPost } from "@/types/doctor.interface";
import { getBlogs } from "@/services/doctor/cmsServices";

interface BlogSidebarProps {
  allBlogs?: IBlogPost[];
  activeCategory?: string;
  activeTag?: string;
  activeSearch?: string;
  currentPostSlugOrId?: string;
}

export default function BlogSidebar({
  allBlogs: initialBlogs,
  activeCategory: initialCategory,
  activeTag: initialTag,
  activeSearch: initialSearch,
  currentPostSlugOrId,
}: BlogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL search params as backup if not passed as props
  const currentCategory = initialCategory ?? searchParams.get("category") ?? "";
  const currentTag = initialTag ?? searchParams.get("tag") ?? "";
  const currentSearch = initialSearch ?? searchParams.get("search") ?? "";

  const [blogs, setBlogs] = useState<IBlogPost[]>(initialBlogs || []);
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  // Sync internal blogs if initialBlogs changes or fetch if empty
  useEffect(() => {
    if (initialBlogs && initialBlogs.length > 0) {
      setBlogs(initialBlogs);
    } else {
      getBlogs()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data);
          }
        })
        .catch(() => {});
    }
  }, [initialBlogs]);

  // Keep search input in sync if URL parameter changes
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // 1. Search Handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/blog?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/blog");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (currentSearch) {
      router.push("/blog");
    }
  };

  // 2. Dynamic Categories calculation
  const categories = useMemo(() => {
    const map = new Map<string, number>();

    if (blogs && blogs.length > 0) {
      blogs.forEach((b) => {
        const cat = (b.category || "Clinical Care").trim();
        if (cat) {
          map.set(cat, (map.get(cat) || 0) + 1);
        }
      });
    }

    // Default fallback categories if no blogs found
    if (map.size === 0) {
      return [
        { name: "Clinical Cardiology", count: 0 },
        { name: "Health Tips", count: 0 },
        { name: "General Medicine", count: 0 },
        { name: "Preventive Care", count: 0 },
        { name: "Diabetes & Endocrinology", count: 0 },
      ];
    }

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [blogs]);

  // 3. Dynamic Recent Posts calculation
  const recentPosts = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];

    // Sort by publication date or creation date descending
    const sorted = [...blogs].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Exclude currently viewed post if on detail page and there are others
    const filtered = currentPostSlugOrId
      ? sorted.filter(
          (b) => b.slug !== currentPostSlugOrId && b.id !== currentPostSlugOrId
        )
      : sorted;

    const listToDisplay = filtered.length > 0 ? filtered : sorted;
    return listToDisplay.slice(0, 4);
  }, [blogs, currentPostSlugOrId]);

  // 4. Dynamic Tags calculation
  const popularTags = useMemo(() => {
    const map = new Map<string, number>();

    if (blogs && blogs.length > 0) {
      blogs.forEach((b) => {
        const postTags: string[] = Array.isArray(b.tags)
          ? b.tags
          : typeof b.tags === "string"
          ? (b.tags as string).split(",")
          : [];

        postTags.forEach((t) => {
          const cleaned = t.trim();
          if (cleaned) {
            map.set(cleaned, (map.get(cleaned) || 0) + 1);
          }
        });
      });
    }

    if (map.size === 0) {
      return [
        "Healthcare",
        "Medicine",
        "Wellness",
        "Cardiology",
        "Health Tips",
        "Hospital",
        "Preventive Care",
        "Doctor",
      ];
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag)
      .slice(0, 16);
  }, [blogs]);

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80";

  return (
    <aside className="space-y-8" aria-label="Blog Sidebar">
      {/* Widget 1: Search */}
      <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <h4 className="text-xl font-bold text-[#0b1c2e] mb-4 flex items-center gap-2">
          <span>Search</span>
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full h-12 pl-4 pr-20 rounded-xl border border-slate-200 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1673b8] focus:ring-1 focus:ring-[#1673b8] bg-white shadow-xs transition-colors"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search query"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit blog search"
              className="p-2 bg-[#1673b8] hover:bg-[#0f5991] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Widget 2: Categories */}
      <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-[#0b1c2e]">Categories</h4>
          {currentCategory && (
            <Link
              href="/blog"
              className="text-base font-bold text-[#1673b8] hover:underline"
            >
              View All
            </Link>
          )}
        </div>

        <ul className="space-y-2">
          {/* All Articles link */}
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between text-base px-3 py-2 rounded-xl transition-all ${
                !currentCategory && !currentTag && !currentSearch
                  ? "bg-[#1673b8] text-white font-bold shadow-xs"
                  : "text-slate-700 hover:bg-slate-100/80 hover:text-[#1673b8]"
              }`}
            >
              <span>All Articles</span>
              <span
                className={`font-mono text-base px-2 py-0.5 rounded-full ${
                  !currentCategory && !currentTag && !currentSearch
                    ? "bg-white/20 text-white"
                    : "text-slate-400 bg-slate-100"
                }`}
              >
                ({blogs.length})
              </span>
            </Link>
          </li>

          {categories.map((cat) => {
            const isActive =
              currentCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <li key={cat.name}>
                <Link
                  href={`/blog?category=${encodeURIComponent(cat.name)}`}
                  className={`flex items-center justify-between text-base px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#1673b8] text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-[#1673b8] border-b border-slate-200/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>{cat.name}</span>
                  </span>
                  <span
                    className={`font-mono text-base px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-slate-400 bg-slate-100"
                    }`}
                  >
                    ({cat.count})
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Widget 3: Recent Posts */}
      <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <h4 className="text-xl font-bold text-[#0b1c2e] mb-4">Recent Posts</h4>
        {recentPosts.length === 0 ? (
          <p className="text-base text-slate-500 italic">No recent posts yet.</p>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((item) => {
              const formattedDate = item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div key={item.id} className="flex gap-4 items-center group">
                  <Link
                    href={`/blog/${item.slug || item.id}`}
                    className="relative w-18 h-18 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200/70"
                  >
                    <img
                      src={item.coverImage || defaultThumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${item.slug || item.id}`}
                      className="font-bold text-base text-[#0b1c2e] hover:text-[#1673b8] line-clamp-2 leading-snug transition-colors block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-base text-slate-500 font-mono mt-1">
                      <Calendar className="h-4 w-4 text-[#1673b8] shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Widget 4: Popular Tags */}
      <div className="bg-[#f8fafd] border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-[#0b1c2e]">Popular Tags</h4>
          {currentTag && (
            <Link
              href="/blog"
              className="text-base font-bold text-[#1673b8] hover:underline"
            >
              Clear Tag
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {popularTags.map((tag) => {
            const isActive = currentTag.toLowerCase() === tag.toLowerCase();
            return (
              <Link
                key={tag}
                href={
                  isActive ? "/blog" : `/blog?tag=${encodeURIComponent(tag)}`
                }
                className={`text-base font-medium px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? "bg-[#1673b8] text-white border border-[#1673b8] shadow-md"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:border-[#1673b8] hover:text-[#1673b8] hover:bg-slate-50"
                }`}
              >
                #{tag}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

