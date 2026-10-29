import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import Logo from "@/components/logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Reset Your Password
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm">
          <ForgotPasswordForm />

          <div className="pt-4 mt-4 border-t border-border/40 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
