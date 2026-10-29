import Link from "next/link";
import { Eye, HeartPulse, Brain, Bone, Sparkles, Activity } from "lucide-react";

export default function WideRangeServicesSection() {
  const leftServices = [
    {
      icon: Eye,
      title: "Optometry & Eye Care",
      desc: "Specialized eye diagnostics, corneal checks, and visual health rehabilitation.",
    },
    {
      icon: HeartPulse,
      title: "Cardiology Checkup",
      desc: "Early ECG evaluation, hypertension management, and arterial risk assessment.",
    },
    {
      icon: Brain,
      title: "Neurology Services",
      desc: "Comprehensive neuromuscular diagnosis, migraine therapy, and central nervous care.",
    },
  ];

  const rightServices = [
    {
      icon: Bone,
      title: "Orthopedic Care",
      desc: "Joint arthropathy management, bone density evaluation, and mobility rehabilitation.",
    },
    {
      icon: Sparkles,
      title: "Dental Treatments",
      desc: "Advanced oral health checkups, preventive prophylaxis, and restorative dentistry.",
    },
    {
      icon: Activity,
      title: "General Medicine",
      desc: "Personalized primary consultations, fever triage, and systemic clinical wellness.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#f8fafd]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-[#1673b8] font-bold text-xs tracking-widest uppercase mb-2">
            SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e]">
            A Wide Range Of Medical Services
          </h2>
        </div>

        {/* 3-Column Grid: Left 3 Cards | Center Doctor Photo | Right 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 3 Cards */}
          <div className="lg:col-span-4 space-y-6">
            {leftServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-sm border border-slate-200/70 shadow-xs hover:border-[#1673b8]/50 hover:shadow-md transition-all flex items-start gap-4 text-left group"
                >
                  <div className="w-12 h-12 rounded bg-[#f1f6fb] group-hover:bg-[#1673b8] text-[#1673b8] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1c2e] mb-1">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Doctor Photo */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative max-w-sm rounded-lg overflow-hidden shadow-xl bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80"
                alt="Specialist Doctor in white coat"
                className="w-full h-[460px] object-cover rounded"
              />
            </div>
          </div>

          {/* Right 3 Cards */}
          <div className="lg:col-span-4 space-y-6">
            {rightServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-sm border border-slate-200/70 shadow-xs hover:border-[#1673b8]/50 hover:shadow-md transition-all flex items-start gap-4 text-left group"
                >
                  <div className="w-12 h-12 rounded bg-[#f1f6fb] group-hover:bg-[#1673b8] text-[#1673b8] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1c2e] mb-1">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
