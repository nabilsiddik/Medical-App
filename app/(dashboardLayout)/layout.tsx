export const dynamic = "force-dynamic";

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
  const isPatient = userInfo?.role === UserRole.PATIENT || userInfo?.role === UserRole.USER;

  return (
    <SidebarProvider>
      <AppSidebar userInfo={userInfo} />
      <SidebarInset className="min-w-0 bg-muted/20">
        <DashboardNavbar />
        <main className="p-4 sm:p-6 w-full space-y-6">
          {children}
        </main>
        {isPatient && <LiveChatWidget />}
      </SidebarInset>
    </SidebarProvider>
  );
}
