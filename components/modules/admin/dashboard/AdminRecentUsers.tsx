import Link from "next/link";
import { IUser } from "@/types/user.interface";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { RoleBadgeCell } from "@/components/shared/cell/RoleBadgeCell";
import { StatusBadgeCell, VerifiedBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { DateCell } from "@/components/shared/cell/DateCell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/shared/buttons/Button";
import { Users, ArrowRight } from "lucide-react";

interface AdminRecentUsersProps {
  users: IUser[];
}

export function AdminRecentUsers({ users = [] }: AdminRecentUsersProps) {
  const recentUsers = users.slice(0, 5);

  return (
    <Card className="border border-border/70 bg-card shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Recently Registered Users</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Latest accounts created on the platform
          </CardDescription>
        </div>
        <Link href="/admin/dashboard/users">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Manage All Users
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase border-b border-border/60">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <UserInfoCell
                        name={user.fullName}
                        email={user.email}
                        photo={user.profilePhoto}
                        gender={user.gender}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadgeCell role={user.role} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadgeCell status={user.status} />
                    </td>
                    <td className="py-3 px-4">
                      <VerifiedBadgeCell isVerified={user.isEmailVerified} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DateCell date={user.createdAt} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminRecentUsers;
