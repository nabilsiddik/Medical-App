"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth/authServices";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "dropdown" | "button" | "sidebar";
  showIcon?: boolean;
}

const LogoutUserButton = ({
  className,
  variant = "dropdown",
  showIcon = true,
}: LogoutButtonProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    try {
      setIsPending(true);
      toast.loading("Signing out...", { id: "logout-toast" });
      await logoutUser();
      toast.success("Signed out successfully", { id: "logout-toast" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to sign out", { id: "logout-toast" });
    } finally {
      setIsPending(false);
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50",
          className
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-destructive" />
        ) : (
          showIcon && <LogOut className="h-4 w-4 text-destructive" />
        )}
        <span>{isPending ? "Signing out..." : "Sign Out"}</span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer disabled:opacity-50",
          className
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          showIcon && <LogOut className="h-4 w-4" />
        )}
        <span>{isPending ? "Logging out..." : "Log Out"}</span>
      </button>
    );
  }

  return (
    <div
      onClick={handleLogout}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md cursor-pointer select-none transition-colors",
        isPending && "pointer-events-none opacity-50",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="h-4 w-4" />
      )}
      <span>{isPending ? "Signing out..." : "Sign Out"}</span>
    </div>
  );
};

export default LogoutUserButton;
