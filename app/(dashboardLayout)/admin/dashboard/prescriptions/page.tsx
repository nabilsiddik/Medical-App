"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getPrescriptions } from "@/services/doctor/prescriptionServices";
import { IPrescription } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Download,
  ExternalLink,
  RotateCcw,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function PrescriptionsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL query params
  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  // Search input state and debounce
  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Data states
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [meta, setMeta] = useState({
    page: urlPage,
    limit: urlLimit,
    total: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1";

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearchTerm);
  }, [urlSearchTerm]);

  // Push debounced search to URL
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter/search change

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

  // Fetch Prescriptions
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await getPrescriptions({
        page: urlPage,
        limit: urlLimit,
        searchTerm: urlSearchTerm || undefined,
      });

      setPrescriptions(res?.data || []);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Error loading prescriptions:", err);
      toast.error("Failed to load prescription records");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on query params change
  useEffect(() => {
    fetchPrescriptions();
  }, [urlPage, urlLimit, urlSearchTerm]);

  const hasActiveFilters = Boolean(urlSearchTerm);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            <span>Prescriptions (Rx)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse computerized prescriptions, download signed PDFs, and check digital verification tokens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/prescriptions/new">
            <Button size="sm" className="rounded-xl font-semibold h-10 px-4 cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" /> Write New Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Search & Reset Bar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescription by patient name, phone or diagnosis..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-9 h-11 text-sm rounded-xl bg-background border-border/80 focus-visible:ring-primary/20"
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

            <div className="flex items-center gap-2.5">
              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-11 px-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset search"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPrescriptions}
                disabled={loading}
                className="h-11 px-3.5 rounded-xl text-sm text-muted-foreground cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                Prescription Records
              </CardTitle>
              <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                {meta.total} Prescriptions
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-0.5">
              Complete computerized prescription archive and digital verifications
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Loading prescriptions...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-sm text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Date / Token</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Patient</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Diagnosis</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Medicines Prescribed</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Follow-up</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {prescriptions.length > 0 ? (
                  prescriptions.map((rx) => {
                    const patientName = rx.patient?.fullName || rx.patient?.name || "Patient";
                    const patientPhone = rx.patient?.phone || rx.patient?.phoneNumber || "N/A";
                    const tokenShort = rx.verificationToken ? `${rx.verificationToken.slice(0, 10)}...` : "N/A";
                    const diagnosesList = Array.isArray(rx.diagnoses) && rx.diagnoses.length > 0
                      ? rx.diagnoses.join(", ")
                      : rx.diagnosis || "General Consultation";

                    return (
                      <tr key={rx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <div className="font-mono font-bold text-foreground">
                            {new Date(rx.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground truncate max-w-[140px] mt-0.5">
                            {tokenShort}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <div className="font-semibold text-foreground">
                            {patientName}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            {patientPhone}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5 max-w-[200px] truncate">
                            {diagnosesList}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono font-medium">
                          {rx.items?.length || 0} drugs
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono text-muted-foreground">
                          {rx.followUpDate || rx.nextFollowUpDate
                            ? new Date(rx.followUpDate || rx.nextFollowUpDate!).toLocaleDateString()
                            : "As needed"}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap space-x-2">
                          {/* Public QR Verification Link */}
                          {rx.verificationToken && (
                            <Link
                              href={`/verify-rx/${rx.verificationToken}`}
                              target="_blank"
                            >
                              <Button size="sm" variant="outline" className="h-8 text-xs px-2.5 rounded-lg cursor-pointer">
                                <ExternalLink className="h-3.5 w-3.5 mr-1" /> QR Verify
                              </Button>
                            </Link>
                          )}

                          {/* Direct PDF Stream Download */}
                          <a
                            href={`${serverUrl}/prescription/${rx.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button size="sm" variant="default" className="h-8 text-xs px-2.5 rounded-lg font-semibold cursor-pointer">
                              <Download className="h-3.5 w-3.5 mr-1" /> PDF
                            </Button>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      {loading ? "Loading prescriptions..." : "No prescriptions found matching your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination meta={meta} itemName="prescriptions" isPending={loading || isPending} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
