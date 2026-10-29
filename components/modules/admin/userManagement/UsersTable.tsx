"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ManagementTable from "@/components/shared/tables/ManagementTable";
import { usersColumns } from "./usersColumns";
import { IUser } from "@/types/user.interface";
import UserDetailModal from "@/components/Modals/UserDetailModal";
import UpdateStatusModal from "@/components/Modals/UpdateStatusModal";
import UpdateRoleModal from "@/components/Modals/UpdateRoleModal";
import UserDeletionAlertModal from "@/components/Modals/UserDeletionAlertModal";

interface UsersTableProps {
  users: IUser[];
  isLoading?: boolean;
}

export const UsersTable = ({ users = [], isLoading = false }: UsersTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Selected user for modals
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const handleSort = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === key) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", key);
      params.set("sortOrder", "asc");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleView = (user: IUser) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (user: IUser) => {
    setSelectedUser(user);
    setIsStatusOpen(true);
  };

  const handleUpdateRole = (user: IUser) => {
    setSelectedUser(user);
    setIsRoleOpen(true);
  };

  const handleDelete = (user: IUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <ManagementTable
        data={users}
        columns={usersColumns}
        getRowKey={(user) => user.id}
        isLoading={isLoading}
        isRefreshing={isPending}
        emptyMessage="No users found"
        emptySubtitle="Try adjusting your search criteria or clearing filters to see user records."
        onView={handleView}
        onUpdateStatus={handleUpdateStatus}
        onUpdateRole={handleUpdateRole}
        onDelete={handleDelete}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <UpdateStatusModal
        user={selectedUser}
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
      />

      <UpdateRoleModal
        user={selectedUser}
        open={isRoleOpen}
        onOpenChange={setIsRoleOpen}
      />

      <UserDeletionAlertModal
        user={selectedUser}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
    </>
  );
};

export default UsersTable;
