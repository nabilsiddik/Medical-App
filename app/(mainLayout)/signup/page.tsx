import { SignupForm } from "@/components/forms/SignupForm";
import SocialLogin from "@/components/shared/SocialLogin";
import Logo from "@/components/logo";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create an Account
          </h1>
          <p className="text-base text-muted-foreground">
            Sign up to get instant access to your personalized dashboard
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <SignupForm />

          <div className="relative">
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
      </div>
    </div>
  );
}
