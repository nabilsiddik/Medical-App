import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

interface PageBannerProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  backgroundImage?: string;
}

export default function PageBanner({
  title,
  breadcrumbs,
  backgroundImage = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1800&q=80",
}: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-slate-100 py-16 md:py-24 border-b border-slate-200/60">
      {/* Background Image with Light Medical Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0b1c2e] mb-4">
            {title}
          </h1>

          {/* Breadcrumb Navigation - Standard Natural Readable Font */}
          <nav className="flex items-center gap-2 text-base font-bold tracking-wider uppercase text-slate-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-[#1673b8] transition-colors"
            >
              <Home className="h-4 w-4 text-[#1673b8]" />
              <span>HOME</span>
            </Link>

            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[#1673b8] transition-colors text-slate-600"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#1673b8] font-bold">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
