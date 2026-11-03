"use client";

import React, { useState } from "react";
import { Mail, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/shared/animations/ScrollReveal";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    }, 500);
  };

  return (
    <div className="relative z-20 -mb-10 sm:-mb-14 lg:-mb-16 px-3 sm:px-6 lg:px-8">
      <div className="container max-w-5xl mx-auto">
        <ScrollReveal delay={0} yOffset={20}>
          <div className="bg-gradient-to-r from-primary to-[#0284c7] text-white rounded-2xl p-5 sm:p-8 lg:p-10 shadow-2xl border border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left: Icon & Clean Text */}
              <div className="flex items-center gap-3.5 sm:gap-5 text-left w-full lg:w-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Mail className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2]" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-white/80 uppercase">
                    <Sparkles className="h-3 w-3" /> Stay Updated
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight mt-0.5">
                    Subscribe To Our Newsletter
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 hidden sm:block">
                    Receive expert health guidelines, clinical insights, and clinic updates.
                  </p>
                </div>
              </div>

              {/* Right: Email Subscription Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center w-full lg:max-w-md gap-2.5 sm:gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                    className="w-full h-11 sm:h-12 px-4 rounded-xl bg-white/15 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition-all font-medium text-sm sm:text-base shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-white text-primary font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-slate-100 transition-colors shrink-0 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{loading ? "..." : "SUBSCRIBE"}</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
