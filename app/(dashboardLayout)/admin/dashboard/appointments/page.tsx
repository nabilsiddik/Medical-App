"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  getAppointments,
  updateAppointmentStatus,
  cancelAppointmentByDoctor,
  refundAppointment,
} from "@/services/doctor/appointmentServices";
import { getChamberLocations } from "@/services/doctor/clinicServices";
import { IAppointment, IChamberLocation, AppointmentStatus } from "@/types/doctor.interface";
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
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  Search,
  Plus,
  RefreshCw,
  XCircle,
  DollarSign,
  FileText,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";

export default function AppointmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL query params
  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlStatus = searchParams.get("status") || "ALL";
  const urlDate = searchParams.get("date") || "";
  const urlChamberId = searchParams.get("chamberId") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  // Search input state with debounce
  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Filter dropdown states
  const [statusFilter, setStatusFilter] = useState(urlStatus);
  const [chamberFilter, setChamberFilter] = useState(urlChamberId);
  const [dateFilter, setDateFilter] = useState(urlDate);

  // Data states
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [meta, setMeta] = useState({
    page: urlPage,
    limit: urlLimit,
    total: 0,
    totalPage: 1,
  });
  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Doctor Cancel Modal State
  const [cancelModalApt, setCancelModalApt] = useState<IAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [issueRefund, setIssueRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // Standalone Refund Modal State
  const [refundModalApt, setRefundModalApt] = useState<IAppointment | null>(null);
  const [standaloneRefundAmount, setStandaloneRefundAmount] = useState<number>(0);
  const [submittingRefund, setSubmittingRefund] = useState(false);

  // Load chamber locations once
  useEffect(() => {
    getChamberLocations().then((res) => setChambers(res || []));
  }, []);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearchTerm);
    setStatusFilter(urlStatus);
    setChamberFilter(urlChamberId);
    setDateFilter(urlDate);
  }, [urlSearchTerm, urlStatus, urlChamberId, urlDate]);

  // Push debounced search to URL
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter/search change

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
    setChamberFilter("ALL");
    setDateFilter("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments({
        page: urlPage,
        limit: urlLimit,
        searchTerm: urlSearchTerm || undefined,
        status: urlStatus !== "ALL" ? urlStatus : undefined,
        date: urlDate || undefined,
        chamberId: urlChamberId !== "ALL" ? urlChamberId : undefined,
      });

      setAppointments(res?.data || []);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when query params change
  useEffect(() => {
    fetchAppointments();
  }, [urlPage, urlLimit, urlSearchTerm, urlStatus, urlDate, urlChamberId]);

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        toast.success(`Status updated to ${status}`);
        fetchAppointments();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Open Cancel Modal
  const openCancelModal = (apt: IAppointment) => {
    setCancelModalApt(apt);
    setCancelReason("Physician emergency schedule adjustment");
    setIssueRefund(Boolean(apt.isPaid && (apt.fee || 0) > 0));
    setRefundAmount(apt.fee || 0);
  };

  // Execute Doctor Cancellation
  const handleConfirmCancelByDoctor = async () => {
    if (!cancelModalApt) return;
    setSubmittingCancel(true);
    try {
      const res = await cancelAppointmentByDoctor(cancelModalApt.id, {
        reason: cancelReason,
        isRefunded: issueRefund,
        refundAmount: issueRefund ? Number(refundAmount) : 0,
      });
      if (res.success) {
        toast.success(
          issueRefund
            ? `Appointment cancelled and refund of ৳${refundAmount} recorded.`
            : "Appointment cancelled without refund."
        );
        setCancelModalApt(null);
        fetchAppointments();
      } else {
        toast.error(res.message || "Failed to cancel appointment.");
      }
    } catch {
      toast.error("Failed to cancel appointment.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  // Execute Standalone Refund
  const handleConfirmRefund = async () => {
    if (!refundModalApt) return;
    setSubmittingRefund(true);
    try {
      const res = await refundAppointment(refundModalApt.id, {
        refundAmount: Number(standaloneRefundAmount),
        reason: "Doctor granted refund after cancellation",
      });
      if (res.success) {
        toast.success(`Refund of ৳${standaloneRefundAmount} successfully processed.`);
        setRefundModalApt(null);
        fetchAppointments();
      } else {
        toast.error(res.message || "Failed to process refund.");
      }
    } catch {
      toast.error("Failed to process refund.");
    } finally {
      setSubmittingRefund(false);
    }
  };

  const hasActiveFilters = Boolean(
    urlSearchTerm ||
    (urlStatus && urlStatus !== "ALL") ||
    urlDate ||
    (urlChamberId && urlChamberId !== "ALL")
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            <span>Appointment Management</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Filter, search, verify status, write prescriptions, and manage doctor cancellations & refunds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/book" className="shrink-0">
            <Button size="sm" className="rounded-xl text-sm font-semibold whitespace-nowrap inline-flex items-center gap-1.5 h-10 px-4">
              <Plus className="h-4 w-4 shrink-0" />
              <span>Book New Appointment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, phone, ref..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-9 h-11 text-sm rounded-xl bg-background border-border/80 focus-visible:ring-primary/20"
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

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Chamber Filter */}
              <Select
                value={chamberFilter}
                onValueChange={(val) => {
                  setChamberFilter(val);
                  updateUrl({ chamberId: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[150px] text-sm font-medium rounded-xl">
                  <SelectValue placeholder="All Chambers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Chambers</SelectItem>
                  {chambers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  updateUrl({ status: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[140px] text-sm font-medium rounded-xl">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                  <SelectItem value="IN_CONSULTATION">In Consultation</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  updateUrl({ date: e.target.value });
                }}
                className="h-11 w-[160px] text-sm rounded-xl"
              />

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-11 px-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
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
                onClick={fetchAppointments}
                disabled={loading}
                className="h-11 px-3.5 rounded-xl text-sm text-muted-foreground cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List / Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                Appointments Schedule
              </CardTitle>
              <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                {meta.total} Bookings
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-0.5">
              Showing clinical bookings filtered according to active selections
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Loading appointments...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px] text-sm text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Ref / Token</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Patient</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Chamber</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Date & Slot</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Fee / Refund</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-mono font-bold text-sm text-foreground">
                          {app.appointmentRef || `APT-${app.id.slice(0, 8)}`}
                        </div>
                        {app.serialNumber && (
                          <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                            Queue Token #{app.serialNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-semibold text-foreground">
                          {app.patientName || app.patient?.fullName || app.patient?.name || "Patient"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          {app.patientPhone || app.patient?.phone || app.patient?.phoneNumber || "N/A"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-medium text-foreground">
                        {app.chamberLocation?.name || app.chamber?.name || "Chamber"}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground mt-0.5">
                          {app.startTime || "Slot based"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-semibold px-2.5 py-0.5 ${
                            app.status === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                              : app.status === "CHECKED_IN"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : app.status === "CONFIRMED"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : app.status === "CANCELLED"
                              ? "bg-destructive/20 text-destructive border border-destructive/30"
                              : "bg-muted text-muted-foreground border border-border/40"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground">
                          {app.fee === 0 ? "FREE (৳0)" : `৳${app.fee?.toLocaleString()}`}
                        </div>
                        {app.status === "CANCELLED" && (
                          <div className="text-xs pt-0.5">
                            {app.isRefunded ? (
                              <span className="text-emerald-600 font-semibold font-mono">
                                Refunded ৳{app.refundAmount}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Non-refundable</span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right space-x-1.5">
                        {app.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(app.id, AppointmentStatus.CONFIRMED)}
                            className="h-8 text-xs px-2.5 rounded-lg cursor-pointer"
                          >
                            Confirm
                          </Button>
                        )}

                        {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openCancelModal(app)}
                            className="h-8 text-xs px-2.5 text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            Cancel
                          </Button>
                        )}

                        {app.status === "CANCELLED" && !app.isRefunded && (app.fee || 0) > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRefundModalApt(app);
                              setStandaloneRefundAmount(app.fee || 0);
                            }}
                            className="h-8 text-xs px-2.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                          >
                            <DollarSign className="h-3 w-3 mr-0.5" /> Refund
                          </Button>
                        )}

                        <Link
                          href={`/admin/dashboard/prescriptions/new?patientId=${app.patientId}&appointmentId=${app.id}`}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs px-2.5 text-primary font-semibold cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5 mr-0.5" /> Rx
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      {loading ? "Loading appointments..." : "No appointments matching current filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination meta={meta} itemName="appointments" isPending={loading || isPending} />
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cancellation Modal (with optional Refund) */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Cancel Appointment</h3>
                <p className="text-xs text-muted-foreground">
                  Ref: {cancelModalApt.appointmentRef} • Patient: {cancelModalApt.patientName || cancelModalApt.patient?.fullName || cancelModalApt.patient?.name}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Cancellation Reason:
                </label>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for doctor cancellation..."
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              {/* Refund Checkbox */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={issueRefund}
                    onChange={(e) => setIssueRefund(e.target.checked)}
                    className="h-4 w-4 rounded-md accent-primary"
                  />
                  <span>Issue refund to patient?</span>
                </label>

                {issueRefund && (
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Refund Amount (BDT):
                    </label>
                    <Input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="rounded-xl h-9 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalApt(null)}
                className="rounded-xl text-sm"
              >
                Back
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={submittingCancel}
                onClick={handleConfirmCancelByDoctor}
                className="rounded-xl text-sm font-semibold"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Refund Modal */}
      {refundModalApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Process Refund</h3>
                <p className="text-xs text-muted-foreground">
                  Grant refund for cancelled appointment {refundModalApt.appointmentRef}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Refund Amount (BDT):
              </label>
              <Input
                type="number"
                value={standaloneRefundAmount}
                onChange={(e) => setStandaloneRefundAmount(Number(e.target.value))}
                className="rounded-xl h-10 text-sm font-mono font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundModalApt(null)}
                className="rounded-xl text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={submittingRefund}
                onClick={handleConfirmRefund}
                className="rounded-xl text-sm font-semibold"
              >
                Confirm Refund
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
