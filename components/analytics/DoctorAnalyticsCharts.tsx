"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IDoctorAnalytics } from "@/types/doctor.interface";
import { Users, Calendar, TrendingUp, PieChart as PieIcon, Activity } from "lucide-react";

interface DoctorAnalyticsChartsProps {
  analytics: IDoctorAnalytics;
}

const PIE_COLORS = ["#0284c7", "#ec4899", "#8b5cf6", "#10b981"];

export default function DoctorAnalyticsCharts({ analytics }: DoctorAnalyticsChartsProps) {
  const {
    patientsRegistrationByDate,
    appointmentsByDate,
    genderDistribution,
    revenueByChamber,
  } = analytics;

  // Format date labels nicely e.g. "Oct 25"
  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formattedRegData = patientsRegistrationByDate.map((item) => ({
    ...item,
    formattedDate: formatShortDate(item.date),
  }));

  const formattedApptData = appointmentsByDate.map((item) => ({
    ...item,
    formattedDate: formatShortDate(item.date),
  }));

  const totalGenderCount = genderDistribution.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      {/* 2-Column Trend Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Registrations Trend */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-500" />
                  <span>Patient Registrations Trend</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Daily new patient accounts created over the last 14 days
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-medium text-sky-600 bg-sky-500/10 border-sky-500/20">
                14-Day View
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedRegData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="patientRegGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis
                    dataKey="formattedDate"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value} Patients`, "Registrations"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#patientRegGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Trend */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span>Appointments by Date</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Clinical consultations scheduled and completed
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                14-Day View
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedApptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis
                    dataKey="formattedDate"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value} Bookings`, "Appointments"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Gender Distribution Pie Chart & Chamber Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gender Breakdown Pie Chart */}
        <Card className="lg:col-span-6 rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-purple-500" />
              <span>Patient Gender Distribution</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Demographic breakdown of registered patient population
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-[240px]">
              <div className="w-[180px] h-[180px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      formatter={(value: any, name: any) => [
                        `${value} Patients (${totalGenderCount > 0 ? ((Number(value) / totalGenderCount) * 100).toFixed(1) : 0}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with Counts and Percentages */}
              <div className="space-y-2.5 w-full max-w-[220px]">
                {genderDistribution.map((item, index) => (
                  <div key={item.gender} className="flex items-center justify-between text-xs p-2 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color || PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <div className="font-mono font-semibold text-muted-foreground">
                      {item.count} <span className="text-[10px]">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Chamber Locations */}
        <Card className="lg:col-span-6 rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span>Chamber Revenue Breakdown</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Earnings distribution across active practice locations
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3 pt-2">
              {revenueByChamber?.length > 0 ? (
                revenueByChamber.map((ch) => (
                  <div key={ch.chamberId} className="p-3.5 rounded-xl border border-border/60 bg-card flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {ch.chamberName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Active Consultation Branch
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-base font-mono text-emerald-600 dark:text-emerald-400">
                        ৳ {ch.revenue.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Earned to date
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No chamber revenue records yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

