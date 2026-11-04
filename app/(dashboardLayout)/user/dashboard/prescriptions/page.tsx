"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Pill,
  Stethoscope,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { toast } from "sonner";
import { IPrescription } from "@/types/doctor.interface";
import { getMyPrescriptions } from "@/services/doctor/prescriptionServices";

export default function PatientPrescriptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

  useEffect(() => {
    setSearchInput(urlSearchTerm);
  }, [urlSearchTerm]);

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
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
    startTransition(() => {
      router.push(pathname);
    });
  };

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await getMyPrescriptions();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const hasActiveFilters = Boolean(urlSearchTerm);

  // Filter prescriptions locally
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const term = urlSearchTerm.toLowerCase();
    const matchesSearch =
      !urlSearchTerm ||
      rx.prescriptionNumber?.toLowerCase().includes(term) ||
      rx.doctor?.fullName?.toLowerCase().includes(term) ||
      rx.diagnosis?.toLowerCase().includes(term) ||
      (Array.isArray(rx.diagnoses) && rx.diagnoses.some((d) => d.toLowerCase().includes(term))) ||
      (rx.items && rx.items.some((item) => item.drugName?.toLowerCase().includes(term) || (item as any).brandName?.toLowerCase().includes(term)));

    return matchesSearch;
  });

  const total = filteredPrescriptions.length;
  const totalPage = Math.max(1, Math.ceil(total / urlLimit));
  const currentPage = Math.min(urlPage, totalPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * urlLimit,
    currentPage * urlLimit
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            <span>My Prescriptions (Rx)</span>
          </h1>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={loadPrescriptions}
          disabled={loading}
          className="rounded-xl text-sm h-10 px-4 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Dynamic Search & Reset Bar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescription by medicine name, doctor, diagnosis, or Rx #..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-9 h-11 text-base rounded-xl bg-background border-border/80 focus-visible:ring-primary/20"
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

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-11 px-3.5 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                title="Reset search"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">
              Medical Prescription Archive
            </CardTitle>
            <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
              {total} Prescriptions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-base font-medium text-foreground">Loading prescriptions...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[760px] text-base text-left border-collapse">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider text-base">
                <tr>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap">Rx Number / Date</th>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap">Consultant Doctor</th>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap">Diagnoses</th>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap">Prescribed Medicines</th>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap">Follow-Up Date</th>
                  <th className="py-4 px-4 sm:px-5 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedPrescriptions.length > 0 ? (
                  paginatedPrescriptions.map((rx) => {
                    const diagnosesList = Array.isArray(rx.diagnoses)
                      ? rx.diagnoses.join(", ")
                      : rx.diagnosis || "Clinical Consultation";

                    return (
                      <tr key={rx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-foreground text-base">
                            {rx.prescriptionNumber || `RX-${rx.id.slice(0, 8)}`}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1.5 font-mono mt-0.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(rx.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <div className="font-bold text-foreground text-base flex items-center gap-1.5">
                            <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                            <span>{rx.doctor?.fullName || "Prof. Dr. Sarah Ahmed"}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            Senior Consultant Physician
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <Badge variant="secondary" className="text-sm font-medium max-w-[200px] truncate px-2.5 py-0.5">
                            {diagnosesList}
                          </Badge>
                        </td>

                        <td className="py-4 px-5 font-mono font-medium text-base">
                          <span className="inline-flex items-center gap-1.5">
                            <Pill className="h-4 w-4 text-blue-500" />
                            <span>{rx.items?.length || 0} Medications</span>
                          </span>
                        </td>

                        <td className="py-4 px-5 font-mono text-muted-foreground text-base">
                          {rx.nextFollowUpDate || rx.followUpDate
                            ? new Date(rx.nextFollowUpDate || rx.followUpDate!).toLocaleDateString()
                            : "As needed"}
                        </td>

                        <td className="py-4 px-5 text-right space-x-2">
                          {/* QR Authenticity Verify */}
                          {rx.verificationToken && (
                            <Link href={`/verify-rx/${rx.verificationToken}`} target="_blank">
                              <Button size="sm" variant="outline" className="h-9 text-sm px-3 rounded-xl cursor-pointer">
                                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Verify
                              </Button>
                            </Link>
                          )}

                          {/* Download PDF stream */}
                          <a
                            href={`${backendUrl}/prescription/${rx.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              size="sm"
                              variant="default"
                              className="h-9 text-sm px-3.5 rounded-xl font-semibold shadow-xs cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
                            </Button>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground text-base">
                      {loading
                        ? "Loading prescriptions..."
                        : "No medical prescriptions recorded yet matching your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination
              meta={{ page: currentPage, limit: urlLimit, total, totalPage }}
              itemName="prescriptions"
              isPending={loading || isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
