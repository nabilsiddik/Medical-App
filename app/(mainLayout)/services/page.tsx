"use client";

import { useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { ChevronRight, ChevronDown, Check, Plus } from "lucide-react";

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
      a: "Standardized automated analysers process all samples under medical laboratory quality control with review by our senior consultant.",
    },
    {
      q: "What Will Laboratory Testing Cost Me?",
      a: "All diagnostic tests follow standard transparent institutional tariff rates. Detailed itemized estimates are provided at reception prior to collection.",
    },
  ];

  const checklist = [
    "Routine clinical evaluation & computerized triage.",
    "Comprehensive diagnostic lab testing with precision reports.",
    "Preventive metabolic and cardiovascular assessments.",
    "Targeted medication reviews and dosage optimization.",
    "Post-procedure lifestyle and dietary guidance.",
    "Continuous digital follow-up through patient portal.",
    "Verified computerised prescriptions delivered directly to SMS.",
    "Round-the-clock emergency inquiry triage support.",
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
              <div className="bg-[#f8fafd] border border-slate-200/80 rounded-xl overflow-hidden p-3 shadow-xs">
                {serviceCategories.map((srv) => {
                  const isActive = srv.slug === activeSlug;
                  return (
                    <button
                      key={srv.slug}
                      onClick={() => setActiveSlug(srv.slug)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg text-base font-bold tracking-wide transition-all mb-1.5 cursor-pointer ${
                        isActive
                          ? "bg-[#1673b8] text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-200/70"
                      }`}
                    >
                      <span>{srv.name}</span>
                      <ChevronRight
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Promo Banner with Verified Doctor Photo */}
              <div className="bg-[#eaf1f8] rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden border border-slate-200/60 shadow-xs">
                <h3 className="text-2xl font-black text-[#0b1c2e] leading-tight mb-4">
                  Ready To Get Expert
                  <br />
                  Our Services
                </h3>

                <Link href="/contact">
                  <button className="px-6 py-3 rounded-lg bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer mb-6 active:scale-98">
                    <span>CONTACT US</span>
                    <Plus className="h-4 w-4 stroke-[3]" />
                  </button>
                </Link>

                {/* Verified High-Res Medical Portrait Image */}
                <div className="relative mt-2">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
                    alt="Doctor consultation"
                    className="w-52 h-64 object-cover mx-auto rounded-t-full shadow-lg border-4 border-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Main Detail Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                  alt={activeService.name}
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                />
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] mb-4">
                  Professional Medical Service Of {activeService.name.replace(" Services", "")}
                </h2>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-4">
                  Medicate is a long established clinical institution providing comprehensive patient-centered care. When looking at health management, preventive routines and early clinical interventions provide superior health longevity.
                </p>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  Our specialists evaluate metabolic parameters, hormone cascades, and vital gland markers using modern diagnostic equipment and certified evidence-based regimens.
                </p>
              </div>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-200">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-base font-medium text-slate-800 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Advantage Section */}
              <div>
                <h3 className="text-2xl font-black text-[#0b1c2e] mb-3">
                  Advantage {activeService.name.replace(" Services", "")}
                </h3>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
                  Continuous patient follow-ups, precise pharmacological titration, and dietary lifestyle counsel empower individuals to effectively resolve complex metabolic disorders.
                </p>

                {/* 2 Side-by-side Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80"
                      alt="Doctor examination"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-xs">
                    <img
                      src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
                      alt="Blood pressure consultation"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Health Tips & Info Accordion */}
              <div className="pt-4">
                <h3 className="text-2xl font-black text-[#0b1c2e] mb-2">
                  Health Tips & Clinical FAQ
                </h3>
                <p className="text-base text-slate-600 mb-6">
                  Common diagnostic and clinical questions addressed by our senior consultant.
                </p>

                <div className="space-y-3.5">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden border border-slate-200/80 transition-all shadow-xs"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className={`w-full flex items-center justify-between p-5 text-left text-base font-bold transition-colors cursor-pointer ${
                            isOpen
                              ? "bg-[#1673b8] text-white"
                              : "bg-[#f8fafd] text-[#0b1c2e] hover:bg-slate-100"
                          }`}
                        >
                          <span className="pr-4">{faq.q}</span>
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 shrink-0 rotate-180 transition-transform" />
                          ) : (
                            <ChevronDown className="h-5 w-5 shrink-0 transition-transform" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="p-5 bg-white text-base text-slate-700 leading-relaxed border-t border-slate-100">
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
