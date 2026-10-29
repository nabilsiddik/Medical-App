"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Phone,
  User,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedChamberId, setSelectedChamberId] = useState("");

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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments({
        searchTerm: searchTerm || undefined,
        status: selectedStatus || undefined,
        date: selectedDate || undefined,
        chamberId: selectedChamberId || undefined,
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChamberLocations().then((res) => setChambers(res));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [selectedStatus, selectedDate, selectedChamberId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span>Appointment Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Filter, search, verify status, write prescriptions, and manage doctor cancellations & refunds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAppointments}
            className="rounded-xl text-xs whitespace-nowrap inline-flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            <span>Reload</span>
          </Button>
          <Link href="/book" className="shrink-0">
            <Button size="sm" className="rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4 shrink-0" />
              <span>Book New Appointment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search patient, phone, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8.5 rounded-xl h-10 text-xs"
              />
            </div>

            {/* Chamber filter */}
            <select
              value={selectedChamberId}
              onChange={(e) => setSelectedChamberId(e.target.value)}
              className="rounded-xl h-10 text-xs px-3 border border-border bg-card text-foreground"
            >
              <option value="">All Chambers</option>
              {chambers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl h-10 text-xs px-3 border border-border bg-card text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="IN_CONSULTATION">In Consultation</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Date filter */}
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-xl h-10 text-xs"
            />
          </form>
        </CardContent>
      </Card>

      {/* Appointments List / Table */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">
              Appointments Schedule ({appointments.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Showing filtered clinical bookings
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref / Token</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Chamber</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fee / Refund</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-sm text-foreground">
                          {app.appointmentRef || `APT-${app.id.slice(0, 8)}`}
                        </div>
                        {app.serialNumber && (
                          <div className="text-[10px] text-muted-foreground">
                            Queue Token #{app.serialNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {app.patientName || app.patient?.name || "Patient"}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {app.patientPhone || app.patient?.phoneNumber}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-foreground">
                        {app.chamberLocation?.name || app.chamber?.name || "Chamber"}
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        <div>{new Date(app.appointmentDate).toLocaleDateString()}</div>
                        <div className="text-[11px] font-semibold text-foreground">
                          {app.startTime || "Slot based"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold ${
                            app.status === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : app.status === "CHECKED_IN"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : app.status === "CONFIRMED"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : app.status === "CANCELLED"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-foreground">
                          {app.fee === 0 ? "FREE (৳0)" : `৳${app.fee?.toLocaleString()}`}
                        </div>
                        {app.status === "CANCELLED" && (
                          <div className="text-[10px] pt-0.5">
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

                      <td className="py-3 px-4 text-right space-x-1.5">
                        {app.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(app.id, AppointmentStatus.CONFIRMED)}
                            className="h-7 text-[11px] px-2 rounded-lg"
                          >
                            Confirm
                          </Button>
                        )}

                        {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openCancelModal(app)}
                            className="h-7 text-[11px] px-2 text-destructive hover:bg-destructive/10"
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
                            className="h-7 text-[11px] px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
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
                            className="h-7 text-[11px] px-2 text-primary font-semibold"
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
                  Ref: {cancelModalApt.appointmentRef} • Patient: {cancelModalApt.patientName || cancelModalApt.patient?.name}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Cancellation Reason:
                </label>
                <Input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for doctor cancellation..."
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {/* Refund Checkbox */}
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
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
                    <label className="text-[11px] font-medium text-muted-foreground">
                      Refund Amount (BDT):
                    </label>
                    <Input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="rounded-xl h-9 text-xs"
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
                className="rounded-xl text-xs"
              >
                Back
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={submittingCancel}
                onClick={handleConfirmCancelByDoctor}
                className="rounded-xl text-xs font-semibold"
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
              <label className="text-xs font-semibold text-foreground">
                Refund Amount (BDT):
              </label>
              <Input
                type="number"
                value={standaloneRefundAmount}
                onChange={(e) => setStandaloneRefundAmount(Number(e.target.value))}
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundModalApt(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={submittingRefund}
                onClick={handleConfirmRefund}
                className="rounded-xl text-xs font-semibold"
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
