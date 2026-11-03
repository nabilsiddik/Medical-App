import { LoginForm } from "@/components/forms/LoginForm";
import Logo from "@/components/logo";
import SocialLogin from "@/components/shared/SocialLogin";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-base text-muted-foreground">
            Sign in to access your admin or user dashboard
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-sm">
          <LoginForm redirect={params?.redirect} />
        </div>
      </div>
    </div>
  );
}