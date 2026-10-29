"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
    <div className="relative z-20 -mb-16 sm:-mb-20 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-5 sm:gap-6 text-center lg:text-left w-full lg:w-auto">
              <div className="shrink-0 flex items-center justify-center">
                <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-primary-foreground stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground leading-snug">
                  Latest Updates Subscribe
                  <span className="block">To Our Newsletter</span>
                </h3>
              </div>
            </div>

            {/* Right: Email Subscription Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch sm:items-center w-full lg:max-w-md gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  required
                  disabled={loading}
                  className="w-full h-12 px-5 rounded-lg bg-white/20 text-white placeholder:text-white/80 border border-white/30 focus:outline-none focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 transition-all font-medium text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 px-8 rounded-lg bg-white text-primary font-bold text-base uppercase tracking-wider hover:bg-slate-100 transition-colors shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? "..." : "SUBSCRIBE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
