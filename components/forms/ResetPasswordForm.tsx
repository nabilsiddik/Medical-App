"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function ResetPasswordForm({ token = "" }: { token?: string }) {
  const router = useRouter();
  const [resetToken, setResetToken] = useState(token);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      setError("Reset token is missing or invalid");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsPending(true);
      setError(null);
      const res = await resetPassword({
        resetToken: resetToken.trim(),
        newPassword,
        confirmPassword,
      });

      if (res?.success) {
        toast.success("Password reset successful! You can now log in.");
        router.push("/login");
      } else {
        setError(res?.message || "Failed to reset password.");
        toast.error(res?.message || "Reset failed");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reset Token Input if not provided via query param */}
      {!token && (
        <div className="space-y-1.5">
          <Label htmlFor="token" className="text-xs font-semibold text-foreground">
            Reset Token
          </Label>
          <Input
            id="token"
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Paste your reset token"
            className="h-11 text-sm rounded-xl"
            required
          />
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-xs font-semibold text-foreground">
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 text-sm rounded-xl"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
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
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 h-11 text-sm rounded-xl"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full text-sm font-semibold rounded-xl h-11 mt-2 shadow-sm"
        isLoading={isPending}
        loadingText="Updating Password..."
      >
        Set New Password & Login
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
