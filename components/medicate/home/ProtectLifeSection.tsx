export default function ProtectLifeSection() {
  const skills = [
    { label: "Heart Rate & Cardiology Care", percent: 85 },
    { label: "Diagnostic Accuracy & Screening", percent: 95 },
    { label: "Post-Treatment Patient Recovery", percent: 90 },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Text & Progress Bars */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-[#1673b8] font-bold text-xs tracking-widest uppercase">
              FEATURE
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] leading-tight">
              We Protect You In Any Sphere Of Life
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Our clinical protocol is built on preventive medicine and personalized therapeutic pathways. We combine evidence-based clinical assessments with patient-centered communication to optimize outcomes across all ages.
            </p>

            {/* Progress / Skill Bars */}
            <div className="space-y-5 pt-3">
              {skills.map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#0b1c2e]">
                    <span>{s.label}</span>
                    <span className="text-[#1673b8]">{s.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#eaedf2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1673b8] rounded-full transition-all duration-1000"
                      style={{ width: `${s.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Consultation Photo */}
          <div className="lg:col-span-6">
            <div className="rounded overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
                alt="Doctor consulting with patient"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
