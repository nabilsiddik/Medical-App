export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/services/user/userServices";
import ProfileForm from "@/components/forms/ProfileForm";
import { User } from "lucide-react";

export default async function UserProfilePage() {
  const user = await getLoggedInUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 pb-2 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
          <User className="h-6 w-6 text-primary" />
          <span>My Profile Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Update your public profile, contact details, and account preferences
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
