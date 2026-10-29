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
} from "lucide-react";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = use(params);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(true);

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
      const data = await getPatientById(id);
      setPatient(data);
    } catch (err) {
      console.error(err);
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
        fetchPatient();
      } else {
        toast.error("Failed to record vitals");
      }
    } catch (err) {
      toast.error("Error saving vitals");
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-muted-foreground animate-pulse">
        Loading electronic medical record...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold">Patient Not Found</h2>
        <Link href="/admin/dashboard/patients">
          <Button variant="outline">Back to Patients Directory</Button>
        </Link>
      </div>
    );
  }

  const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/patients">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {patient.name}
              <Badge variant="secondary" className="font-mono text-xs">
                {patient.gender} • {patient.ageYears || "N/A"} Yrs
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              MRN ID: {patient.id.slice(0, 8).toUpperCase()} • Phone: {patient.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/dashboard/prescriptions/new?patientId=${patient.id}`}>
            <Button size="sm" className="rounded-xl font-semibold">
              <Plus className="h-4 w-4 mr-1.5" /> Write Prescription (Rx)
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Profile Card & Allergies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bio & Demographics */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Medical Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Blood Group:</span>
              <span className="font-bold text-foreground">{patient.bloodGroup || "Not tested"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Emergency Contact:</span>
              <span className="font-mono text-foreground">{patient.emergencyContact || "None"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-foreground text-right">{patient.address || "Dhaka, Bangladesh"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Registered:</span>
              <span className="font-mono text-foreground">
                {new Date(patient.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Allergies Box */}
            <div className="pt-2">
              <span className="font-semibold text-destructive block mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Documented Allergies
              </span>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((a) => (
                    <Badge
                      key={a}
                      variant="outline"
                      className="text-[10px] text-destructive border-destructive/40 bg-destructive/10"
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground italic">No known drug allergies (NKDA)</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest Vitals Snapshot */}
        <Card className="rounded-2xl border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Latest Clinical Vitals
              </CardTitle>
              <CardDescription className="text-xs">
                {latestVitals
                  ? `Recorded on ${new Date(latestVitals.recordedAt).toLocaleString()}`
                  : "No vitals on file"}
              </CardDescription>
            </div>

            {/* Record New Vitals Modal */}
            <Dialog open={vitalsOpen} onOpenChange={setVitalsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-xl text-xs">
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
                      <Label className="text-xs">Systolic BP (mmHg)</Label>
                      <Input
                        type="number"
                        placeholder="120"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Diastolic BP (mmHg)</Label>
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
                      <Label className="text-xs">Pulse Rate (bpm)</Label>
                      <Input
                        type="number"
                        placeholder="72"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SpO2 (%)</Label>
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
                      <Label className="text-xs">Temp (°F)</Label>
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
                      <Label className="text-xs">Height (cm)</Label>
                      <Input
                        type="number"
                        placeholder="172"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="rounded-xl h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Weight (kg)</Label>
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
              <div className="py-6 text-center text-xs text-muted-foreground">
                No vitals recorded yet. Click "Record Vitals" above.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
