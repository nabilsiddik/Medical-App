import Link from "next/link";
import { Plus, ShieldPlus, HeartHandshake, Clock } from "lucide-react";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

export default function CaregivingServicesSection() {
  const cards = [
    {
      icon: ShieldPlus,
      title: "Instant Care",
      desc: "Comprehensive outpatient triage and immediate symptom stabilization for urgent and non-life-threatening medical conditions.",
    },
    {
      icon: HeartHandshake,
      title: "Caregiver Support",
      desc: "Holistic care plans and personalized clinical assistance designed for post-operative, geriatric, and chronically ill patients.",
    },
    {
      icon: Clock,
      title: "24/7 Hours Support",
      desc: "Emergency triage hotlines, priority chamber bookings, and digital follow-ups ensuring round-the-clock peace of mind.",
    },
  ];

  return (
    <section className="py-20 bg-[#f8fafd]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-primary font-bold text-base tracking-widest uppercase mb-2">
          SERVICES
        </span>

        <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] mb-12">
          We Deliver Quality Caregiving Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={idx}
                delay={idx * 0.15}
                className="bg-white p-8 sm:p-10 rounded-sm border border-slate-200/70 shadow-xs hover:shadow-md hover:border-primary/40 transition-all text-center flex flex-col items-center justify-between group h-full"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground flex items-center justify-center mb-6 transition-colors duration-300">
                  <Icon className="h-8 w-8 stroke-[1.8]" />
                </div>

                <h3 className="text-xl font-bold text-[#0b1c2e] mb-3">
                  {item.title}
                </h3>

                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-base font-bold text-primary hover:text-primary/80 tracking-wider uppercase transition-colors"
                >
                  <span>MORE</span>
                  <Plus className="h-4 w-4 stroke-[3]" />
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
