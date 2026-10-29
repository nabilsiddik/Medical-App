import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUserStats } from "@/types/user.interface";
import {
  Users,
  UserCheck,
  ShieldCheck,
  UserX,
  TrendingUp,
  Activity,
} from "lucide-react";

interface AdminStatsCardsProps {
  stats: IUserStats | null;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const overview = stats?.overview || {
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    deletedUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  };

  const activeRate =
    overview.totalUsers > 0
      ? Math.round((overview.activeUsers / overview.totalUsers) * 100)
      : 0;

  const verifiedRate =
    overview.totalUsers > 0
      ? Math.round((overview.verifiedUsers / overview.totalUsers) * 100)
      : 0;

  const cardItems = [
    {
      title: "Total Registered Users",
      value: overview.totalUsers.toLocaleString(),
      subtitle: "+12% growth this month",
      icon: Users,
      trend: "+12%",
      gradient: "from-blue-600 to-indigo-600",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      accentBorder: "border-l-4 border-l-blue-600",
    },
    {
      title: "Active Accounts",
      value: overview.activeUsers.toLocaleString(),
      subtitle: `${activeRate}% active platform engagement`,
      icon: UserCheck,
      trend: `${activeRate}%`,
      gradient: "from-emerald-600 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      accentBorder: "border-l-4 border-l-emerald-600",
    },
    {
      title: "Verified Accounts",
      value: overview.verifiedUsers.toLocaleString(),
      subtitle: `${verifiedRate}% email verification rate`,
      icon: ShieldCheck,
      trend: `${verifiedRate}%`,
      gradient: "from-purple-600 to-violet-600",
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      accentBorder: "border-l-4 border-l-purple-600",
    },
    {
      title: "Blocked / Restricted",
      value: overview.blockedUsers.toLocaleString(),
      subtitle: `${overview.deletedUsers} soft deleted records`,
      icon: UserX,
      trend: "Monitored",
      gradient: "from-amber-600 to-rose-600",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      accentBorder: "border-l-4 border-l-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cardItems.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`relative overflow-hidden border border-border/70 bg-card hover:shadow-md transition-all duration-200 group ${card.accentBorder}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {card.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{card.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminStatsCards;
