import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { User, MessageSquare, Plus } from "lucide-react";
import { getBlogs } from "@/services/doctor/cmsServices";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const dbBlogs = await getBlogs().catch(() => []);

  // Use dynamic blogs or fallback to standard Medicate template posts
  const defaultPosts = [
    {
      id: "1",
      slug: "get-the-exercise-limited-mobility",
      title: "Get The Exercise Limited Mobility",
      date: "DECEMBER 17, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "2",
      slug: "transfusion-strategy-and-heart-surgery",
      title: "Transfusion Strategy And Heart Surgery",
      date: "DECEMBER 15, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "3",
      slug: "latest-equipment-for-heart-treatment",
      title: "Latest Equipment For The Heart Treatment",
      date: "DECEMBER 11, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "4",
      slug: "what-is-future-of-blood-pressure-monitoring",
      title: "What Is Future Of Blood Pressure Monitoring?",
      date: "DECEMBER 09, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "5",
      slug: "goals-setting-the-people-heart-is-healthy",
      title: "Goals Setting The People Heart Is Healthy",
      date: "DECEMBER 06, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "6",
      slug: "for-examination-of-kids-get-special-offers",
      title: "For Examination Of Kids Get Special Offers",
      date: "DECEMBER 02, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "7",
      slug: "heart-failure-treatment-high-blood-pressure",
      title: "Heart Failure Treatment: High Blood Pressure",
      date: "NOVEMBER 28, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "8",
      slug: "hard-content-we-decide-ourselves-a-intently",
      title: "Hard Content We Decide Ourselves A Intently",
      date: "NOVEMBER 24, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
    {
      id: "9",
      slug: "is-running-really-good-for-the-heart",
      title: "Is Running Really Good For The Heart?",
      date: "OCTOBER 18, 2025",
      comments: 0,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      summary:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    },
  ];

  const posts =
    dbBlogs && dbBlogs.length > 0
      ? dbBlogs.map((b: any) => ({
          id: b.id,
          slug: b.slug || b.id,
          title: b.title,
          date: new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).toUpperCase(),
          comments: 0,
          image:
            b.coverImage ||
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
          summary: b.summary || b.content?.substring(0, 120) + "...",
        }))
      : defaultPosts;

  return (
    <div className="bg-white">
      {/* 1. Header Breadcrumb Banner */}
      <PageBanner
        title="3 Column Blog"
        breadcrumbs={[{ label: "3 COLUMN BLOG" }]}
      />

      {/* 2. 3-Column Blog Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-[#f8fafd] rounded-sm overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Featured Image with Blue Date Tag */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 bg-[#1673b8] text-white text-[10px] font-bold tracking-wider px-3.5 py-1.5 uppercase">
                      {post.date}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#1673b8]" />
                        <span>Dr. Admin</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#1673b8]" />
                        <span>{post.comments} COMMENTS</span>
                      </div>
                    </div>

                    {/* Post Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-base font-bold text-[#0b1c2e] hover:text-[#1673b8] transition-colors line-clamp-2 mb-3">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="p-6 pt-0">
                  <Link href={`/blog/${post.slug}`}>
                    <button className="h-10 px-5 rounded-[4px] bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-[11px] tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer">
                      <span>READ MORE</span>
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
