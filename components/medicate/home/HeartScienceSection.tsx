import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

export default function HeartScienceSection() {
  const points = [
    "Routine Medical Care & Triage",
    "Modern Diagnostic Heart Testing",
    "Dedicated Chronic Illness Care",
    "Individualized Recovery Plans",
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Collage Images */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal yOffset={20} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-7 rounded overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80"
                  alt="Laboratory medical research"
                  className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="col-span-5 space-y-4">
                <div className="rounded overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80"
                    alt="Doctor consultation"
                    className="w-full h-[180px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80"
                    alt="Clinical testing"
                    className="w-full h-[140px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Text Content */}
          <ScrollReveal delay={0.15} className="lg:col-span-6 space-y-6">
            <span className="inline-block text-[#1673b8] font-bold text-sm tracking-widest uppercase">
              MEDICAL SERVICES
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c2e] leading-tight">
              The Heart And Science Of Medicine Service
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              We provide comprehensive diagnostic investigations, preventive treatments, and continuous management for chronic and acute medical disorders. Our chamber combines clinical experience with state-of-the-art diagnostic protocols.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {points.map((pt, i) => (
                <div key={i} className="flex items-center gap-2.5 text-base font-semibold text-[#0b1c2e]">
                  <div className="w-5 h-5 rounded-full bg-[#1673b8]/15 text-[#1673b8] flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/services">
                <Button className="bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-sm tracking-wider uppercase h-12 px-8 rounded-[4px] shadow-sm">
                  <span>DISCOVER SERVICES</span>
                  <Plus className="h-4 w-4 stroke-[3]" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
