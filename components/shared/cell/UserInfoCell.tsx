import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gender } from "@/types/user.interface";

interface UserInfoCellProps {
  name: string;
  email: string;
  photo?: string | null;
  gender?: Gender | string | null;
}

export const UserInfoCell = ({ name, email, photo, gender }: UserInfoCellProps) => {
  const getInitials = (n: string) => {
    if (!n) return "U";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border border-border/80">
        <AvatarImage src={photo || undefined} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-foreground truncate max-w-[180px] sm:max-w-[220px]">
          {name || "Unnamed User"}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[220px]">
          {email}
        </span>
      </div>
    </div>
  );
};