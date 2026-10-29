"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, User, Phone, Mail, Stethoscope, ChevronRight, CheckCircle2 } from "lucide-react";

interface QuickAppointmentBarProps {
  services?: { id: string; name: string; slug: string }[];
  locations?: { id: string; name: string }[];
}

export default function QuickAppointmentBar({
  services = [
    { id: "srv-cardio", name: "Cardiology Consultation", slug: "cardiology" },
    { id: "srv-general", name: "General Clinical Medicine", slug: "general-medicine" },
    { id: "srv-diabetes", name: "Diabetes & Endocrinology", slug: "endocrinology" },
    { id: "srv-neuro", name: "Neurology Checkup", slug: "neurology" },
    { id: "srv-eye", name: "Optometry & Eye Care", slug: "eye-care" },
  ],
  locations = [
    { id: "loc-central", name: "Central Medical Chamber" },
  ],
}: QuickAppointmentBarProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Set min date to today
  const todayStr = new Date().toISOString().split("T")[0];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }

    setSubmitting(true);
    try {
      const chamberLocationId = locations[0]?.id || "loc-central";

      const res = await fetch("/api/proxy/appointment/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          appointmentDate,
          chamberLocationId,
          serviceId: serviceId || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Appointment request received successfully!");
        setBookingSuccess(data.data);
      } else {
        // Redirect to booking page with prefilled parameters
        const search = new URLSearchParams({
          date: appointmentDate,
          name: fullName,
          phone,
          ...(email ? { email } : {}),
        });
        router.push(`/book?${search.toString()}`);
      }
    } catch (err) {
      // Graceful fallback to dedicated booking wizard
      router.push(`/book?date=${appointmentDate}&name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
      <div className="bg-[#0b1c2e] rounded-md shadow-2xl p-6 sm:p-8 border border-white/10">
        {/* Top Tag Badge */}
        <div className="inline-block bg-primary text-primary-foreground text-base font-bold uppercase tracking-wider px-5 py-2.5 rounded-t-sm -mt-6 sm:-mt-8 mb-6">
          ONLINE DOCTOR VISIT
        </div>

        {bookingSuccess ? (
          <div className="p-6 bg-[#132c48] rounded-md border border-white/15 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Appointment Confirmed!</h3>
                <p className="text-base text-slate-300 mt-1">
                  Reference: <span className="text-emerald-300 font-mono font-bold">{bookingSuccess.appointmentRef}</span> • Date: {appointmentDate}
                </p>
                <p className="text-base text-slate-400 mt-1">
                  A patient account has been created with your contact information. You can log in anytime using your phone or email.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setBookingSuccess(null)}
                className="px-5 py-2.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-base font-bold text-white transition-colors cursor-pointer"
              >
                Book Another
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2.5 rounded-[4px] bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold transition-colors cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* 1. Name Input */}
            <div className="space-y-1.5">
              <label className="text-base font-semibold tracking-wider text-slate-300 uppercase">
                Patient Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Your Name"
                required
                className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* 2. Phone Input */}
            <div className="space-y-1.5">
              <label className="text-base font-semibold tracking-wider text-slate-300 uppercase">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +880 1700-000000"
                required
                className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* 3. Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-base font-semibold tracking-wider text-slate-300 uppercase">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* 4. Date Picker */}
            <div className="space-y-1.5">
              <label className="text-base font-semibold tracking-wider text-slate-300 uppercase">
                Appointment Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 text-base border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* 5. Service & Submit */}
            <div className="space-y-1.5">
              <label className="text-base font-semibold tracking-wider text-slate-300 uppercase">
                Medical Service
              </label>
              <div className="flex gap-2">
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="flex-1 h-12 px-3 rounded-[4px] bg-[#e6eaee] text-slate-800 text-base border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 px-6 rounded-[4px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base uppercase tracking-wider transition-colors shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "..." : "BOOK"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
