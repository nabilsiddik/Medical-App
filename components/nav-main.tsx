"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  Tv,
  Stethoscope,
  ShieldCheck,
  User,
  KeyRound,
  MessageSquare,
  Bot,
  PlusCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { IUserInfo, UserRole } from "@/types/user.interface";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function NavMain({ userInfo }: { userInfo?: IUserInfo | null }) {
  const pathname = usePathname();

  const isStaff =
    userInfo?.role === UserRole.ADMIN ||
    (userInfo?.role as string) === "SUPER_ADMIN" ||
    (userInfo?.role as string) === "DOCTOR";

  const doctorNavGroups: { label: string; items: NavItem[] }[] = [
    {
      label: "Clinical Operations",
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Appointments",
          url: "/admin/dashboard/appointments",
          icon: Calendar,
        },
        {
          title: "Patients & Records",
          url: "/admin/dashboard/patients",
          icon: Users,
        },
        {
          title: "Prescriptions (Rx)",
          url: "/admin/dashboard/prescriptions",
          icon: FileText,
        },
        {
          title: "Live Queue Board",
          url: "/admin/dashboard/queue",
          icon: Tv,
        },
      ],
    },
    {
      label: "AI & Communication",
      items: [
        {
          title: "Live Chat Inbox",
          url: "/admin/dashboard/chat",
          icon: MessageSquare,
        },
        {
          title: "Google Sheet AI KB",
          url: "/admin/dashboard/google-sheet",
          icon: Bot,
        },
      ],
    },
    {
      label: "Services & Finance",
      items: [
        {
          title: "Services & Pricing",
          url: "/admin/dashboard/services",
          icon: Stethoscope,
        },
        {
          title: "Billing & Cash-Up",
          url: "/admin/dashboard/billing",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Practice & Chambers",
      items: [
        {
          title: "Doctor Schedules",
          url: "/admin/dashboard/schedules",
          icon: Clock,
        },
        {
          title: "Medical Blogs",
          url: "/admin/dashboard/blogs",
          icon: BookOpen,
        },
        {
          title: "Chambers & Settings",
          url: "/admin/dashboard/settings",
          icon: Settings,
        },
        {
          title: "Doctor Profile",
          url: "/admin/dashboard/profile",
          icon: User,
        },
      ],
    },
  ];

  const patientNavGroups: { label: string; items: NavItem[] }[] = [
    {
      label: "Patient Portal",
      items: [
        {
          title: "Overview",
          url: "/user/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "My Appointments",
          url: "/user/dashboard/appointments",
          icon: Calendar,
        },
        {
          title: "My Prescriptions",
          url: "/user/dashboard/prescriptions",
          icon: FileText,
        },
        {
          title: "Book Appointment",
          url: "/book",
          icon: PlusCircle,
        },
        {
          title: "My Profile",
          url: "/user/dashboard/profile",
          icon: User,
        },
        {
          title: "Security",
          url: "/user/dashboard/security",
          icon: KeyRound,
        },
      ],
    },
  ];

  const navGroups = isStaff ? doctorNavGroups : patientNavGroups;

  return (
    <div className="space-y-4 py-2">
      {navGroups.map((group) => (
        <SidebarGroup key={group.label} className="px-2">
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-2">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.url === "/admin/dashboard" || item.url === "/user/dashboard"
                  ? pathname === item.url
                  : pathname.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 text-base font-medium rounded-xl transition-all duration-150 cursor-pointer",
                      isActive
                        ? "!bg-primary !text-white shadow-xs font-semibold hover:!bg-primary/95 hover:!text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Link href={item.url}>
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "!text-white" : "text-slate-500"
                        )}
                      />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-base px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
export default NavMain;
