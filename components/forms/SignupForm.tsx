"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth/authServices";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SignupForm({ className }: { className?: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success(
        state.message || "Account created successfully! Welcome to CarePractice."
      );
      router.push("/");
      router.refresh();
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
      id="signup-form"
      noValidate
      action={formAction}
      className={cn("space-y-4", className)}
    >
      {/* Error Alert Box */}
      {state && !state.success && state.message && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

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
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="pl-10 h-11 text-sm rounded-xl"
            required
          />
        </div>
        {getFieldError("fullName") && (
          <p className="text-xs text-destructive font-medium mt-1">
            {getFieldError("fullName")}
          </p>
        )}
      </div>

      {/* Email Address */}
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
            placeholder="patient@example.com"
            className="pl-10 h-11 text-sm rounded-xl"
            required
          />
        </div>
        {getFieldError("email") && (
          <p className="text-xs text-destructive font-medium mt-1">
            {getFieldError("email")}
          </p>
        )}
      </div>

      {/* Phone / WhatsApp Number */}
      <div className="space-y-1.5">
        <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground">
          Phone / WhatsApp Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+8801700000000"
            className="pl-10 h-11 text-sm rounded-xl"
          />
        </div>
        {getFieldError("phoneNumber") && (
          <p className="text-xs text-destructive font-medium mt-1">
            {getFieldError("phoneNumber")}
          </p>
        )}
      </div>

      {/* Gender Selection */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">
          Gender <span className="text-destructive">*</span>
        </Label>
        <input type="hidden" name="gender" value={gender} />
        <div className="grid grid-cols-3 gap-2">
          {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={cn(
                "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5",
                gender === g
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-background border-border text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              {g === "MALE" ? "Male" : g === "FEMALE" ? "Female" : "Other"}
            </button>
          ))}
        </div>
        {getFieldError("gender") && (
          <p className="text-xs text-destructive font-medium mt-1">
            {getFieldError("gender")}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-semibold text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 text-sm rounded-xl"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 text-sm rounded-xl"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {getFieldError("confirmPassword") && (
          <p className="text-xs text-destructive font-medium mt-1">
            {getFieldError("confirmPassword")}
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
        loadingText="Creating account..."
      >
        Sign Up as Patient
      </Button>

      {/* Login link */}
      <p className="text-center text-xs text-muted-foreground pt-1">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
