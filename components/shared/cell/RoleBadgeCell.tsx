import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/user.interface";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

export const RoleBadgeCell = ({ role }: { role?: UserRole | string }) => {
  if (role === UserRole.SUPER_ADMIN || role === "SUPER_ADMIN") {
    return (
      <Badge
        variant="outline"
        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
      >
        <ShieldAlert className="h-3.5 w-3.5" />
        SUPER ADMIN
      </Badge>
    );
  }

  if (role === UserRole.ADMIN || role === "ADMIN") {
    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        ADMIN
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
    >
      <User className="h-3.5 w-3.5" />
      USER
    </Badge>
  );
};
