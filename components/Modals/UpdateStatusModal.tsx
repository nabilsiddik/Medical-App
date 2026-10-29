"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/shared/buttons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser, UserStatus } from "@/types/user.interface";
import { updateUserStatus } from "@/services/user/userServices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";

interface UpdateStatusModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateStatusModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(
    user?.status || UserStatus.ACTIVE
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      const res = await updateUserStatus(user.id, selectedStatus);
      if (res?.success) {
        toast.success(`User status updated to ${selectedStatus}`);
        onOpenChange(false);
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(res?.message || "Failed to update user status");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Update User Status
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Change account access status for{" "}
            <span className="font-semibold text-foreground">{user.fullName}</span> (
            {user.email}).
          </p>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <label className="text-xs font-medium text-foreground">
            Select New Status
          </label>
          <Select
            defaultValue={user.status}
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val as UserStatus)}
          >
            <SelectTrigger className="w-full h-11 text-sm font-medium">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserStatus.ACTIVE} className="text-emerald-600 font-medium">
                Active — Full account access
              </SelectItem>
              <SelectItem value={UserStatus.BLOCKED} className="text-amber-600 font-medium">
                Blocked — Restricted from signing in
              </SelectItem>
              <SelectItem value={UserStatus.DELETED} className="text-rose-600 font-medium">
                Deleted — Soft deleted account
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isPending}
            loadingText="Updating..."
          >
            Save Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStatusModal;
