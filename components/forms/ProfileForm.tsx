"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile, deleteMyAccount } from "@/services/user/userServices";
import { IUser } from "@/types/user.interface";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  AlertCircle,
  Trash2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileFormProps {
  user: IUser | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profilePhoto || null
  );
  const [gender, setGender] = useState<string>(user?.gender || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const [state, formAction, isPending] = useActionState(updateUserProfile, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success("Profile updated successfully!");
      router.refresh();
    }
  }, [state, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteMyAccount();
      if (res?.success) {
        toast.success("Account deactivated successfully.");
        router.push("/login");
      } else {
        toast.error(res?.message || "Failed to delete account");
      }
    } catch (err: any) {
      toast.error("Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Profile Edit Card */}
      <Card className="border border-border/70 bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            Personal Information
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Update your public profile information, avatar, and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
              <Avatar className="h-18 w-18 ring-2 ring-primary/20 shrink-0">
                <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
                <p className="text-xs text-muted-foreground">
                  Upload a professional avatar (PNG, JPG or WEBP up to 5MB)
                </p>
                <div className="pt-1">
                  <Label
                    htmlFor="profilePhoto"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background border border-border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Choose New Image</span>
                  </Label>
                  <input
                    id="profilePhoto"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={user?.fullName || ""}
                    placeholder="John Doe"
                    className="pl-10 h-11 text-sm rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                  Email Address (Primary)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="pl-10 h-11 text-sm rounded-xl bg-muted/50 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={user?.phoneNumber || ""}
                    placeholder="+1 234 567 890"
                    className="pl-10 h-11 text-sm rounded-xl"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-xs font-semibold text-foreground">
                  Gender
                </Label>
                <input type="hidden" name="gender" value={gender} />
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-11 text-sm rounded-xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address (Span 2) */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-semibold text-foreground">
                  Physical / Office Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    defaultValue={user?.address || ""}
                    placeholder="123 Main Street, Suite 400, City, Country"
                    className="pl-10 h-11 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPending}
                loadingText="Saving Changes..."
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone: Delete Account */}
      <Card className="border border-destructive/30 bg-destructive/5 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-destructive flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Deactivate and soft-delete your personal account. You will lose access immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground max-w-md">
            Once deleted, your account will be marked inactive. You will need to contact support to reactivate your profile.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete My Account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground">
                  This action will deactivate your account and log you out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Deactivate Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileForm;
