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
import { IUser, UserRole } from "@/types/user.interface";
import { updateUserRole } from "@/services/user/userServices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

interface UpdateRoleModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateRoleModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UpdateRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user?.role || UserRole.USER
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      const res = await updateUserRole(user.id, selectedRole);
      if (res?.success) {
        toast.success(`User role updated to ${selectedRole}`);
        onOpenChange(false);
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(res?.message || "Failed to update user role");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user role");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Update User Role
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Assign permissions and role level for{" "}
            <span className="font-semibold text-foreground">{user.fullName}</span>.
          </p>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <label className="text-xs font-medium text-foreground">
            Select Role Level
          </label>
          <Select
            defaultValue={user.role}
            value={selectedRole}
            onValueChange={(val) => setSelectedRole(val as UserRole)}
          >
            <SelectTrigger className="w-full h-11 text-sm font-medium">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.USER} className="text-slate-700 dark:text-slate-300 font-medium">
                USER — Standard member access
              </SelectItem>
              <SelectItem value={UserRole.ADMIN} className="text-blue-600 font-medium">
                ADMIN — Management & overview access
              </SelectItem>
              <SelectItem value={UserRole.SUPER_ADMIN} className="text-purple-600 font-medium">
                SUPER_ADMIN — Full system administrator
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
            Save Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateRoleModal;
