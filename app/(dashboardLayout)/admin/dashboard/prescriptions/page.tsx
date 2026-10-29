"use client";

import React, { useState, useEffect } from "react";
import { getPrescriptions } from "@/services/doctor/prescriptionServices";
import { IPrescription } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function PrescriptionsListPage() {
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await getPrescriptions({ searchTerm: searchTerm || undefined });
      setPrescriptions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrescriptions();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Prescriptions (Rx)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Browse computerized prescriptions, download signed PDFs, and check digital verification tokens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/prescriptions/new">
            <Button size="sm" className="rounded-xl font-semibold">
              <Plus className="h-4 w-4 mr-1.5" /> Write New Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescription by patient name or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl h-10 text-xs"
              />
            </div>
            <Button type="submit" variant="default" size="sm" className="rounded-xl px-5">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Prescriptions Table */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Prescription Records ({prescriptions.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Complete digital prescription archive
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date / Token</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Medicines Prescribed</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {prescriptions.length > 0 ? (
                  prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-foreground">
                          {new Date(rx.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground truncate max-w-[120px]">
                          {rx.verificationToken.slice(0, 10)}...
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {rx.patient?.name || "Patient"}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {rx.patient?.phoneNumber}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-[11px] font-medium">
                          {rx.diagnosis || "General Consultation"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium">
                        {rx.items?.length || 0} drugs
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {rx.followUpDate
                          ? new Date(rx.followUpDate).toLocaleDateString()
                          : "As needed"}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {/* Public QR Verification Link */}
                        <Link
                          href={`/verify-rx/${rx.verificationToken}`}
                          target="_blank"
                        >
                          <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 rounded-lg">
                            <ExternalLink className="h-3 w-3 mr-1" /> QR Verify
                          </Button>
                        </Link>

                        {/* Direct PDF Stream Download */}
                        <a
                          href={`http://localhost:5000/api/v1/prescription/${rx.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="default" className="h-7 text-[11px] px-2.5 rounded-lg font-semibold">
                            <Download className="h-3 w-3 mr-1" /> PDF
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No prescriptions found. Click "Write New Prescription" to begin.
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
