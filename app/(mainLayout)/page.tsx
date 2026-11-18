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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section (Includes its own fade & right-to-left slide animation) */}
      <HeroSection doctorName={doctorName} tagline={tagline} />

      {/* 2. Three Cards Section (Emergency Cases, Doctors Timetable, Opening Hours) with Staggered Scroll Reveal */}
      <HeroThreeCardsSection
        emergencyPhone={config?.emergencyPhone || config?.contact?.emergencyPhone}
        inquiryPhone={config?.contactPhone || config?.contact?.phone}
      />

      {/* 3. Medical Services: The Heart And Science Of Medicine Service (Staggered Photos, Checklist & CTA) */}
      <HeartScienceSection />

      {/* 4. Quality Caregiving Services: 3 Staggered Feature Cards */}
      <CaregivingServicesSection />

      {/* 5. Blue Split Banner: A Great Piece Of Medical Health Care (Animated Stats & Doctor Reveal) */}
      <MedicalHealthCareSection />

      {/* 6. A Wide Range Of Optometry / Medical Services with Center Doctor & 6 Staggered Service Cards */}
      <WideRangeServicesSection />

      {/* 7. Dark Navy Banner: Expect Nothing But The Best From Medical Technology */}
      <TechBannerSection />

      {/* 8. Feature: We Protect You In Any Sphere Of Life (Animated Progress Bars & Count-Up) */}
      <ProtectLifeSection />

      {/* 9. Meet Our Specialist Doctors: 3 Staggered Doctor Profile Cards */}
      <SpecialistDoctorsSection />

      {/* 10. Testimonials: Hear What Our Customers Have Said (Swiper Slider with Scroll Reveal) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 11. Latest Blogs: 10 latest blogs (Swiper Slider with Equal-Height Cards) */}
      <LatestBlogSection blogs={blogs} />
    </div>
  );
}
