"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  XCircle,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Printer,
  FileText,
  Search,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { toast } from "sonner";
import { IAppointment } from "@/types/doctor.interface";
import {
  getMyAppointments,
  cancelAppointmentByPatient,
} from "@/services/doctor/appointmentServices";
import { printAppointmentSlip } from "@/lib/printAppointmentSlip";

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlStatus = searchParams.get("status") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState(urlStatus);

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setSearchInput(urlSearchTerm);
    setStatusFilter(urlStatus);
  }, [urlSearchTerm, urlStatus]);

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("ALL");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelModalId) return;
    setCancelling(true);
    try {
      const res = await cancelAppointmentByPatient(cancelModalId, cancelReason);
      if (res.success) {
        toast.success("Appointment cancelled. Per clinic policy, cancellation is non-refundable.");
        setCancelModalId(null);
        setCancelReason("");
        loadAppointments();
      } else {
        toast.error(res.message || "Failed to cancel appointment.");
      }
    } catch {
      toast.error("Failed to cancel appointment.");
    } finally {
      setCancelling(false);
    }
  };

  const hasActiveFilters = Boolean(urlSearchTerm || (urlStatus && urlStatus !== "ALL"));

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const term = urlSearchTerm.toLowerCase();
    const matchesSearch =
      !urlSearchTerm ||
      apt.appointmentRef?.toLowerCase().includes(term) ||
      apt.chamberLocation?.name?.toLowerCase().includes(term) ||
      (apt as any).chamber?.name?.toLowerCase().includes(term);

    const matchesStatus =
      urlStatus === "ALL" ||
      (urlStatus === "UPCOMING"
        ? apt.status === "PENDING" || apt.status === "CONFIRMED"
        : apt.status === urlStatus);

    return matchesSearch && matchesStatus;
  });

  const total = filteredAppointments.length;
  const totalPage = Math.max(1, Math.ceil(total / urlLimit));
  const currentPage = Math.min(urlPage, totalPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * urlLimit,
    currentPage * urlLimit
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-primary" />
            <span>My Appointments</span>
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Review your upcoming consultations, appointment history, and download official queue passes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={loadAppointments}
            className="rounded-xl text-base font-semibold whitespace-nowrap inline-flex items-center gap-2 shrink-0 h-11 px-4 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
            <span>Refresh</span>
          </Button>
          <Link href="/book" className="shrink-0">
            <Button size="sm" className="rounded-xl text-base font-bold whitespace-nowrap inline-flex items-center gap-2 h-11 px-5 shadow-xs cursor-pointer">
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>Book New Appointment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Cancellation Policy Alert Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-base flex items-start gap-3.5">
        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Clinic Policy Notice:</span>
          <p className="text-muted-foreground text-base leading-relaxed">
            If you cancel an appointment, it will not be refunded per standard practice policy. The reserved slot is immediately released and made available for other patients.
          </p>
        </div>
      </div>

      {/* Dynamic Search & Filter Bar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by booking reference, chamber name or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-9 h-11 text-base rounded-xl bg-background border-border/80 focus-visible:ring-primary/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateUrl({ searchTerm: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  updateUrl({ status: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[150px] text-base font-medium rounded-xl">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming Only</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-11 px-3.5 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={loadAppointments}
                disabled={loading}
                className="h-11 px-3.5 rounded-xl text-base text-muted-foreground cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">
              Appointment Records
            </CardTitle>
            <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
              {total} Bookings
            </Badge>
          </div>
          <CardDescription className="text-base text-muted-foreground mt-0.5">
            Chronological booking history and active consultation passes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-base font-medium text-foreground">Loading appointments...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-base text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider text-base">
                <tr>
                  <th className="py-4 px-5">Booking Ref</th>
                  <th className="py-4 px-5">Chamber</th>
                  <th className="py-4 px-5">Date &amp; Slot</th>
                  <th className="py-4 px-5">Consultation Fee</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((apt) => {
                    const isUpcoming = apt.status === "PENDING" || apt.status === "CONFIRMED";
                    const isCancelled = apt.status === "CANCELLED";

                    return (
                      <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-foreground text-base">
                            {apt.appointmentRef || `APT-${apt.id.slice(0, 8)}`}
                          </div>
                          {apt.serialNumber && (
                            <div className="text-base font-bold text-primary mt-0.5">
                              Queue Token #{apt.serialNumber}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-bold text-foreground text-base">
                            {apt.chamberLocation?.name || (apt as any).chamber?.name || "Care Chamber"}
                          </div>
                          <div className="text-base text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate max-w-[220px]">
                              {apt.chamberLocation?.address || (apt as any).chamber?.address || "Medical Suite"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-semibold text-foreground text-base">
                            {new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-base font-mono text-[#1673b8] font-bold flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>{apt.startTime || "Slot based"}</span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-foreground text-base">
                            {apt.fee === 0 ? "FREE (৳0)" : `৳${apt.fee?.toLocaleString()}`}
                          </div>
                          <div className="text-base text-muted-foreground mt-0.5">
                            {apt.isPaid ? "Paid" : "Due at Chamber"}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <Badge
                            variant="secondary"
                            className={`text-base font-semibold px-3 py-1 ${
                              apt.status === "COMPLETED"
                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                : apt.status === "CONFIRMED"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : isCancelled
                                ? "bg-destructive/15 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {apt.status}
                          </Badge>
                          {isCancelled && (
                            <div className="text-base text-muted-foreground pt-0.5">
                              {apt.isRefunded ? `Refunded: ৳${apt.refundAmount}` : "Non-refundable"}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            {/* PDF Slip Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                printAppointmentSlip({
                                  appointmentRef:
                                    apt.appointmentRef ||
                                    `APT-${apt.id.slice(0, 8).toUpperCase()}`,
                                  serialNumber:
                                    apt.serialNumber ||
                                    (apt as any)?.queueToken?.tokenNumber ||
                                    1,
                                  patientName:
                                    (apt.patient as any)?.fullName || "Patient",
                                  patientPhone:
                                    (apt.patient as any)?.phone || "",
                                  chamberName:
                                    apt.chamberLocation?.name || "Care Chamber",
                                  chamberAddress: apt.chamberLocation?.address,
                                  chamberCity: apt.chamberLocation?.city,
                                  appointmentDate: new Date(
                                    apt.appointmentDate
                                  ).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }),
                                  startTime: apt.startTime || "Slot based",
                                  serviceName:
                                    apt.service?.name || "Medical Consultation",
                                  fee: apt.fee ?? 0,
                                  isPaid: apt.isPaid || false,
                                })
                              }
                              className="h-10 text-base font-bold px-3.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer border-primary/30 text-primary hover:bg-primary/10 shadow-xs"
                              title="Download / Print PDF Slip"
                            >
                              <Printer className="h-4 w-4" />
                              <span>PDF Slip</span>
                            </Button>

                            {isUpcoming && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setCancelModalId(apt.id)}
                                className="h-10 text-base text-destructive hover:bg-destructive/10 px-3 rounded-xl cursor-pointer"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                <span>Cancel</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground text-base">
                      {loading
                        ? "Loading appointments..."
                        : "No appointment bookings found matching your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination
              meta={{ page: currentPage, limit: urlLimit, total, totalPage }}
              itemName="appointments"
              isPending={loading || isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Cancel Appointment?</h3>
                <p className="text-base text-muted-foreground">Please review practice cancellation terms</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-base text-destructive space-y-1">
              <span className="font-bold">Non-refundable policy:</span>
              <p className="text-base leading-relaxed">
                As per clinic policy, cancellations initiated by the patient are not refunded. Your time slot will be reopened immediately for other patients.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-semibold text-foreground">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, travelling..."
                className="w-full text-base p-3 rounded-xl border border-border bg-background h-24 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalId(null)}
                className="rounded-xl text-base h-11 px-4 cursor-pointer"
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-xl text-base font-semibold h-11 px-5 cursor-pointer"
              >
                Yes, Cancel Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
