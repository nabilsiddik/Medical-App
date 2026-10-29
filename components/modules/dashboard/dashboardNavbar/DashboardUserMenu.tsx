"use client";

import React, { useState, useEffect } from "react";
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
import LogoutUserButton from "@/components/LogoutUserButton";
import Link from "next/link";
import { IUserInfo } from "@/types/user.interface";
import { User, KeyRound, LayoutDashboard } from "lucide-react";

interface DashboardUserMenuProps {
  user: IUserInfo | null;
  dashboardUrl: string;
  profileUrl: string;
  securityUrl: string;
}

export default function DashboardUserMenu({
  user,
  dashboardUrl,
  profileUrl,
  securityUrl,
}: DashboardUserMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Static button before hydration to avoid Radix UI ID mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2.5 p-1 rounded-full">
        <Avatar className="h-8 w-8 ring-2 ring-primary/20">
          <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
          <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-semibold">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-foreground leading-none">
            {user.fullName}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 capitalize">
            {user.role?.toLowerCase().replace("_", " ")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-semibold">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-none">
              {user.fullName}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 capitalize">
              {user.role?.toLowerCase().replace("_", " ")}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-semibold leading-none text-foreground">
              {user.fullName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={dashboardUrl}>
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
              <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href={profileUrl}>
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>My Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={securityUrl}>
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs">
              <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Security Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <div className="p-1">
          <LogoutUserButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

