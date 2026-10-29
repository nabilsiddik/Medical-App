import React from "react";
import { Metadata } from "next";
import { verifyPrescription } from "@/services/doctor/prescriptionServices";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldX,
  FileCheck,
  Calendar,
  User,
  Stethoscope,
  Pill,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface VerifyPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { token } = await params;
  return {
    title: `Digital Prescription Verification (${token.substring(0, 8)}...)`,
    description: "Official tamper-evident digital prescription verification portal.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PrescriptionVerifyPage({ params }: VerifyPageProps) {
  const { token } = await params;
  const result = await verifyPrescription(token);

  const isValid = result.valid && result.data;
  const rx = result.data;

  return (
    <div className="min-h-screen py-12 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {isValid ? (
          <Card className="rounded-3xl border-emerald-500/30 bg-card shadow-lg overflow-hidden">
            {/* Header Authenticity Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8 text-center space-y-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs uppercase tracking-widest font-bold">
                Authentic Digital Record
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Prescription Verified
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
                This prescription is an authentic, tamper-evident digital medical record issued by Dr. Sarah&apos;s Care Chamber.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Doctor Details */}
              <div className="flex items-start justify-between p-4 rounded-2xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {rx.doctor?.fullName || "Prof. Dr. Sarah Rahman"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Senior Consultant Physician & Cardiologist
                    </p>
                    <p className="text-[11px] font-mono text-primary font-medium mt-0.5">
                      BMDC: A-54321
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                  Valid Stamp
                </Badge>
              </div>

              {/* Record Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Prescription #</span>
                  <span className="font-mono font-bold text-foreground">{rx.prescriptionNumber || "RX-ONLINE"}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Issue Date</span>
                  <span className="font-semibold text-foreground">
                    {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Patient Name:</span>
                  <span className="font-bold text-foreground">{rx.patient?.fullName || "Registered Patient"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-mono text-muted-foreground">{rx.patientId?.substring(0, 12)}...</span>
                </div>
              </div>

              {/* Prescribed Items summary */}
              {rx.items && rx.items.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5 text-primary" />
                    <span>Prescribed Medications ({rx.items.length})</span>
                  </h4>
                  <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-muted/10 overflow-hidden">
                    {rx.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-foreground">{item.drugName || item.brandName}</span>
                          <span className="text-muted-foreground ml-2">({item.form || "Tablet"})</span>
                        </div>
                        <span className="font-mono text-primary font-semibold">{item.dose || item.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/prescription/${rx.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1"
                >
                  <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-11">
                    <FileCheck className="h-4 w-4 mr-2" /> Download Original PDF
                  </Button>
                </a>
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full rounded-xl text-xs h-11">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-destructive/30 bg-card shadow-lg p-8 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <ShieldX className="h-10 w-10" />
            </div>
            <Badge variant="destructive" className="text-xs font-bold uppercase tracking-wider">
              Verification Failed
            </Badge>
            <h1 className="text-2xl font-bold text-foreground">
              Prescription Not Found
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              This verification link is either invalid, expired, or has been revoked. Please check the QR code on your prescription sheet or contact our chamber helpline.
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button variant="outline" className="rounded-xl text-xs">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Chamber Home
                </Button>
              </Link>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
