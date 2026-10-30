export const dynamic = "force-dynamic";

import HeroSection from "@/components/medicate/home/HeroSection";
import HeroThreeCardsSection from "@/components/medicate/home/HeroThreeCardsSection";
import HeartScienceSection from "@/components/medicate/home/HeartScienceSection";
import CaregivingServicesSection from "@/components/medicate/home/CaregivingServicesSection";
import MedicalHealthCareSection from "@/components/medicate/home/MedicalHealthCareSection";
import WideRangeServicesSection from "@/components/medicate/home/WideRangeServicesSection";
import TechBannerSection from "@/components/medicate/home/TechBannerSection";
import ProtectLifeSection from "@/components/medicate/home/ProtectLifeSection";
import SpecialistDoctorsSection from "@/components/medicate/home/SpecialistDoctorsSection";
import TestimonialsSection from "@/components/medicate/home/TestimonialsSection";
import LatestBlogSection from "@/components/medicate/home/LatestBlogSection";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";
import { getPublicSiteConfig, getServices, getChamberLocations } from "@/services/doctor/clinicServices";
import { getTestimonials, getBlogs } from "@/services/doctor/cmsServices";

export default async function HomePage() {
  const [config, services, locations, testimonials, blogs] = await Promise.all([
    getPublicSiteConfig().catch(() => null),
    getServices().catch(() => []),
    getChamberLocations().catch(() => []),
    getTestimonials().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  const doctorName = config?.doctor?.name || "Prof. Dr. Sarah Rahman";
  const tagline = config?.branding?.brandTagline || "Trusted Clinical Care & Preventive Health";

  // Use dynamic services or provide default medical services if DB empty
  const activeServices =
    services && services.length > 0
      ? services.map((s: any) => ({ id: s.id, name: s.name, slug: s.slug }))
      : [
          { id: "srv-cardio", name: "Cardiology Care", slug: "cardiology" },
          { id: "srv-general", name: "General Medicine", slug: "general-medicine" },
          { id: "srv-endocrine", name: "Endocrinology Services", slug: "endocrinology" },
          { id: "srv-neuro", name: "Neurology Checkup", slug: "neurology" },
          { id: "srv-eye", name: "Optometry & Eye Care", slug: "optometry" },
        ];

  const activeLocations =
    locations && locations.length > 0
      ? locations.map((l: any) => ({ id: l.id, name: l.name }))
      : [{ id: "loc-central", name: "Central Medical Chamber" }];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section (Includes its own fade & right-to-left slide animation) */}
      <HeroSection doctorName={doctorName} tagline={tagline} />

      {/* 2. Three Cards Section (Emergency Cases, Doctors Timetable, Opening Hours) */}
      <ScrollReveal yOffset={20}>
        <HeroThreeCardsSection
          emergencyPhone={config?.emergencyPhone || config?.contact?.emergencyPhone}
          inquiryPhone={config?.contactPhone || config?.contact?.phone}
        />
      </ScrollReveal>

      {/* 3. Medical Services: The Heart And Science Of Medicine Service */}
      <ScrollReveal>
        <HeartScienceSection />
      </ScrollReveal>

      {/* 4. Quality Caregiving Services: 3 cards */}
      <ScrollReveal>
        <CaregivingServicesSection />
      </ScrollReveal>

      {/* 5. Blue Split Banner: A Great Piece Of Medical Health Care */}
      <ScrollReveal>
        <MedicalHealthCareSection />
      </ScrollReveal>

      {/* 6. A Wide Range Of Optometry / Medical Services with Center Doctor */}
      <ScrollReveal>
        <WideRangeServicesSection />
      </ScrollReveal>

      {/* 7. Dark Navy Banner: Expect Nothing But The Best From Medical Technology */}
      <ScrollReveal>
        <TechBannerSection />
      </ScrollReveal>

      {/* 8. Feature: We Protect You In Any Sphere Of Life (Progress Bars) */}
      <ScrollReveal>
        <ProtectLifeSection />
      </ScrollReveal>

      {/* 9. Meet Our Specialist Doctors: 3 cards */}
      <ScrollReveal>
        <SpecialistDoctorsSection />
      </ScrollReveal>

      {/* 10. Testimonials: Hear What Our Customers Have Said (Swiper Slider) */}
      <ScrollReveal>
        <TestimonialsSection testimonials={testimonials} />
      </ScrollReveal>

      {/* 11. Latest Blogs: 10 latest blogs (Swiper Slider, 3 at a time) */}
      <ScrollReveal>
        <LatestBlogSection blogs={blogs} />
      </ScrollReveal>

      {/* 12. Reusable Newsletter Banner (Container width with footer overlap) */}
      <ScrollReveal>
        <NewsletterBanner />
      </ScrollReveal>
    </div>
  );
}
