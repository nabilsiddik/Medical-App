"use client";

import { useState, useActionState, useEffect } from "react";
import { changePassword } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(changePassword, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success("Password changed successfully!");
      // Reset form fields
      const form = document.getElementById("change-password-form") as HTMLFormElement;
      form?.reset();
    }
  }, [state]);

  const getFieldError = (fieldName: string) => {
    if (state?.errors && Array.isArray(state.errors)) {
      const err = state.errors.find((e: any) => e.path?.includes(fieldName));
      return err?.message;
    }
    return null;
  };

  return (
    <Card className="border border-border/70 bg-card shadow-xs max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <span>Change Password</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Ensure your account is using a strong, unique password with at least 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="change-password-form" action={formAction} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="oldPassword"
              className="text-xs font-semibold text-foreground"
            >
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="pl-10 pr-10 h-11 text-sm rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {getFieldError("oldPassword") && (
              <p className="text-xs text-destructive font-medium mt-1">
                {getFieldError("oldPassword")}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="newPassword"
              className="text-xs font-semibold text-foreground"
            >
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password (min. 6 chars)"
                className="pl-10 pr-10 h-11 text-sm rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {getFieldError("newPassword") && (
              <p className="text-xs text-destructive font-medium mt-1">
                {getFieldError("newPassword")}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-foreground"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                className="pl-10 pr-10 h-11 text-sm rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {getFieldError("confirmPassword") && (
              <p className="text-xs text-destructive font-medium mt-1">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              loadingText="Updating Password..."
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChangePasswordForm;
