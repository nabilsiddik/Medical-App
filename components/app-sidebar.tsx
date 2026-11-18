"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { IUserInfo, UserRole } from "@/types/user.interface";
import Logo from "@/components/logo";
import LogoutUserButton from "@/components/LogoutUserButton";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userInfo?: IUserInfo | null;
}

export function AppSidebar({ userInfo, ...props }: AppSidebarProps) {
  const isAdmin =
    userInfo?.role === UserRole.ADMIN ||
    (userInfo?.role as string) === "SUPER_ADMIN" ||
    (userInfo?.role as string) === "DOCTOR";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/60" {...props}>
      {/* Sidebar Workspace Header */}
      <SidebarHeader className="border-b border-sidebar-border/60 p-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              isAdmin
                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {userInfo?.role || "USER"}
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Navigation */}
      <SidebarContent className="px-2">
        <NavMain userInfo={userInfo} />
      </SidebarContent>

      {/* Sidebar Footer with NavUser & Logout Button */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-3 space-y-2">
        <NavUser user={userInfo} />
        <div className="pt-1">
          <LogoutUserButton variant="sidebar" />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
