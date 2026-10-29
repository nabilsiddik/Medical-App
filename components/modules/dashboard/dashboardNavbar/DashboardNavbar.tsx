import { getLoggedInUser } from "@/services/user/userServices";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { UserRole, IUserInfo } from "@/types/user.interface";
import { ExternalLink } from "lucide-react";
import DashboardUserMenu from "./DashboardUserMenu";

export default async function DashboardNavbar() {
  const user = (await getLoggedInUser()) as IUserInfo | null;

  const isAdmin =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN ||
    (user?.role as string) === "ADMIN" ||
    (user?.role as string) === "DOCTOR";

  const profileUrl = isAdmin ? "/admin/dashboard/profile" : "/user/dashboard/profile";
  const securityUrl = isAdmin ? "/admin/dashboard/security" : "/user/dashboard/security";
  const dashboardUrl = isAdmin ? "/admin/dashboard" : "/user/dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all">
      {/* Left side: Sidebar trigger & breadcrumb hint */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg hover:bg-muted cursor-pointer" />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>Dashboard</span>
          <span>/</span>
          <span className="font-semibold text-foreground capitalize">
            {isAdmin ? "Admin Portal" : "User Portal"}
          </span>
        </div>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <DashboardUserMenu
          user={user}
          dashboardUrl={dashboardUrl}
          profileUrl={profileUrl}
          securityUrl={securityUrl}
        />
      </div>
    </header>
  );
}
