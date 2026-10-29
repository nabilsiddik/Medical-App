"use client";

import { useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { ChevronRight, ChevronDown, Check, Plus, PhoneCall } from "lucide-react";

export default function ServicesPage() {
  const serviceCategories = [
    { name: "Angioplasty Services", slug: "angioplasty" },
    { name: "Cardiology Services", slug: "cardiology" },
    { name: "Dental Services", slug: "dental" },
    { name: "Endocrinology Services", slug: "endocrinology" },
    { name: "Eye Care Services", slug: "eye-care" },
    { name: "Neurology Services", slug: "neurology" },
    { name: "Orthopaedics Services", slug: "orthopaedics" },
    { name: "RMI Services", slug: "rmi" },
  ];

  const [activeSlug, setActiveSlug] = useState("endocrinology");
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const activeService = serviceCategories.find((s) => s.slug === activeSlug) || serviceCategories[3];

  const faqs = [
    {
      q: "Where Can I Go To Provide A Sample For Testing?",
      a: "Our central medical diagnostic chamber provides rapid specimen collection facilities with accredited pathology protocols and swift turnaround reports.",
    },
    {
      q: "What Happens To My Sample Once I Have Provided It?",
      a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Standardized automated analysers process all samples under medical laboratory quality control.",
    },
    {
      q: "What Will Laboratory Testing Cost Me?",
      a: "All diagnostic tests follow standard transparent institutional tariff rates. Detailed itemized estimates are provided at reception prior to collection.",
    },
  ];

  const checklist = [
    "Aliquam tincidunt nisl vitae nulla molestie.",
    "Praesent convallis odio elementum tortor.",
    "Nunc molestie erat nisi vehicula pellentesque.",
    "Cras id purus faucibus, euismod metus.",
    "Aenean et libero tincidunt, auctor urna.",
    "There are many variations of passages of Lorem.",
    "Ipsum available, but the majority have suffered.",
    "Alteration in some form, by injected humour.",
    "Randomised words which don't look.",
    "Slightly believable. If you are going.",
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Breadcrumb Banner */}
      <PageBanner
        title={activeService.name}
        breadcrumbs={[
          { label: "SERVICES", href: "/services" },
          { label: activeService.name },
        ]}
      />

      {/* 2. Main Services Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Service Navigation List */}
              <div className="bg-[#f8fafd] border border-slate-200/80 rounded-sm overflow-hidden p-2">
                {serviceCategories.map((srv) => {
                  const isActive = srv.slug === activeSlug;
                  return (
                    <button
                      key={srv.slug}
                      onClick={() => setActiveSlug(srv.slug)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-[4px] text-xs font-bold tracking-wide transition-all mb-1 cursor-pointer ${
                        isActive
                          ? "bg-[#1673b8] text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-200/70"
                      }`}
                    >
                      <span>{srv.name}</span>
                      <ChevronRight
                        className={`h-4 w-4 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Promo Banner with Nurse Photo */}
              <div className="bg-[#eaf1f8] rounded-sm p-6 sm:p-8 text-center relative overflow-hidden border border-slate-200/60">
                <h3 className="text-xl font-black text-[#0b1c2e] leading-tight mb-4">
                  Ready To Get Expert
                  <br />
                  Our Services
                </h3>

                <Link href="/contact">
                  <button className="px-5 py-2.5 rounded-[4px] bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer mb-6">
                    <span>CONTACT US</span>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </Link>

                <div className="relative mt-2">
                  <img
                    src="https://images.unsplash.com/photo-1594824813579-99435b5a886a?auto=format&fit=crop&w=500&q=80"
                    alt="Nurse consultation"
                    className="w-48 h-56 object-cover mx-auto rounded-t-full shadow-md border-4 border-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Main Detail Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Image */}
              <div className="rounded overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                  alt={activeService.name}
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                />
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0b1c2e] mb-4">
                  Professional Medical Service Of {activeService.name.replace(" Services", "")}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Medicate is a long established clinical institution providing comprehensive patient-centered care. When looking at health management, preventive routines and early clinical interventions provide superior health longevity.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our specialists evaluate metabolic parameters, hormone cascades, and vital gland markers using modern diagnostic equipment and certified evidence-based regimens.
                </p>
              </div>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-slate-100">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-[#1673b8] shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Advantage Section */}
              <div>
                <h3 className="text-xl font-black text-[#0b1c2e] mb-3">
                  Advantage {activeService.name.replace(" Services", "")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Continuous patient follow-ups, precise pharmacological titration, and dietary lifestyle counsel empower individuals to effectively resolve complex metabolic disorders.
                </p>

                {/* 2 Side-by-side Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80"
                      alt="Doctor examination"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  <div className="rounded overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
                      alt="Blood pressure consultation"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Health Tips & Info Accordion */}
              <div className="pt-4">
                <h3 className="text-xl font-black text-[#0b1c2e] mb-2">
                  Health Tips & Info
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Common diagnostic and clinical questions addressed by our senior consultant.
                </p>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-[4px] overflow-hidden border border-slate-200/80 transition-all"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className={`w-full flex items-center justify-between p-4 text-left text-xs font-bold transition-colors cursor-pointer ${
                            isOpen
                              ? "bg-[#1673b8] text-white"
                              : "bg-[#f8fafd] text-[#0b1c2e] hover:bg-slate-100"
                          }`}
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0 rotate-180 transition-transform" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
