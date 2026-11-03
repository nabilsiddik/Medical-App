"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  User as UserIcon,
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  FileText,
  UserCheck,
  LogIn,
  UserPlus,
  Stethoscope,
  ChevronDown,
  Activity,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LogoutUserButton from "@/components/LogoutUserButton";
import { useBranding } from "@/components/branding/BrandingProvider";

interface MedicateHeaderProps {
  user?: {
    id: string;
    fullName?: string;
    email?: string;
    role?: string;
    profilePhoto?: string | null;
  } | null;
}

export default function MedicateHeader({ user }: MedicateHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { branding, siteConfig } = useBranding();

  useEffect(() => {
    setMounted(true);
  }, []);

  const brandName = branding?.brandName || "Care Medical Chamber";

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
  const appointmentsUrl = isStaff ? "/admin/dashboard/appointments" : "/user/dashboard/appointments";
  const prescriptionsUrl = isStaff ? "/admin/dashboard/prescriptions" : "/user/dashboard/prescriptions";
  const profileUrl = isStaff ? "/admin/dashboard/profile" : "/user/dashboard/profile";

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "DOCTOR":
        return "Doctor";
      case "ASSISTANT":
        return "Staff";
      case "PATIENT":
        return "Patient";
      default:
        return "Member";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xs transition-all">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Dynamic Logo & Clinic Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
          {branding?.logoUrl ? (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 shadow-xs transition-transform group-hover:scale-105 border border-slate-100 dark:border-slate-800">
              <Image
                src={branding.logoUrl}
                alt={brandName}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
          <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-foreground truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[260px] md:max-w-none">
            {brandName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm xl:text-base font-bold tracking-wider transition-colors uppercase ${
                  isActive
                    ? "text-primary"
                    : "text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Container (Responsive: Mobile & Desktop) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop/Tablet Book Appointments Button */}
          <Link href="/book" className="hidden md:inline-flex">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm tracking-wider uppercase h-10 px-4 sm:px-5 rounded-md shadow-xs transition-all gap-1.5"
            >
              <span>APPOINTMENTS</span>
              <Plus className="h-4 w-4 stroke-[3]" />
            </Button>
          </Link>

          {/* User Account / Profile Dropdown (Both Desktop & Mobile) */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user ? (
                  <button
                    className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-primary/25 transition-all cursor-pointer focus:outline-hidden"
                    aria-label="User account menu"
                  >
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {user.profilePhoto ? (
                        <AvatarImage
                          src={user.profilePhoto}
                          alt={user.fullName || "User"}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                        {getInitials(user.fullName, user.email)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Desktop Name Display */}
                    <div className="hidden xl:flex flex-col text-left mr-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[110px] truncate leading-tight">
                        {user.fullName?.split(" ")[0] || "Account"}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden xl:block" />
                  </button>
                ) : (
                  <button
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer focus:outline-hidden"
                    aria-label="Account options"
                  >
                    <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-60 sm:w-64 p-2 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50"
              >
                {user ? (
                  <>
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg mb-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Signed In As
                      </p>
                      <p className="text-sm font-bold text-foreground truncate mt-0.5">
                        {user.fullName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                        {getRoleLabel(user.role)}
                      </div>
                    </div>

                    <DropdownMenuSeparator className="my-1" />

                    {/* Dashboard Link */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        <span>{isStaff ? "Doctor Portal" : "My Dashboard"}</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Appointments Link */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={appointmentsUrl}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>My Appointments</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Prescriptions & EMR */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={prescriptionsUrl}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Prescriptions & EMR</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Profile Link */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={profileUrl}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>Profile & Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Quick Book Appointment */}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/book"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <CalendarPlus className="h-4 w-4 text-primary" />
                        <span>Book New Visit</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1.5" />

                    {/* Sign Out Option (Prominently Accessible on Desktop & Mobile) */}
                    <div className="pt-0.5">
                      <LogoutUserButton variant="dropdown" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg mb-1.5">
                      <p className="text-xs font-bold text-foreground">Welcome to Care Portal</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Access appointments and verified digital prescriptions.
                      </p>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/login"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <LogIn className="h-4 w-4 text-primary" />
                        <span>Sign In</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/signup"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4 text-primary" />
                        <span>Register Patient</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/book"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <CalendarPlus className="h-4 w-4 text-primary" />
                        <span>Book Appointment</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/services"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span>Clinical Services</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          )}

          {/* Mobile Menu Trigger (Hamburger) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] sm:w-[360px] p-0 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                {/* Drawer Header */}
                <SheetHeader className="p-5 text-left border-b border-slate-100 dark:border-slate-800">
                  <SheetTitle className="flex items-center gap-2.5">
                    {branding?.logoUrl ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={branding.logoUrl}
                          alt={brandName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                        <Plus className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    )}
                    <span className="text-lg font-black text-foreground truncate">
                      {brandName}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Drawer Body */}
                <div className="p-5 space-y-5">
                  {/* User Profile Card in Mobile Menu */}
                  {user ? (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                          {user.profilePhoto ? (
                            <AvatarImage
                              src={user.profilePhoto}
                              alt={user.fullName || "User"}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {getInitials(user.fullName, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate">
                            {user.fullName || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={dashboardUrl}
                          onClick={() => setMobileOpen(false)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          <span>{isStaff ? "Doctor Portal" : "Dashboard"}</span>
                        </Link>
                        <Link
                          href={profileUrl}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                          title="Profile"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-foreground text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-1">
                      Navigation
                    </p>
                    {navLinks.map((link) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between text-sm font-bold tracking-wide py-2.5 px-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Book Appointment CTA */}
                  <div className="pt-2">
                    <Link
                      href="/book"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider shadow-md hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                      <span>Book Consultation</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer (Sign out for logged in users & Contact Info) */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {user ? (
                  <div onClick={() => setMobileOpen(false)}>
                    <LogoutUserButton variant="button" className="w-full justify-center" />
                  </div>
                ) : null}

                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground pt-1">
                  {siteConfig?.contactPhone ? (
                    <a
                      href={`tel:${siteConfig.contactPhone.replace(/[^0-9+]/g, "")}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{siteConfig.contactPhone}</span>
                    </a>
                  ) : null}
                  {siteConfig?.contactEmail ? (
                    <a
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{siteConfig.contactEmail}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
