export const dynamic = "force-dynamic";

import React from "react";
import { getLoggedInUser } from "@/services/user/userServices";
import MedicateTopBar from "@/components/medicate/MedicateTopBar";
import MedicateHeader from "@/components/medicate/MedicateHeader";
import MedicateFooter from "@/components/medicate/MedicateFooter";
import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser().catch(() => null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Medicate Top Bar */}
      <MedicateTopBar />

      {/* 2. Medicate Header & Navigation */}
      <MedicateHeader user={user} />

      {/* 3. Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* 4. Live Chat & AI Assistant Widget */}
      <LiveChatWidget />

      {/* 5. Medicate Reusable Footer */}
      <MedicateFooter />
    </div>
  );
}
