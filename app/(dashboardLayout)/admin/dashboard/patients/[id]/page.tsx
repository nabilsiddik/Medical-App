"use client";

import React, { useState, useEffect, use } from "react";
import { getPatientById, recordVitalSign } from "@/services/doctor/patientServices";
import { IPatient, IVitalSign } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  User,
  Heart,
  Activity,
  Calendar,
  FileText,
  CreditCard,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Scale,
  Thermometer,
  Clock,
  CheckCircle2,
  Stethoscope,
  Pill,
} from "lucide-react";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = use(params);
  const [patient, setPatient] = useState<(IPatient & { timeline?: any[]; appointments?: any[]; prescriptions?: any[]; invoices?: any[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"prescriptions" | "appointments" | "timeline">("prescriptions");

  // Vitals Modal State
  const [vitalsOpen, setVitalsOpen] = useState(false);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [temp, setTemp] = useState("");
  const [spo2, setSpo2] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [savingVitals, setSavingVitals] = useState(false);

  const fetchPatient = async () => {
    try {
      const data: any = await getPatientById(id);
      if (data) {
        // Handle both flattened and nested { patient, timeline } backend responses
        const p = data.patient ? { ...data.patient, timeline: data.timeline || [] } : data;
        setPatient(p);
      } else {
        setPatient(null);
      }
    } catch (err) {
      console.error("Failed to load patient profile:", err);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVitals(true);
    try {
      const res = await recordVitalSign(id, {
        systolicBp: systolic ? parseInt(systolic) : undefined,
        diastolicBp: diastolic ? parseInt(diastolic) : undefined,
        pulseRate: pulse ? parseInt(pulse) : undefined,
        temperature: temp ? parseFloat(temp) : undefined,
        spO2: spo2 ? parseInt(spo2) : undefined,
        heightCm: height ? parseFloat(height) : undefined,
        weightKg: weight ? parseFloat(weight) : undefined,
      });

      if (res.success) {
        toast.success("Vitals recorded successfully!");
        setVitalsOpen(false);
        // Reset form
        setSystolic("");
        setDiastolic("");
        setPulse("");
        setTemp("");
        setSpo2("");
        setHeight("");
        setWeight("");
        fetchPatient();
      } else {
        toast.error("Failed to record vitals");
      }
    } catch {
      toast.error("Error saving vitals");
    } finally {
      setSavingVitals(false);
    }
  };

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-7 w-48 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
          </div>
          <div className="h-10 w-44 rounded-xl bg-muted" />
        </div>

        {/* Demographics & Vitals Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 rounded-2xl bg-muted/60" />
          <div className="lg:col-span-2 h-64 rounded-2xl bg-muted/60" />
        </div>

        {/* Content Tabs Skeleton */}
        <div className="h-80 rounded-2xl bg-muted/40" />
      </div>
    );
  }

  // 2. Not Found State
  if (!patient) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Patient Record Not Found</h2>
        <p className="text-base text-muted-foreground">
          The requested electronic medical record could not be found or has been archived.
        </p>
        <Link href="/admin/dashboard/patients">
          <Button variant="outline" className="rounded-xl mt-2 font-semibold">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patients Directory
          </Button>
        </Link>
      </div>
    );
  }

  const patientIdSafe = patient.id || id || "";
  const mrnCode = patientIdSafe ? patientIdSafe.slice(0, 8).toUpperCase() : "MRN-N/A";
  const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;
  const timelineItems = patient.timeline || [];
  const prescriptionsList = patient.prescriptions || [];
  const appointmentsList = patient.appointments || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/patients">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {patient.name || "Unnamed Patient"}
              <Badge variant="secondary" className="font-mono text-xs">
                {patient.gender || "UNKNOWN"} • {patient.ageYears ?? patient.age ?? "N/A"} Yrs
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              MRN ID: {mrnCode} • Phone: {patient.phoneNumber || patient.phone || "No phone"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/dashboard/prescriptions/new?patientId=${patientIdSafe}`}>
            <Button size="sm" className="rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-1.5" /> Write Prescription (Rx)
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Profile Card & Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bio & Demographics */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Medical Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Blood Group:</span>
              <span className="font-bold text-foreground">{patient.bloodGroup || "Not tested"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Emergency Contact:</span>
              <span className="font-mono text-foreground">{patient.emergencyContact || "None"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-foreground text-right">{patient.address || "Dhaka, Bangladesh"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Registered:</span>
              <span className="font-mono text-foreground">
                {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>

            {/* Allergies Box */}
            <div className="pt-2">
              <span className="font-semibold text-destructive mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Documented Allergies
              </span>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {patient.allergies.map((a: string) => (
                    <Badge
                      key={a}
                      variant="outline"
                      className="text-xs text-destructive border-destructive/40 bg-destructive/10"
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground italic text-xs">No known drug allergies (NKDA)</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest Vitals Snapshot */}
        <Card className="rounded-2xl border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                Latest Clinical Vitals
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {latestVitals
                  ? `Recorded on ${new Date(latestVitals.recordedAt).toLocaleString()}`
                  : "No vitals on file"}
              </CardDescription>
            </div>

            {/* Record New Vitals Modal */}
            <Dialog open={vitalsOpen} onOpenChange={setVitalsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold">
                  <Activity className="h-3.5 w-3.5 mr-1 text-primary" /> Record Vitals
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Record Clinical Vitals</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRecordVitals} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Systolic BP (mmHg)</Label>
                      <Input
                        type="number"
                        placeholder="120"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Diastolic BP (mmHg)</Label>
                      <Input
                        type="number"
                        placeholder="80"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Pulse Rate (bpm)</Label>
                      <Input
                        type="number"
                        placeholder="72"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">SpO2 (%)</Label>
                      <Input
                        type="number"
                        placeholder="98"
                        value={spo2}
                        onChange={(e) => setSpo2(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Temp (°F)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Height (cm)</Label>
                      <Input
                        type="number"
                        placeholder="172"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">Weight (kg)</Label>
                      <Input
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={savingVitals}
                    className="w-full rounded-xl mt-3 font-semibold"
                  >
                    {savingVitals ? "Saving..." : "Save Vitals Record"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {latestVitals ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    Blood Pressure
                  </span>
                  <div className="text-xl font-bold font-mono text-primary mt-1">
                    {latestVitals.systolicBp || "--"}/{latestVitals.diastolicBp || "--"}
                  </div>
                  <span className="text-[10px] text-muted-foreground">mmHg</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    Pulse Rate
                  </span>
                  <div className="text-xl font-bold font-mono text-foreground mt-1">
                    {latestVitals.pulseRate || "--"}
                  </div>
                  <span className="text-[10px] text-muted-foreground">bpm</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    SpO2 Oxygen
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {latestVitals.spO2 ? `${latestVitals.spO2}%` : "--"}
                  </div>
                  <span className="text-[10px] text-muted-foreground">room air</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-semibold">
                    Body Mass Index
                  </span>
                  <div className="text-xl font-bold font-mono text-foreground mt-1">
                    {latestVitals.bmi ? latestVitals.bmi.toFixed(1) : "--"}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {latestVitals.weightKg ? `${latestVitals.weightKg} kg` : "kg/m²"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No vitals recorded yet. Click &quot;Record Vitals&quot; above.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for EMR History: Timeline, Prescriptions, Appointments */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl w-fit border border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "prescriptions"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Pill className="h-4 w-4" /> Prescriptions ({prescriptionsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "appointments"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" /> Appointments ({appointmentsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "timeline"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" /> Clinical Timeline ({timelineItems.length})
          </button>
        </div>

        {/* Tab 1: Prescriptions History */}
        {activeTab === "prescriptions" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Prescription History (Rx)</CardTitle>
                <CardDescription className="text-xs">
                  All past prescriptions and clinical regimens issued for this patient
                </CardDescription>
              </div>
              <Link href={`/admin/dashboard/prescriptions/new?patientId=${patientIdSafe}`}>
                <Button size="sm" className="rounded-xl text-xs font-semibold">
                  <Plus className="h-3.5 w-3.5 mr-1" /> New Prescription
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {prescriptionsList.length > 0 ? (
                <div className="space-y-3">
                  {prescriptionsList.map((rx: any) => (
                    <div
                      key={rx.id}
                      className="p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-foreground font-mono">
                            #{rx.prescriptionNumber || "Rx"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(rx.createdAt).toLocaleDateString()}
                          </Badge>
                          {rx.diagnoses && rx.diagnoses.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              • Diagnosis: {rx.diagnoses.join(", ")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rx.items?.length || 0} medication(s) prescribed
                          {rx.followUpDate ? ` • Follow-up: ${new Date(rx.followUpDate).toLocaleDateString()}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/dashboard/prescriptions/${rx.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                            View / Print Rx
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <FileText className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-base font-medium">No prescriptions recorded yet</p>
                  <p className="text-xs">Click &quot;New Prescription&quot; to generate an Rx for this patient.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Appointments History */}
        {activeTab === "appointments" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Appointment Visits</CardTitle>
              <CardDescription className="text-xs">
                History of chamber visits and virtual consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsList.length > 0 ? (
                <div className="space-y-3">
                  {appointmentsList.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {app.chamberLocation?.name || "Consultation Visit"}
                          </span>
                          <Badge
                            variant={
                              app.status === "COMPLETED"
                                ? "default"
                                : app.status === "CANCELLED"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs uppercase"
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          Date: {new Date(app.appointmentDate).toLocaleDateString()}
                          {app.startTime ? ` • Slot: ${app.startTime}` : ""}
                          {app.serialNumber ? ` • Serial #${app.serialNumber}` : ""}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {app.service?.name || "General Consultation"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Calendar className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-base font-medium">No appointment records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Chronological Timeline */}
        {activeTab === "timeline" && (
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Chronological Medical Timeline</CardTitle>
              <CardDescription className="text-xs">
                Unified medical timeline of all interactions, appointments, and prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timelineItems.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {timelineItems.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="relative">
                      <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                      <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground">{item.title}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        {item.summary && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {item.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Clock className="h-10 w-10 mx-auto opacity-40" />
                  <p className="text-base font-medium">No timeline events recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
