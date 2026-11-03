export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/services/user/userServices";
import { getClinicSettings } from "@/services/doctor/clinicServices";
import ProfileForm from "@/components/forms/ProfileForm";
import DoctorCredentialsForm from "@/components/forms/DoctorCredentialsForm";
import { User, Stethoscope } from "lucide-react";

export default async function AdminProfilePage() {
  const [user, settings] = await Promise.all([
    getLoggedInUser(),
    getClinicSettings(),
  ]);

  return (
    <div className="space-y-8">
      {/* 1. Doctor Credentials Form */}
      <DoctorCredentialsForm settings={settings} />

      {/* 2. Account Credentials & Security Form */}
      <div className="pt-4 border-t border-border/60">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Login Account & Personal Info</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your admin login name, email, phone number, and avatar
          </p>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
