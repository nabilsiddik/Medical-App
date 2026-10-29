import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user.interface";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const StatusBadgeCell = ({ status }: { status?: UserStatus | string }) => {
  if (status === UserStatus.ACTIVE || status === "ACTIVE") {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        ACTIVE
      </Badge>
    );
  }

  if (status === UserStatus.BLOCKED || status === "BLOCKED") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        BLOCKED
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 font-medium text-xs gap-1 px-2.5 py-0.5"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      DELETED
    </Badge>
  );
};

export const VerifiedBadgeCell = ({ isVerified }: { isVerified?: boolean }) => {
  if (isVerified) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>Verified</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <span>Unverified</span>
    </div>
  );
};