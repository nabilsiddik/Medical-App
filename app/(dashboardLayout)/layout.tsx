export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardNavbar from "@/components/modules/dashboard/dashboardNavbar/DashboardNavbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/services/user/userServices";
import { IUserInfo, UserRole } from "@/types/user.interface";
import LiveChatWidget from "@/components/chat/LiveChatWidget";

export default async function CommonDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = (await getLoggedInUser()) as IUserInfo | null;
  if (!userInfo) {
    redirect("/login");
  }

  const isPatient = userInfo?.role === UserRole.PATIENT || userInfo?.role === UserRole.USER;

  return (
    <SidebarProvider>
      <AppSidebar userInfo={userInfo} />
      <SidebarInset className="min-w-0 w-full max-w-full bg-muted/20 overflow-x-hidden">
        <DashboardNavbar />
        <main className="px-3 py-3.5 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 w-full max-w-full space-y-4 sm:space-y-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          {children}
        </main>
        {isPatient && <LiveChatWidget />}
      </SidebarInset>
    </SidebarProvider>
  );
}
