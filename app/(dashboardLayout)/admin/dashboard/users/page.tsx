export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getAllUsers } from "@/services/user/userServices";
import UsersTable from "@/components/modules/admin/userManagement/UsersTable";
import TableFilterBar from "@/components/shared/tables/tableFilterBar";
import TablePagination from "@/components/shared/tables/TablePagination";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsersPageProps {
  searchParams?: Promise<{
    searchTerm?: string;
    role?: string;
    status?: string;
    gender?: string;
    isEmailVerified?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminUsersManagementPage({
  searchParams,
}: UsersPageProps) {
  const params = (await searchParams) || {};

  // Build clean query string from search parameters
  const queryParams = new URLSearchParams();
  if (params.searchTerm) queryParams.set("searchTerm", params.searchTerm);
  if (params.role && params.role !== "ALL") queryParams.set("role", params.role);
  if (params.status && params.status !== "ALL") queryParams.set("status", params.status);
  if (params.gender && params.gender !== "ALL") queryParams.set("gender", params.gender);
  if (params.isEmailVerified && params.isEmailVerified !== "ALL")
    queryParams.set("isEmailVerified", params.isEmailVerified);
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  const result = await getAllUsers(queryParams.toString());
  const users = result?.data || [];
  const meta = result?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
              <Users className="h-6 w-6 text-primary" />
              <span>User Management</span>
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
              {meta.total} Accounts
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Search, filter, update roles, modify access statuses, and manage platform users.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <TableFilterBar />

      {/* Main Data Table */}
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <UsersTable users={users} />
      </Suspense>

      {/* Pagination Bar */}
      <TablePagination meta={meta} itemName="users" />
    </div>
  );
}
