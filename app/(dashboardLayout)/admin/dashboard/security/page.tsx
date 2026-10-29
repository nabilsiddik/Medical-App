export const dynamic = "force-dynamic";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { KeyRound } from "lucide-react";

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
          <KeyRound className="h-6 w-6 text-primary" />
          <span>Security & Password</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Update your administrator credentials and review security settings
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
