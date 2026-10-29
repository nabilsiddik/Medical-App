"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setIsPending(true);
      setError(null);
      const res = await forgotPassword({ email: email.trim() });

      if (res?.success) {
        toast.success("Password reset code sent to your email!");
        router.push(
          `/verify-otp?email=${encodeURIComponent(email.trim())}&type=FORGOT_PASSWORD`
        );
      } else {
        setError(res?.message || "Failed to process password reset request.");
        toast.error(res?.message || "Request failed");
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

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-foreground">
          Your Account Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            className="pl-10 h-11 text-sm rounded-xl"
            required
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          We will send a 6-digit verification OTP to this address.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full text-sm font-semibold rounded-xl h-11 mt-2 shadow-sm"
        isLoading={isPending}
        loadingText="Sending OTP Code..."
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Send Reset OTP Code
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
