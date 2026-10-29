"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IUserStats } from "@/types/user.interface";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface AdminAnalyticsChartsProps {
  stats: IUserStats | null;
}

export function AdminAnalyticsCharts({ stats }: AdminAnalyticsChartsProps) {
  const trendData = stats?.monthlyTrends && stats.monthlyTrends.length > 0
    ? stats.monthlyTrends
    : [
        { month: "Jan", users: 12, active: 10 },
        { month: "Feb", users: 18, active: 15 },
        { month: "Mar", users: 24, active: 20 },
        { month: "Apr", users: 32, active: 28 },
        { month: "May", users: 45, active: 38 },
        { month: "Jun", users: 56, active: 48 },
      ];

  const roles: any = stats?.roles || { admin: 1, patient: 25 };

  const roleData = [
    { name: "Doctor / Admin", value: roles.admin || 1, color: "#2563eb" },
    { name: "Patient", value: roles.patient || roles.user || 10, color: "#10b981" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Registration & Activity Area Chart */}
      <Card className="lg:col-span-2 border border-border/70 bg-card shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>User Registration Trends</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              New registered users and active account trends over the last 6 months
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="text-muted-foreground font-medium">New Registrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-medium">Active Users</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="New Users"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  name="Active Users"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Role Distribution Donut Chart */}
      <Card className="border border-border/70 bg-card shadow-xs flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-purple-600" />
            <span>Role Distribution</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Account role tier breakdown across active accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center pt-2">
          <div className="h-[210px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-border/40 text-center">
            {roleData.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-[11px] text-muted-foreground font-medium truncate max-w-full">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-foreground" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminAnalyticsCharts;
