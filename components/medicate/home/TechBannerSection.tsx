import Link from "next/link";
import { Plus, Microscope } from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";

export default function TechBannerSection() {
  return (
    <section className="relative py-24 bg-[#0b1c2e] text-white text-center overflow-hidden">
      {/* Subtle Pattern Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-3xl">
        {/* Center Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">
          <Microscope className="h-8 w-8 stroke-[1.8]" />
        </div>

        <span className="inline-block text-primary font-bold text-base tracking-widest uppercase mb-3">
          WE ARE AT YOUR SERVICE
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-8">
          Expect Nothing But The Best From Medical Technology
        </h2>

        <div className="flex justify-center">
          <Link href="/services">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base tracking-wider uppercase h-12 px-8 rounded-[4px] shadow-sm">
              <span>MORE</span>
              <Plus className="h-4 w-4 stroke-[3]" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
