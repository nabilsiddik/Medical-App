"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IUserInfo, UserRole } from "@/types/user.interface";
import LogoutUserButton from "@/components/LogoutUserButton";
import { ChevronsUpDown, User, KeyRound, LayoutDashboard } from "lucide-react";

export function NavUser({ user }: { user?: IUserInfo | null }) {
  const { isMobile } = useSidebar();

  if (!user) return null;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isAdmin = user.role === UserRole.ADMIN || (user.role as string) === "SUPER_ADMIN" || (user.role as string) === "DOCTOR";
  const profileUrl = isAdmin ? "/admin/dashboard/profile" : "/user/dashboard/profile";
  const securityUrl = isAdmin ? "/admin/dashboard/security" : "/user/dashboard/security";
  const dashboardUrl = isAdmin ? "/admin/dashboard" : "/user/dashboard";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl p-2 cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <Avatar className="h-9 w-9 ring-1 ring-primary/20 shrink-0">
                <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold text-foreground text-xs">
                  {user.fullName || "User"}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl p-2 shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center gap-2.5 text-left">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
                  <AvatarFallback className="rounded-lg bg-primary text-white text-xs font-semibold">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-semibold text-foreground text-xs">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-muted text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href={dashboardUrl}>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-xs">
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  <span>Overview</span>
                </DropdownMenuItem>
              </Link>
              <Link href={profileUrl}>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-xs">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link href={securityUrl}>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-xs">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <span>Security & Password</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="p-0 focus:bg-destructive/10">
              <LogoutUserButton variant="dropdown" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavUser;
