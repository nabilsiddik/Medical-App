"use client";

import { useState } from "react";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { MapPin, Phone, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "@/components/branding/BrandingProvider";

export default function ContactPage() {
  const { siteConfig } = useBranding();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const clinicPhone = siteConfig?.contact?.phone || siteConfig?.contactPhone || "+880 1700-112233";
  const clinicAltPhone = siteConfig?.contact?.emergencyPhone || "+880 1957-282230";
  const clinicEmail = siteConfig?.contact?.email || siteConfig?.contactEmail || "nabilsiddik70@gmail.com";
  const clinicAddress =
    siteConfig?.contact?.address ||
    "Suite 402, Green Crescent Tower, Road 7/A, Dhanmondi, Dhaka-1209, Bangladesh";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please provide your name, phone number, and inquiry message.");
      return;
    }

    setLoading(true);
    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${serverUrl}/cms/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit your inquiry.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      toast.success("Thank you! Your message has been sent to our medical team.");
    } catch (error: any) {
      toast.error(error?.message || "Could not send message. Please try again or call our hotline directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* 1. Header Breadcrumb Banner */}
      <PageBanner
        title="Contact Us"
        breadcrumbs={[{ label: "CONTACT US" }]}
        backgroundImage="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1800&q=80"
      />

      {/* 2. Top 3 Info Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Our Location */}
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-xl text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <MapPin className="h-7 w-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0b1c2e] mb-2">
                Our Location
              </h3>
              <p className="text-base text-slate-600 leading-relaxed max-w-xs">
                {clinicAddress}
              </p>
            </div>

            {/* Card 2: Our Contact */}
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-xl text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <Phone className="h-7 w-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0b1c2e] mb-2">
                Our Contact
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                <a href={`tel:${clinicPhone.replace(/\s+/g, '')}`} className="hover:text-[#1673b8] transition-colors block">
                  {clinicPhone}
                </a>
                <a href={`tel:${clinicAltPhone.replace(/\s+/g, '')}`} className="hover:text-[#1673b8] transition-colors block mt-1">
                  {clinicAltPhone}
                </a>
              </p>
            </div>

            {/* Card 3: Mail Us */}
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-xl text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <Mail className="h-7 w-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0b1c2e] mb-2">
                Mail Us
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                <a href={`mailto:${clinicEmail}`} className="hover:text-[#1673b8] transition-colors block">
                  {clinicEmail}
                </a>
                <span className="text-slate-500 block mt-1">
                  24/7 Patient Helpdesk
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Form: Get In Touch With Us */}
      <section className="py-16 md:py-20 bg-[#f8fafd] border-t border-slate-200/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white p-8 sm:p-12 md:p-16 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <span className="inline-block text-[#1673b8] font-bold text-base tracking-widest uppercase mb-2">
              CONTACT US
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] mb-10">
              Get In Touch With Us
            </h2>

            {submitted ? (
              <div className="p-8 sm:p-10 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-base text-emerald-800 mt-2 max-w-lg mx-auto leading-relaxed">
                  Our medical consultation staff and doctor have received your inquiry. We will contact you shortly via phone or email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-8 py-3.5 bg-[#1673b8] hover:bg-[#0f5991] text-white text-base font-bold uppercase rounded-lg cursor-pointer transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-bold text-[#0b1c2e] mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Name"
                      required
                      className="w-full h-13 px-4 rounded-lg bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#0b1c2e] mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email"
                      className="w-full h-13 px-4 rounded-lg bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-bold text-[#0b1c2e] mb-2">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +880 1700-112233"
                      required
                      className="w-full h-13 px-4 rounded-lg bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-bold text-[#0b1c2e] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Consultation query, report review, etc."
                      className="w-full h-13 px-4 rounded-lg bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-bold text-[#0b1c2e] mb-2">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your health question, symptoms, or inquiry details..."
                    rows={5}
                    required
                    className="w-full p-4 rounded-lg bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-base border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all resize-y"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-13 px-10 rounded-lg bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. Interactive Chamber Map Section */}
      <section className="h-[400px] w-full bg-slate-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.03694485072!2d90.367107!3d23.74705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33cff1339%3A0x633d7b8769399436!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          title="Doctor Chamber Location Map"
        />
      </section>

      {/* 5. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
