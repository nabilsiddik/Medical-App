"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/types/user.interface";
import { StatusBadgeCell, VerifiedBadgeCell } from "../shared/cell/StatusBadgeCell";
import { RoleBadgeCell } from "../shared/cell/RoleBadgeCell";
import { DateCell } from "../shared/cell/DateCell";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  UserCheck,
} from "lucide-react";

interface UserDetailModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
}: UserDetailModalProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-foreground">
            User Account Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-lg">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-base font-semibold text-foreground truncate">
                {user.fullName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <RoleBadgeCell role={user.role} />
                <StatusBadgeCell status={user.status} />
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-xs">{user.email}</span>
                <VerifiedBadgeCell isVerified={user.isEmailVerified} />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </div>
              <span className="font-medium text-foreground text-xs">
                {user.phoneNumber || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </div>
              <span className="font-medium text-foreground text-xs truncate max-w-[200px]">
                {user.address || "Not specified"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Gender</span>
              </div>
              <span className="font-medium text-foreground text-xs capitalize">
                {user.gender?.toLowerCase() || "Unspecified"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Registered On</span>
              </div>
              <DateCell date={user.createdAt} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last Updated</span>
              </div>
              <DateCell date={user.updatedAt} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailModal;
