import Link from "next/link";
import { Plus } from "lucide-react";

export default function MedicalHealthCareSection() {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Solid Blue Info Block */}
        <div className="bg-[#1673b8] text-white p-10 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="max-w-xl lg:ml-auto">
            <span className="inline-block text-blue-200 font-bold text-xs tracking-widest uppercase mb-3">
              SPECIAL SERVICES
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
              A Great Piece Of Medical Health Care
            </h2>

            <p className="text-blue-100 text-sm leading-relaxed mb-10">
              Our clinical practice delivers continuous care across diagnostic medicine, targeted therapies, and preventive regimens. Every treatment protocol is formulated to maximize patient recovery with safety and precision.
            </p>

            {/* Stat Counters */}
            <div className="flex items-center gap-14 border-t border-white/20 pt-8">
              <div>
                <span className="block text-4xl sm:text-5xl font-black tracking-tight text-white">
                  85+
                </span>
                <span className="text-xs font-semibold text-blue-200 tracking-wider uppercase mt-1 block">
                  Medical Specialists
                </span>
              </div>

              <div>
                <span className="block text-4xl sm:text-5xl font-black tracking-tight text-white">
                  1205+
                </span>
                <span className="text-xs font-semibold text-blue-200 tracking-wider uppercase mt-1 block">
                  Happy Patients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Doctor Image */}
        <div className="relative min-h-[380px] lg:min-h-[500px] bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
            alt="Doctor examining clinical charts"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
