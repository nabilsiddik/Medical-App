"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import { toast } from "sonner";
import { IAppointment } from "@/types/doctor.interface";
import {
  getMyAppointments,
  cancelAppointmentByPatient,
} from "@/services/doctor/appointmentServices";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span>My Appointments</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review your upcoming consultations, appointment history, and chamber locations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={loadAppointments}
            className="rounded-xl text-xs whitespace-nowrap inline-flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            <span>Refresh</span>
          </Button>
          <Link href="/book" className="shrink-0">
            <Button size="sm" className="rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5">
              <PlusCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Book New Appointment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Cancellation Policy Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Clinic Policy Notice:</span>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            If you cancel an appointment, it will not be refunded per standard practice policy. The reserved slot is immediately released and made available for other patients.
          </p>
        </div>
      </div>

      {/* Appointments List Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Appointment Records ({appointments.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Chronological booking history and active consultation passes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Chamber</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Consultation Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {appointments.length > 0 ? (
                  appointments.map((apt) => {
                    const isUpcoming = apt.status === "PENDING" || apt.status === "CONFIRMED";
                    const isCancelled = apt.status === "CANCELLED";

                    return (
                      <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-foreground">
                            {apt.appointmentRef || `APT-${apt.id.slice(0, 8)}`}
                          </div>
                          {apt.serialNumber && (
                            <div className="text-[10px] text-muted-foreground">
                              Queue Token #{apt.serialNumber}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">
                            {apt.chamberLocation?.name || apt.chamber?.name || "Chamber"}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {apt.chamberLocation?.address || apt.chamber?.address}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-foreground">
                            {new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{apt.startTime || "Slot based"}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-foreground">
                            {apt.fee === 0 ? "FREE (৳0)" : `৳${apt.fee?.toLocaleString()}`}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {apt.isPaid ? "Paid" : "Pending"}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold ${
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
                            <div className="text-[10px] text-muted-foreground pt-0.5">
                              {apt.isRefunded ? `Refunded: ৳${apt.refundAmount}` : "Non-refundable"}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isUpcoming && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setCancelModalId(apt.id)}
                              className="h-8 text-xs text-destructive hover:bg-destructive/10 px-2.5 rounded-xl cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      {loading
                        ? "Loading appointments..."
                        : "No appointment bookings found. Click 'Book New Appointment' to schedule one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Cancel Appointment?</h3>
                <p className="text-xs text-muted-foreground">Please review practice cancellation terms</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive space-y-1">
              <span className="font-bold">Non-refundable policy:</span>
              <p className="text-[11px] leading-relaxed">
                As per clinic policy, cancellations initiated by the patient are not refunded. Your time slot will be reopened immediately for other patients.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, travelling..."
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-background h-20 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalId(null)}
                className="rounded-xl text-xs"
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-xl text-xs font-semibold"
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

