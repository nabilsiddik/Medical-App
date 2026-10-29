"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Pill,
  Stethoscope,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import { IPrescription } from "@/types/doctor.interface";
import { getMyPrescriptions } from "@/services/doctor/prescriptionServices";

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await getMyPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span>My Prescriptions (Rx)</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Access, review, and download signed digital medical prescriptions issued during your visits.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={loadPrescriptions}
          className="rounded-xl text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Prescriptions List Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Medical Prescription Archive ({prescriptions.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Authentic, QR-verifiable prescriptions with dosage guidelines and doctor advice
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Rx Number / Date</th>
                  <th className="py-3 px-4">Consultant Doctor</th>
                  <th className="py-3 px-4">Diagnoses</th>
                  <th className="py-3 px-4">Prescribed Medicines</th>
                  <th className="py-3 px-4">Follow-Up Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {prescriptions.length > 0 ? (
                  prescriptions.map((rx) => {
                    const diagnosesList = Array.isArray(rx.diagnoses)
                      ? rx.diagnoses.join(", ")
                      : rx.diagnosis || "Clinical Consultation";

                    return (
                      <tr key={rx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-foreground">
                            {rx.prescriptionNumber || `RX-${rx.id.slice(0, 8)}`}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{rx.doctor?.fullName || "Prof. Dr. Sarah Ahmed"}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Senior Consultant Physician
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="secondary" className="text-[11px] font-medium max-w-[200px] truncate">
                            {diagnosesList}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Pill className="h-3.5 w-3.5 text-blue-500" />
                            <span>{rx.items?.length || 0} Medications</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {rx.nextFollowUpDate || rx.followUpDate
                            ? new Date(rx.nextFollowUpDate || rx.followUpDate!).toLocaleDateString()
                            : "As needed"}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          {/* QR Authenticity Verify */}
                          <Link href={`/verify-rx/${rx.verificationToken}`} target="_blank">
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 rounded-lg">
                              <ExternalLink className="h-3 w-3 mr-1" /> Verify
                            </Button>
                          </Link>

                          {/* Download PDF stream */}
                          <a
                            href={`${backendUrl}/prescription/${rx.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-[11px] px-3 rounded-lg font-semibold shadow-xs"
                            >
                              <Download className="h-3 w-3 mr-1" /> Download PDF
                            </Button>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      {loading
                        ? "Loading prescriptions..."
                        : "No medical prescriptions recorded yet. Your prescriptions will appear here following consultations."}
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

