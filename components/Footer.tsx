import Link from "next/link";
import Logo from "./logo";
import { Phone, Mail, MapPin, ShieldAlert, Heart, Calendar } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Doctor Info */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Providing compassionate, evidence-based clinical care and modern patient management.
              Appointments available across Dhanmondi and Uttara chambers.
            </p>

            <div className="pt-2 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>Chamber Hotline: +880 1711-000111</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>help@carepractice.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Patient Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/book" className="hover:text-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary transition-colors">
                  Consultation Types
                </Link>
              </li>
              <li>
                <Link href="/#chambers" className="hover:text-primary transition-colors">
                  Chamber Schedules
                </Link>
              </li>
            </ul>
          </div>

          {/* Chamber Locations */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Chamber Locations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground block">Central Care Chamber</span>
                <span className="text-xs">Dhanmondi, Dhaka (Sat-Wed)</span>
              </li>
              <li>
                <span className="font-medium text-foreground block">Northside Specialized Chamber</span>
                <span className="text-xs">Uttara Sector 7, Dhaka (Thu-Fri)</span>
              </li>
            </ul>
          </div>

          {/* Practice & Staff */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Staff & Practice</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Doctor & Staff Portal
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  Pre-Visit Instructions
                </Link>
              </li>
              <li>
                <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>In case of acute medical emergencies, please visit the nearest hospital emergency ER immediately.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Care Practice. BMDC Reg: A-84920. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for Doctor Private Chamber Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
