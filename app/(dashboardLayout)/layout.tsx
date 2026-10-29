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
      <SidebarInset className="min-w-0 bg-muted/20">
        <DashboardNavbar />
        <main className="px-6 py-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 w-full space-y-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        {isPatient && <LiveChatWidget />}
      </SidebarInset>
    </SidebarProvider>
  );
}
