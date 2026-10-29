"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Plus, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MedicateHeaderProps {
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profilePhoto?: string | null;
  } | null;
}

export default function MedicateHeader({ user }: MedicateHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SERVICES", href: "/services" },
    { label: "BLOG", href: "/blog" },
    { label: "CONTACT US", href: "/contact" },
  ];

  const isStaff =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "DOCTOR" ||
    user?.role === "ASSISTANT";

  const dashboardUrl = isStaff ? "/admin/dashboard" : "/user/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xs transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-[#1673b8] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0b1c2e] dark:text-white">
            Medicate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-bold tracking-wider transition-colors uppercase ${
                  isActive
                    ? "text-[#1673b8]"
                    : "text-slate-700 dark:text-slate-200 hover:text-[#1673b8] dark:hover:text-[#1673b8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          {/* User Account / Dashboard Link if logged in */}
          {user ? (
            <Link
              href={dashboardUrl}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#1673b8] px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#1673b8]" />
              <span>{isStaff ? "Doctor Portal" : "My Dashboard"}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1673b8] transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              <span>LOGIN</span>
            </Link>
          )}

          {/* Appointment Button */}
          <Link href="/book">
            <Button
              className="bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-[13px] tracking-wider uppercase h-11 px-5 rounded-[4px] shadow-sm transition-all"
            >
              <span>APPOINTMENTS</span>
              <Plus className="h-4 w-4 stroke-[3]" />
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-6 bg-white dark:bg-slate-900">
              <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#1673b8] flex items-center justify-center text-white">
                    <Plus className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <span className="text-xl font-black text-[#0b1c2e] dark:text-white">
                    Medicate
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-100 hover:text-[#1673b8] py-2 border-b border-slate-100 dark:border-slate-800"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 space-y-3">
                  {user ? (
                    <Link
                      href={dashboardUrl}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#1673b8]" />
                      <span>{isStaff ? "Doctor Portal" : "My Dashboard"}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Login to Account</span>
                    </Link>
                  )}

                  <Link
                    href="/book"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-[4px] bg-[#1673b8] text-white text-sm font-bold uppercase tracking-wider shadow-sm"
                  >
                    <span>Book Appointment</span>
                    <Plus className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
