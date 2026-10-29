export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/services/user/userServices";
import { getMyAppointments } from "@/services/doctor/appointmentServices";
import { getMyPrescriptions } from "@/services/doctor/prescriptionServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileText,
  PlusCircle,
  Download,
} from "lucide-react";
import { StatusBadgeCell, VerifiedBadgeCell } from "@/components/shared/cell/StatusBadgeCell";

export default async function UserDashboardPage() {
  const [user, appointments, prescriptions] = await Promise.all([
    getLoggedInUser(),
    getMyAppointments().catch(() => []),
    getMyPrescriptions().catch(() => []),
  ]);

  const getInitials = (name?: string) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-md">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-white/20 shrink-0">
            <AvatarImage src={user?.profilePhoto || undefined} alt={user?.fullName} />
            <AvatarFallback className="bg-white text-blue-600 font-bold text-xl">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="h-3 w-3" />
              <span>Patient Health Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              Welcome back, {user?.fullName || "Patient"}
            </h1>
            <p className="text-xs text-blue-100 truncate">
              {user?.email} {user?.phoneNumber && `• ${user.phoneNumber}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/book">
            <Button
              size="sm"
              className="bg-white text-indigo-700 hover:bg-white/90 shadow-xs font-bold"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Book Appointment
            </Button>
          </Link>
          <Link href="/user/dashboard/profile">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-xs"
              leftIcon={<User className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Upcoming Appointments */}
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Upcoming Visits
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {upcomingAppointments.length}
            </div>
            <Link
              href="/user/dashboard/appointments"
              className="text-xs text-primary font-medium hover:underline inline-block pt-1"
            >
              View Schedule →
            </Link>
          </CardContent>
        </Card>

        {/* Total Prescriptions */}
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Medical Prescriptions
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {prescriptions.length}
            </div>
            <Link
              href="/user/dashboard/prescriptions"
              className="text-xs text-primary font-medium hover:underline inline-block pt-1"
            >
              Download Rx PDFs →
            </Link>
          </CardContent>
        </Card>

        {/* Gender Demographics */}
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gender Profile
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold text-foreground capitalize">
              {user?.gender?.toLowerCase() || "Male"}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected during registration
            </p>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account Security
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <KeyRound className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
              <CheckCircle2 className="h-4 w-4" /> Protected by JWT
            </div>
            <Link
              href="/user/dashboard/security"
              className="text-xs text-primary font-medium hover:underline inline-block pt-1"
            >
              Change Password →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Details Card */}
        <Card className="lg:col-span-2 border border-border/70 bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>Patient Account Details</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your registered personal information as stored in the medical practice system
              </CardDescription>
            </div>
            <Link href="/user/dashboard/profile">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border/40 text-sm">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </div>
              <span className="font-semibold text-foreground text-xs">
                {user?.fullName || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </div>
              <span className="font-semibold text-foreground text-xs">
                {user?.email || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Phone / WhatsApp Number</span>
              </div>
              <span className="font-semibold text-foreground text-xs">
                {user?.phoneNumber || "Not provided"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </div>
              <span className="font-semibold text-foreground text-xs truncate max-w-[200px]">
                {user?.address || "Not specified"}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Gender</span>
              </div>
              <span className="font-semibold text-foreground text-xs capitalize">
                {user?.gender?.toLowerCase() || "Male"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border border-border/70 bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              Patient Quick Shortcuts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Quick access to your medical management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <Link
              href="/book"
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4 text-primary" />
                <span>Book New Consultation</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>

            <Link
              href="/user/dashboard/appointments"
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Appointment History & Passes</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>

            <Link
              href="/user/dashboard/prescriptions"
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-purple-600" />
                <span>Prescription PDF Downloads</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
