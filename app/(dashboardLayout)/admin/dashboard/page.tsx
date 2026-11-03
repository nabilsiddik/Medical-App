export const dynamic = "force-dynamic";

import React from "react";
import { getLoggedInUser } from "@/services/user/userServices";
import { getDoctorAnalyticsOverview } from "@/services/doctor/analyticsServices";
import DoctorAnalyticsCharts from "@/components/analytics/DoctorAnalyticsCharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import {
  Calendar,
  Users,
  CreditCard,
  Tv,
  ArrowRight,
  Activity,
  PlusCircle,
  FileText,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default async function AdminDashboardOverviewPage() {
  const [currentUser, analytics] = await Promise.all([
    getLoggedInUser(),
    getDoctorAnalyticsOverview(),
  ]);

  const stats = analytics?.statsCards || {
    totalPatients: 0,
    upcomingAppointments: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  };

  const kpis = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      subtitle: "Registered medical patient base",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      cta: { label: "View Patients", href: "/admin/dashboard/patients" },
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      subtitle: "Scheduled for upcoming dates",
      icon: Calendar,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      cta: { label: "Schedule", href: "/admin/dashboard/appointments" },
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      subtitle: "Lifetime patient bookings",
      icon: Tv,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      cta: { label: "All Bookings", href: "/admin/dashboard/appointments" },
    },
    {
      title: "Total Revenue",
      value: `৳ ${(stats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: "Consultation fees collected",
      icon: CreditCard,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      cta: { label: "Billing & Cash-Up", href: "/admin/dashboard/billing" },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/90 via-primary to-primary/80 text-primary-foreground shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <Activity className="h-3 w-3" />
            <span>Practice Management Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.fullName || "Doctor"}
          </h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-xl">
            Live clinical overview, colorful patient demographics, appointment trends, and revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/admin/dashboard/chat">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs"
            >
              Live Chat Inbox
            </Button>
          </Link>
          <Link href="/admin/dashboard/prescriptions/new">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-xs font-semibold"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              New Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="rounded-2xl border-border/80 shadow-xs">
              <CardContent className="p-5 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.title}
                  </span>
                  <div className="text-2xl font-black text-foreground">
                    {kpi.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{kpi.subtitle}</p>
                  {kpi.cta && (
                    <Link
                      href={kpi.cta.href}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-1"
                    >
                      {kpi.cta.label} <ArrowRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                </div>

                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Colorful Charts (Patient Trend, Appointment Trend, Gender Pie, Chamber Breakdown) */}
      {analytics && <DoctorAnalyticsCharts analytics={analytics} />}

      {/* Recent Activity Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Recent Appointments
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest clinical consultations booked across chambers
                </CardDescription>
              </div>
              <Link href="/admin/dashboard/appointments">
                <Button variant="outline" size="sm" className="rounded-xl text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[650px] text-xs text-left">
                  <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 whitespace-nowrap">Ref / Patient</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Chamber</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Date / Slot</th>
                      <th className="py-2.5 px-4 whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-4 whitespace-nowrap text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {analytics?.recentAppointments && analytics.recentAppointments.length > 0 ? (
                      analytics.recentAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-foreground">
                              {apt.patientName}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {apt.appointmentRef}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {apt.chamberName}
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">
                            {new Date(apt.appointmentDate).toLocaleDateString()} {apt.startTime && `• ${apt.startTime}`}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-semibold ${
                                apt.status === "COMPLETED"
                                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                  : apt.status === "CONFIRMED"
                                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                  : apt.status === "CANCELLED"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {apt.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                            {apt.fee === 0 ? "FREE (৳0)" : `৳${apt.fee.toLocaleString()}`}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No recent appointments recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patient Registrations */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Recent Patients
                </CardTitle>
                <CardDescription className="text-xs">
                  Newly registered patient profiles
                </CardDescription>
              </div>
              <Link href="/admin/dashboard/patients">
                <Button variant="outline" size="sm" className="rounded-xl text-xs">
                  Patients List <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {analytics?.recentRegistrations && analytics.recentRegistrations.length > 0 ? (
                  analytics.recentRegistrations.map((p) => (
                    <div key={p.id} className="p-3.5 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {p.fullName ? p.fullName[0].toUpperCase() : "P"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-foreground truncate">
                            {p.fullName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate font-mono">
                            {p.email}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                          {p.gender || "MALE"}
                        </Badge>
                        <div className="text-[10px] text-muted-foreground pt-0.5">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No recent registrations found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
