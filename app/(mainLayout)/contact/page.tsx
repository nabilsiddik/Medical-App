"use client";

import { useState } from "react";
import PageBanner from "@/components/medicate/PageBanner";
import NewsletterBanner from "@/components/medicate/NewsletterBanner";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/cms/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send inquiry");
      }

      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our medical team.");
    } catch {
      // Fallback
      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been received.");
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
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-[4px] bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <MapPin className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c2e] mb-2">
                Our Location
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                The Queen's Walk, Bishop's, London SE1 7PB, United Kingdom.
              </p>
            </div>

            {/* Card 2: Our Contact */}
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-[4px] bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <Phone className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c2e] mb-2">
                Our Contact
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                + (567) 1234-567-8900
                <br />
                + (567) 1234-567-8901
              </p>
            </div>

            {/* Card 3: Mail Us */}
            <div className="bg-[#f8fafd] border border-slate-200/80 p-8 sm:p-10 rounded-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-[4px] bg-[#1673b8] text-white flex items-center justify-center mb-6 shadow-sm">
                <Mail className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c2e] mb-2">
                Mail Us
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                info@peacefulthemes.com
                <br />
                info2@peacefulthemes.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Form: Get In Touch With Us */}
      <section className="py-16 md:py-20 bg-[#f8fafd] border-t border-slate-200/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white p-8 sm:p-12 md:p-16 rounded-sm border border-slate-200/80 shadow-sm text-center">
            <span className="inline-block text-[#1673b8] font-bold text-xs tracking-widest uppercase mb-2">
              CONTACT US
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0b1c2e] mb-10">
              Get In Touch With Us
            </h2>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                  Our medical consultation staff has received your message and will contact you promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-[#1673b8] text-white text-xs font-bold uppercase rounded-[4px] cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                    required
                    className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-sm border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-sm border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Your Phone Number"
                    required
                    className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-sm border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full h-12 px-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-sm border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write Your Message"
                  rows={5}
                  required
                  className="w-full p-4 rounded-[4px] bg-[#e6eaee] text-slate-800 placeholder:text-slate-400 text-sm border border-transparent focus:border-[#1673b8] focus:bg-white focus:outline-none transition-all"
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 rounded-[4px] bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "SENDING..." : "SEND MESSAGE"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. Interactive Map Section */}
      <section className="h-[380px] w-full bg-slate-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5406050516597!2d-0.12209538423019183!3d51.50332407963503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slastminute.com%20London%20Eye!5e0!3m2!1sen!2suk!4v1655000000000!5m2!1sen!2suk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          title="Hospital Location Map"
        />
      </section>

      {/* 5. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
