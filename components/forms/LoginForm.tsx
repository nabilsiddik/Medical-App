"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, demoLoginUser } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Stethoscope,
  User,
  Sparkles,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SocialLogin from "../shared/SocialLogin";

export function LoginForm({
  className,
  redirect,
}: {
  className?: string;
  redirect?: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoLoading, setDemoLoading] = useState<"DOCTOR" | "PATIENT" | null>(null);
  const [state, formAction, isPending] = useActionState(loginUser, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
      if (state.isUnverified && state.email) {
        toast.info("Redirecting to email verification...");
        setTimeout(() => {
          router.push(
            `/verify-otp?email=${encodeURIComponent(state.email)}&type=EMAIL_VERIFICATION`
          );
        }, 1200);
      }
    }
  }, [state, router]);

  const getFieldError = (fieldName: string) => {
    if (state?.errors && Array.isArray(state.errors)) {
      const err = state.errors.find((e: any) => e.path?.includes(fieldName));
      return err?.message;
    }
    return null;
  };

  const handleDemoLogin = async (role: "DOCTOR" | "PATIENT") => {
    if (demoLoading || isPending) return;
    setDemoLoading(role);
    const roleTitle = role === "DOCTOR" ? "Doctor Portal" : "Patient Portal";

    try {
      toast.loading(`Signing in to ${roleTitle} (Demo Mode)...`, {
        id: "demo-login-toast",
      });

      const res = await demoLoginUser(role, redirect);
      if (res && !res.success) {
        toast.error(res.message || "Demo login failed", { id: "demo-login-toast", duration: 3000 });
        setDemoLoading(null);
      } else {
        toast.success(`Welcome to ${roleTitle}! Exploring in read-only mode.`, {
          id: "demo-login-toast",
          duration: 2000,
        });
        router.refresh();
      }
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        // Next.js redirect thrown by server action on successful login
        toast.success(`Signed in to ${roleTitle}!`, {
          id: "demo-login-toast",
          duration: 2000,
        });
        setTimeout(() => {
          toast.dismiss("demo-login-toast");
        }, 1200);
        return;
      }
      toast.error("Demo login encountered an error. Please try again.", {
        id: "demo-login-toast",
        duration: 3000,
      });
      setDemoLoading(null);
    } finally {
      setDemoLoading(null);
    }
  };

  const handleFillDemo = (role: "DOCTOR" | "PATIENT") => {
    if (role === "DOCTOR") {
      setEmail("demo.doctor@chamber.com");
      setPassword("Demo@Doctor2026");
      toast.info("Doctor demo credentials filled into form!");
    } else {
      setEmail("demo.patient@chamber.com");
      setPassword("Demo@Patient2026");
      toast.info("Patient demo credentials filled into form!");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Manual Login Form */}
      <form
        id="login-form"
        noValidate
        action={formAction}
        className="space-y-4"
      >
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        {/* Error Alert Box */}
        {state && !state.success && state.message && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 h-11 rounded-xl text-sm"
              required
            />
          </div>
          {getFieldError("email") && (
            <p className="text-xs text-destructive font-medium mt-1">
              {getFieldError("email")}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 rounded-xl text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-hidden"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {getFieldError("password") && (
            <p className="text-xs text-destructive font-medium mt-1">
              {getFieldError("password")}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full text-sm font-semibold rounded-xl h-11 mt-2 shadow-xs cursor-pointer"
          isLoading={isPending}
          loadingText="Signing in..."
        >
          Sign In
        </Button>

        {/* 1-Click Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            disabled={!!demoLoading || isPending}
            onClick={() => handleDemoLogin("DOCTOR")}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {demoLoading === "DOCTOR" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Stethoscope className="h-4 w-4 shrink-0" />
            )}
            <span>Demo Doctor</span>
          </button>

          <button
            type="button"
            disabled={!!demoLoading || isPending}
            onClick={() => handleDemoLogin("PATIENT")}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {demoLoading === "PATIENT" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <User className="h-4 w-4 shrink-0" />
            )}
            <span>Demo Patient</span>
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </p>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <SocialLogin />
    </div>
  );
}

export default LoginForm;
