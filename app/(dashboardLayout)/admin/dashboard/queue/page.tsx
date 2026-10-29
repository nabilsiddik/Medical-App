"use client";

import React, { useState, useEffect } from "react";
import { getLiveQueue, callNextInQueue, updateAppointmentStatus, bookAppointment } from "@/services/doctor/appointmentServices";
import { getChamberLocations } from "@/services/doctor/clinicServices";
import { IQueueItem, IChamberLocation, AppointmentStatus } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  Tv,
  Users,
  Play,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Phone,
  FileText,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function QueueBoardPage() {
  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [selectedChamberId, setSelectedChamberId] = useState<string>("");
  const [queue, setQueue] = useState<IQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);

  // Walk-in modal state
  const [walkinOpen, setWalkinOpen] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinAge, setWalkinAge] = useState("");
  const [walkinGender, setWalkinGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [submittingWalkin, setSubmittingWalkin] = useState(false);

  const fetchQueueData = async (chamberId?: string) => {
    try {
      const data = await getLiveQueue(chamberId || undefined);
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChamberLocations().then((res) => {
      setChambers(res);
      if (res.length > 0) {
        setSelectedChamberId(res[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedChamberId) {
      fetchQueueData(selectedChamberId);
    }
  }, [selectedChamberId]);

  const handleCallNext = async () => {
    if (!selectedChamberId) {
      toast.error("Please select a chamber");
      return;
    }
    setCallingNext(true);
    try {
      const res = await callNextInQueue(selectedChamberId);
      if (res.success) {
        toast.success(`Token #${res.data?.serialNumber} called for consultation!`);
        fetchQueueData(selectedChamberId);
      } else {
        toast.info(res.message || "No more waiting patients in this chamber queue.");
      }
    } catch (err) {
      toast.error("Failed to advance queue.");
    } finally {
      setCallingNext(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchQueueData(selectedChamberId);
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) {
      toast.error("Name and Phone are required");
      return;
    }
    setSubmittingWalkin(true);
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const timeStr = new Date().toTimeString().slice(0, 5);

      const res = await bookAppointment({
        chamberId: selectedChamberId,
        appointmentDate: todayStr,
        startTime: timeStr,
        patientName: walkinName,
        patientPhone: walkinPhone,
        patientAge: walkinAge ? parseInt(walkinAge) : undefined,
        patientGender: walkinGender,
        chiefComplaint: "Walk-in consultation",
        type: "IN_PERSON",
      });

      if (res.success) {
        toast.success(`Walk-in Token #${res.data?.serialNumber} created!`);
        setWalkinOpen(false);
        setWalkinName("");
        setWalkinPhone("");
        setWalkinAge("");
        fetchQueueData(selectedChamberId);
      } else {
        toast.error(res.message || "Could not register walk-in.");
      }
    } catch (err) {
      toast.error("Error creating walk-in");
    } finally {
      setSubmittingWalkin(false);
    }
  };

  const currentConsultation = queue.find((q) => q.status === "IN_CONSULTATION");

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Chamber Queue Control
            <Badge variant="outline" className="text-xs text-primary font-mono">
              Live Monitor
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage incoming arrivals, call next serial token, and launch computerized prescriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Chamber Switcher */}
          <select
            value={selectedChamberId}
            onChange={(e) => setSelectedChamberId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-input bg-card text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
          >
            {chambers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Quick Walk-in Button */}
          <Dialog open={walkinOpen} onOpenChange={setWalkinOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl">
                <Plus className="h-4 w-4 mr-1.5" /> Walk-In Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Quick Walk-In Registration</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateWalkin} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Patient Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Tanvir Hossain"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="rounded-xl h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mobile Phone *</Label>
                    <Input
                      required
                      placeholder="017xxxxxxxx"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Age</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 35"
                      value={walkinAge}
                      onChange={(e) => setWalkinAge(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Gender</Label>
                  <select
                    value={walkinGender}
                    onChange={(e) => setWalkinGender(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={submittingWalkin}
                  className="w-full rounded-xl mt-2 font-semibold"
                >
                  {submittingWalkin ? "Registering..." : "Assign Serial Token"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Big Call Next CTA */}
          <Button
            size="sm"
            variant="default"
            disabled={callingNext}
            onClick={handleCallNext}
            className="rounded-xl px-5 font-semibold shadow-xs"
          >
            <Play className="h-4 w-4 mr-1.5 fill-current" />
            {callingNext ? "Calling..." : "Call Next Token"}
          </Button>

          <Link href="/queue" target="_blank">
            <Button size="sm" variant="outline" className="rounded-xl">
              <Tv className="h-4 w-4 mr-1" /> Open TV Display
            </Button>
          </Link>
        </div>
      </div>

      {/* Currently In Consultation Card */}
      {currentConsultation ? (
        <Card className="rounded-2xl border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-card shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground font-mono font-black text-2xl flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                #{currentConsultation.serialNumber}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white text-[11px] font-semibold animate-pulse">
                    CURRENTLY CONSULTING
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    Slot: {currentConsultation.startTime}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-foreground">
                  {currentConsultation.patient.name}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>Phone: {currentConsultation.patient.phoneNumber}</span>
                  <span>Age: {currentConsultation.patient.ageYears || "N/A"}</span>
                  <span>Gender: {currentConsultation.patient.gender}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/dashboard/prescriptions/new?patientId=${currentConsultation.patient.id}&appointmentId=${currentConsultation.id}`}
              >
                <Button className="rounded-xl font-semibold">
                  <FileText className="h-4 w-4 mr-1.5" /> Start Prescription (Rx)
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => handleStatusChange(currentConsultation.id, AppointmentStatus.COMPLETED)}
                className="rounded-xl border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-dashed border-border/80 bg-muted/20 p-6 text-center">
          <div className="text-xs text-muted-foreground">
            No patient currently marked as In Consultation. Click{" "}
            <span className="font-semibold text-foreground">"Call Next Token"</span> to admit the next waiting patient.
          </div>
        </Card>
      )}

      {/* Full Queue Table */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">
              Queue Roster ({queue.length} Total Today)
            </CardTitle>
            <CardDescription className="text-xs">
              Ordered by appointment serial token
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchQueueData(selectedChamberId)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {queue.length > 0 ? (
                  queue.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        item.status === "IN_CONSULTATION" ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-sm text-foreground">
                        #{item.serialNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {item.patient?.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {item.patient?.phoneNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {item.startTime}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold ${
                            item.status === "IN_CONSULTATION"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : item.status === "CHECKED_IN"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : item.status === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {item.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(item.id, AppointmentStatus.CHECKED_IN)}
                            className="h-7 text-[11px] px-2.5 rounded-lg"
                          >
                            Check-In
                          </Button>
                        )}

                        {item.status !== "IN_CONSULTATION" && item.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleStatusChange(item.id, AppointmentStatus.IN_CONSULTATION)}
                            className="h-7 text-[11px] px-2.5 rounded-lg font-semibold"
                          >
                            Call In
                          </Button>
                        )}

                        <Link
                          href={`/admin/dashboard/prescriptions/new?patientId=${item.patient?.id}&appointmentId=${item.id}`}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-[11px] px-2 text-primary"
                          >
                            Rx
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No patients in queue for this chamber today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
