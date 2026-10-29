"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  return (
    <form
      id="login-form"
      noValidate
      action={formAction}
      className={cn("space-y-4", className)}
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
            placeholder="name@example.com"
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
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
        className="w-full text-sm font-semibold rounded-xl h-11 mt-2 shadow-sm"
        isLoading={isPending}
        loadingText="Signing in..."
      >
        Sign In
      </Button>

      {/* Signup Link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Don&apos;t have an account yet?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
