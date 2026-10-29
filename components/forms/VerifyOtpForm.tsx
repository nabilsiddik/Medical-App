"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function VerifyOtpForm({
  initialEmail = "",
  type = "EMAIL_VERIFICATION",
}: {
  initialEmail?: string;
  type?: "EMAIL_VERIFICATION" | "FORGOT_PASSWORD";
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    try {
      setIsPending(true);
      setError(null);
      const res = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
        type,
      });

      if (res?.success) {
        toast.success(res.message || "OTP verified successfully!");
        const resetToken =
          res.data?.resetToken || res.data?.data?.resetToken;

        if (type === "FORGOT_PASSWORD" && resetToken) {
          router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
        } else {
          const role = res.data?.user?.role || res.data?.data?.user?.role;
          if (role === "ADMIN" || role === "SUPER_ADMIN") {
            router.push("/admin/dashboard");
          } else {
            router.push("/user/dashboard");
          }
          router.refresh();
        }
      } else {
        setError(res?.message || "Invalid or expired OTP code.");
        toast.error(res?.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      setIsResending(true);
      const res = await resendOtp({
        email: email.trim(),
        type,
      });

      if (res?.success) {
        toast.success("A fresh OTP code has been sent to your email.");
        setTimer(60);
        setCanResend(false);
        setError(null);
      } else {
        toast.error(res?.message || "Failed to resend OTP.");
      }
    } catch (err: any) {
      toast.error("Failed to resend OTP code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs font-semibold text-foreground">
          Email Address
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
      </div>

      {/* 6-Digit OTP Code Input */}
      <div className="space-y-1">
        <Label htmlFor="otp" className="text-xs font-semibold text-foreground">
          6-Digit Verification Code
        </Label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="otp"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="pl-10 text-center tracking-[0.4em] font-mono text-lg font-bold h-12 rounded-xl"
            required
          />
        </div>
      </div>

      {/* Resend Timer / Action */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Didn&apos;t receive the code?</span>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{isResending ? "Sending..." : "Resend OTP"}</span>
          </button>
        ) : (
          <span>Resend available in {timer}s</span>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full text-sm font-semibold rounded-xl h-11 mt-2 shadow-sm"
        isLoading={isPending}
        loadingText="Verifying Code..."
      >
        Verify Code & Continue
      </Button>
    </form>
  );
}

export default VerifyOtpForm;
