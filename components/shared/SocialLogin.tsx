"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

export function SocialLogin() {
  const handleOAuth = (provider: "google" | "github") => {
    window.location.href = `${SERVER_URL}/auth/${provider}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shadow-2xs"
      >
        <FcGoogle className="h-4 w-4" />
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("github")}
        className="flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shadow-2xs"
      >
        <FaGithub className="h-4 w-4" />
        <span>GitHub</span>
      </button>
    </div>
  );
}

export default SocialLogin;