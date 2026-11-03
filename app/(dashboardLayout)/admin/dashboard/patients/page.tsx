"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getPatients, createPatient } from "@/services/doctor/patientServices";
import { IPatient } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Eye,
  RotateCcw,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function PatientsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL query params
  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlGender = searchParams.get("gender") || "ALL";
  const urlBloodGroup = searchParams.get("bloodGroup") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  // Search input state and debounce
  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Filter dropdown states
  const [genderFilter, setGenderFilter] = useState(urlGender);
  const [bloodGroupFilter, setBloodGroupFilter] = useState(urlBloodGroup);

  // Data states
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [meta, setMeta] = useState({
    page: urlPage,
    limit: urlLimit,
    total: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);

  // Create Patient Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [newBloodGroup, setNewBloodGroup] = useState("");
  const [newAllergies, setNewAllergies] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearchTerm);
    setGenderFilter(urlGender);
    setBloodGroupFilter(urlBloodGroup);
  }, [urlSearchTerm, urlGender, urlBloodGroup]);

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
      if (!value || value === "ALL") {
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
    setGenderFilter("ALL");
    setBloodGroupFilter("ALL");
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Fetch Patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients({
        page: urlPage,
        limit: urlLimit,
        searchTerm: urlSearchTerm || undefined,
        gender: urlGender !== "ALL" ? urlGender : undefined,
        bloodGroup: urlBloodGroup !== "ALL" ? urlBloodGroup : undefined,
      });

      setPatients(res?.data || []);
      if (res?.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Error loading patients:", err);
      toast.error("Failed to load patient records");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on query params change
  useEffect(() => {
    fetchPatients();
  }, [urlPage, urlLimit, urlSearchTerm, urlGender, urlBloodGroup]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Name and Phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const allergiesList = newAllergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await createPatient({
        name: newName,
        fullName: newName,
        phone: newPhone,
        phoneNumber: newPhone,
        ageYears: newAge ? parseInt(newAge) : undefined,
        gender: newGender,
        bloodGroup: newBloodGroup || undefined,
        allergies: allergiesList,
      });

      if (res.success) {
        toast.success("Patient created successfully!");
        setCreateOpen(false);
        setNewName("");
        setNewPhone("");
        setNewAge("");
        setNewAllergies("");
        fetchPatients();
      } else {
        toast.error(res.message || "Failed to create patient");
      }
    } catch (err) {
      toast.error("Error creating patient");
    } finally {
      setSubmitting(false);
    }
  };

  const hasActiveFilters = Boolean(
    urlSearchTerm ||
    (urlGender && urlGender !== "ALL") ||
    (urlBloodGroup && urlBloodGroup !== "ALL")
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <span>Patients & Electronic Medical Records (EMR)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search patient records, clinical timelines, past prescriptions, and vitals trend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl font-semibold h-10 px-4 cursor-pointer">
                <Plus className="h-4 w-4 mr-1.5" /> Register New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Register Patient Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Rahim Ahmed"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Phone Number *</Label>
                    <Input
                      required
                      placeholder="018xxxxxxxx"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="rounded-xl h-10 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Age (Years)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 32"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      className="rounded-xl h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Gender</Label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Blood Group</Label>
                    <select
                      value={newBloodGroup}
                      onChange={(e) => setNewBloodGroup(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Known Allergies (comma separated)</Label>
                  <Input
                    placeholder="e.g. Penicillin, Sulfa drugs, Dust"
                    value={newAllergies}
                    onChange={(e) => setNewAllergies(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl mt-3 font-semibold h-11"
                >
                  {submitting ? "Registering..." : "Confirm Patient Registration"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dynamic Search & Filter Bar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name, phone or ID..."
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

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Gender Filter */}
              <Select
                value={genderFilter}
                onValueChange={(val) => {
                  setGenderFilter(val);
                  updateUrl({ gender: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[130px] text-sm font-medium rounded-xl">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Blood Group Filter */}
              <Select
                value={bloodGroupFilter}
                onValueChange={(val) => {
                  setBloodGroupFilter(val);
                  updateUrl({ bloodGroup: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[130px] text-sm font-medium rounded-xl">
                  <SelectValue placeholder="All Blood Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Blood</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-11 px-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPatients}
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

      {/* Patient List Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                Patient Directory
              </CardTitle>
              <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                {meta.total} Patients
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-0.5">
              Permanent clinical records and electronic charts in this practice
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Loading patient records...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-sm text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Patient Name</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Phone</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Age / Gender</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Blood Group</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Allergies</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Visits</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {patients.length > 0 ? (
                  patients.map((p) => {
                    const patientName = p.fullName || p.name || "Patient";
                    const patientPhone = p.phone || p.phoneNumber || "N/A";
                    const patientCode = p.patientId || (p.id ? p.id.slice(0, 8) : "");

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <Link
                            href={`/admin/dashboard/patients/${p.id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                          >
                            {patientName}
                          </Link>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            ID: {patientCode}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono text-muted-foreground">
                          {patientPhone}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          {p.ageYears ? `${p.ageYears} yrs` : "N/A"} • {p.gender}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <Badge variant="secondary" className="font-mono text-xs font-bold px-2 py-0.5">
                            {p.bloodGroup || "Unknown"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 sm:px-6">
                          {p.allergies && p.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {p.allergies.map((allg) => (
                                <Badge
                                  key={allg}
                                  variant="outline"
                                  className="text-xs text-destructive border-destructive/30 bg-destructive/5 px-2 py-0.5"
                                >
                                  {allg}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap font-mono font-medium">
                          {p._count?.appointments || 0} visits
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap space-x-2">
                          <Link href={`/admin/dashboard/patients/${p.id}`}>
                            <Button size="sm" variant="outline" className="h-8 text-xs px-2.5 rounded-lg cursor-pointer">
                              <Eye className="h-3.5 w-3.5 mr-1" /> View EMR
                            </Button>
                          </Link>
                          <Link href={`/admin/dashboard/prescriptions/new?patientId=${p.id}`}>
                            <Button size="sm" variant="default" className="h-8 text-xs px-2.5 rounded-lg font-semibold cursor-pointer">
                              New Rx
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      {loading ? "Loading patient records..." : "No patient records found matching your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination meta={meta} itemName="patients" isPending={loading || isPending} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
