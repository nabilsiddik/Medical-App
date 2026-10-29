"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { softDeleteUser } from "@/services/user/userServices";
import { IUser } from "@/types/user.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface UserDeletionAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser | null;
  onSuccess?: () => void;
}

export function UserDeletionAlertModal({
  open,
  setOpen,
  user,
  onSuccess,
}: UserDeletionAlertModalProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleUserDelete = async () => {
    try {
      setIsPending(true);
      const res = await softDeleteUser(user.id);
      if (res?.success) {
        toast.success(`User ${user.fullName} soft-deleted successfully.`);
        setOpen(false);
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(res?.message || "Failed to delete user.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while deleting user.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md p-6 rounded-2xl">
        <AlertDialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <Trash2 className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            Soft Delete User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to deactivate and soft-delete{" "}
            <span className="font-semibold text-foreground">{user.fullName}</span> (
            {user.email})? The user will not be able to log in, but their record can be
            restored by an administrator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleUserDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Yes, Soft Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserDeletionAlertModal;
