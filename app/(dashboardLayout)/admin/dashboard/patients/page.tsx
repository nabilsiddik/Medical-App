"use client";

import React, { useState, useEffect } from "react";
import { getPatients, createPatient } from "@/services/doctor/patientServices";
import { IPatient } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Eye,
  Activity,
  Calendar,
  Phone,
  AlertTriangle,
} from "lucide-react";

export default function PatientsListPage() {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Patient Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newGender, setNewGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [newBloodGroup, setNewBloodGroup] = useState("");
  const [newAllergies, setNewAllergies] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients({ searchTerm: searchTerm || undefined });
      setPatients(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients();
  };

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Patients & Electronic Medical Records (EMR)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Search patient records, clinical timelines, past prescriptions, and vitals trend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl">
                <Plus className="h-4 w-4 mr-1.5" /> Register New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Register Patient Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Rahim Ahmed"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number *</Label>
                    <Input
                      required
                      placeholder="018xxxxxxxx"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Age (Years)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 45"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Blood Group</Label>
                    <Input
                      placeholder="e.g. B+"
                      value={newBloodGroup}
                      onChange={(e) => setNewBloodGroup(e.target.value)}
                      className="rounded-xl h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Allergies (comma-separated)</Label>
                  <Input
                    placeholder="e.g. Penicillin, NSAIDs"
                    value={newAllergies}
                    onChange={(e) => setNewAllergies(e.target.value)}
                    className="rounded-xl h-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl mt-3 font-semibold"
                >
                  {submitting ? "Saving..." : "Create Patient Record"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Input */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name or phone..."
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

      {/* Patient List Table */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Patient Directory ({patients.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Permanent clinical records in this practice
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Allergies</th>
                  <th className="py-3 px-4">Visits</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/dashboard/patients/${p.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                        >
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-muted-foreground">
                          ID: {p.id.slice(0, 8)}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {p.phoneNumber}
                      </td>

                      <td className="py-3 px-4">
                        {p.ageYears ? `${p.ageYears} yrs` : "N/A"} • {p.gender}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                          {p.bloodGroup || "Unknown"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        {p.allergies && p.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.allergies.map((allg) => (
                              <Badge
                                key={allg}
                                variant="outline"
                                className="text-[10px] text-destructive border-destructive/30 bg-destructive/5"
                              >
                                {allg}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium">
                        {p._count?.appointments || 0} visits
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/dashboard/patients/${p.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5 rounded-lg">
                            <Eye className="h-3.5 w-3.5 mr-1" /> View EMR
                          </Button>
                        </Link>
                        <Link href={`/admin/dashboard/prescriptions/new?patientId=${p.id}`}>
                          <Button size="sm" variant="default" className="h-7 text-[11px] px-2.5 rounded-lg font-semibold">
                            New Rx
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No patient records found.
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
