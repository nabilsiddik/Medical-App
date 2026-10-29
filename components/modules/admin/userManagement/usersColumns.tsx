"use client";

import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/tables/ManagementTable";
import { IUser } from "@/types/user.interface";
import { StatusBadgeCell, VerifiedBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { RoleBadgeCell } from "@/components/shared/cell/RoleBadgeCell";
import { DateCell } from "@/components/shared/cell/DateCell";

export const usersColumns: Column<IUser>[] = [
  {
    header: "User",
    accessor: (user) => (
      <UserInfoCell
        name={user.fullName}
        email={user.email}
        photo={user.profilePhoto}
        gender={user.gender}
      />
    ),
    sortKey: "fullName",
    className: "min-w-[200px]",
  },
  {
    header: "Role",
    accessor: (user) => <RoleBadgeCell role={user.role} />,
    sortKey: "role",
  },
  {
    header: "Status",
    accessor: (user) => <StatusBadgeCell status={user.status} />,
    sortKey: "status",
  },
  {
    header: "Verification",
    accessor: (user) => <VerifiedBadgeCell isVerified={user.isEmailVerified} />,
    sortKey: "isEmailVerified",
  },
  {
    header: "Gender",
    accessor: (user) => (
      <span className="text-xs text-muted-foreground capitalize">
        {user.gender?.toLowerCase() || "-"}
      </span>
    ),
  },
  {
    header: "Joined Date",
    accessor: (user) => <DateCell date={user.createdAt} />,
    sortKey: "createdAt",
  },
];
