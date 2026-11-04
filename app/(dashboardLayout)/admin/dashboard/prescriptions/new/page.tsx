"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPatients, getPatientById } from "@/services/doctor/patientServices";
import { createPrescription, searchDrugs } from "@/services/doctor/prescriptionServices";
import { IPatient, IPrescriptionItem } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Pill,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPatientId = searchParams.get("patientId");
  const queryAppointmentId = searchParams.get("appointmentId");

  const [patients, setPatients] = useState<IPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(queryPatientId || "");
  const [currentPatient, setCurrentPatient] = useState<IPatient | null>(null);

  // Clinical inputs
  const [chiefComplaints, setChiefComplaints] = useState("");
  const [clinicalFindings, setClinicalFindings] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("Drink plenty of water. Adequate bed rest. Avoid oily & spicy foods.");
  const [followUpDate, setFollowUpDate] = useState("");

  // Medicines (Rx) rows
  const [items, setItems] = useState<IPrescriptionItem[]>([
    {
      brandName: "",
      dosage: "1+0+1",
      duration: "5 days",
      instruction: "After meal",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPatients().then((res) => {
      setPatients(res.data || []);
      if (!selectedPatientId && res.data && res.data.length > 0) {
        setSelectedPatientId(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      getPatientById(selectedPatientId).then((p) => setCurrentPatient(p));
    }
  }, [selectedPatientId]);

  const addMedicineRow = () => {
    setItems([
      ...items,
      {
        brandName: "",
        dosage: "1+0+1",
        duration: "7 days",
        instruction: "After meal",
      },
    ]);
  };

  const removeMedicineRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof IPrescriptionItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Check for allergy conflicts
  const allergyConflicts = items.filter((item) => {
    if (!item.brandName || !currentPatient?.allergies) return false;
    return currentPatient.allergies.some(
      (allg) =>
        (item.brandName ? item.brandName.toLowerCase().includes(allg.toLowerCase()) : false) ||
        item.genericName?.toLowerCase().includes(allg.toLowerCase())
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }
    if (items.length === 0 || !items[0].brandName.trim()) {
      toast.error("Please add at least one medication");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createPrescription({
        patientId: selectedPatientId,
        appointmentId: queryAppointmentId || undefined,
        chiefComplaints: chiefComplaints || undefined,
        clinicalFindings: clinicalFindings || undefined,
        diagnosis: diagnosis || undefined,
        advice: advice || undefined,
        followUpDate: followUpDate || undefined,
        items,
      });

      if (res.success) {
        toast.success("Prescription generated & digitally signed!");
        router.push("/admin/dashboard/prescriptions");
      } else {
        toast.error(res.message || "Failed to create prescription");
      }
    } catch (err) {
      toast.error("Error creating prescription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/prescriptions">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Prescription Builder (Rx)
              <Badge className="bg-primary/10 text-primary text-xs font-mono border-primary/20">
                Digital Pad
              </Badge>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clinical decision support, drug scheduling, and automated QR verification stamp.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selector & Info Card */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Patient Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select Patient *</Label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-card text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p: any) => {
                    const displayName = p.fullName || p.name || `Patient #${p.patientId || p.id.slice(0, 6)}`;
                    const displayPhone = p.phone || p.phoneNumber ? `(${p.phone || p.phoneNumber})` : "";
                    const displayAge = (p.age !== undefined && p.age !== null)
                      ? `${p.age} yrs`
                      : p.ageYears
                      ? `${p.ageYears} yrs`
                      : "Age N/A";
                    return (
                      <option key={p.id} value={p.id}>
                        {displayName} {displayPhone} - {displayAge}
                      </option>
                    );
                  })}
                </select>
              </div>

              {currentPatient && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground text-sm block">
                      {(currentPatient as any).fullName || currentPatient.name || "Patient"}
                    </span>
                    <span className="text-muted-foreground">
                      {((currentPatient as any).age ?? currentPatient.ageYears ?? "--")} Yrs • {currentPatient.gender || "Unknown"} • Blood: {currentPatient.bloodGroup || "Unknown"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {(currentPatient as any).phone || currentPatient.phoneNumber || ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Documented Allergies Warning */}
            {currentPatient?.allergies && currentPatient.allergies.length > 0 && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  <strong>Documented Patient Allergies:</strong>{" "}
                  {currentPatient.allergies.join(", ")}. Please verify medication safety.
                </span>
              </div>
            )}

            {allergyConflicts.length > 0 && (
              <div className="p-3 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold flex items-center gap-2 animate-bounce">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  CRITICAL ALLERGY ALERT: One or more prescribed medications conflict with patient's allergy history!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clinical Notes (Complaints, Findings, Diagnosis) */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chief Complaints</Label>
                <Input
                  placeholder="e.g. High fever for 4 days, cough, headache"
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Clinical Diagnosis *</Label>
                <Input
                  required
                  placeholder="e.g. Acute Upper Respiratory Tract Infection (URTI)"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="rounded-xl h-10 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Examination Findings / Lab Summary</Label>
              <Input
                placeholder="e.g. Chest clear, throat hyperemic, BP 120/80 mmHg"
                value={clinicalFindings}
                onChange={(e) => setClinicalFindings(e.target.value)}
                className="rounded-xl h-10 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescribed Medications Schedule (Rx) */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                Prescription Medicines (Rx)
              </CardTitle>
              <CardDescription className="text-xs">
                Add drugs, dosage frequencies, and meal instructions
              </CardDescription>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMedicineRow}
              className="rounded-xl text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Drug
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Brand / Medicine Name */}
                <div className="sm:col-span-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground font-semibold">
                    Medicine Name *
                  </Label>
                  <Input
                    required
                    placeholder="e.g. Napa Extra, Seclo 20mg"
                    value={item.brandName}
                    onChange={(e) => updateMedicine(index, "brandName", e.target.value)}
                    className="rounded-lg h-9 text-xs font-semibold"
                  />
                </div>

                {/* Dosage */}
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-[11px] text-muted-foreground font-semibold">
                    Dosage
                  </Label>
                  <Input
                    placeholder="1+0+1"
                    value={item.dosage}
                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                    className="rounded-lg h-9 text-xs font-mono font-bold"
                  />
                </div>

                {/* Duration */}
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-[11px] text-muted-foreground font-semibold">
                    Duration
                  </Label>
                  <Input
                    placeholder="7 days"
                    value={item.duration}
                    onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                    className="rounded-lg h-9 text-xs"
                  />
                </div>

                {/* Instruction */}
                <div className="sm:col-span-3 space-y-1">
                  <Label className="text-[11px] text-muted-foreground font-semibold">
                    Instruction
                  </Label>
                  <Input
                    placeholder="After meal"
                    value={item.instruction}
                    onChange={(e) => updateMedicine(index, "instruction", e.target.value)}
                    className="rounded-lg h-9 text-xs"
                  />
                </div>

                {/* Delete button */}
                <div className="sm:col-span-1 pt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={items.length <= 1}
                    onClick={() => removeMedicineRow(index)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Advice & Follow-Up Date */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Doctor's Advice & Next Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">General & Lifestyle Advice</Label>
              <Textarea
                rows={3}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5 max-w-xs">
              <Label className="text-xs font-semibold">Recommended Follow-up Date</Label>
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="rounded-xl h-10 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/dashboard/prescriptions">
            <Button type="button" variant="outline" className="rounded-xl px-5">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-xl px-7 font-bold shadow-md shadow-primary/25"
          >
            {submitting ? "Signing & Generating PDF..." : "Sign & Generate Prescription (Rx)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
