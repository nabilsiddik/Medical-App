"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getClinicSettings,
  updateClinicSettings,
  updateBranding,
  getChamberLocations,
} from "@/services/doctor/clinicServices";
import { IClinicSettings, IChamberLocation } from "@/types/doctor.interface";
import { useBranding } from "@/components/branding/BrandingProvider";
import { generateColorScale } from "@/utils/colorUtils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Settings,
  Palette,
  Building,
  CheckCircle,
  Save,
  MapPin,
  Phone,
  Sparkles,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function ClinicSettingsPage() {
  const { branding, updateBrandingState } = useBranding();
  const [settings, setSettings] = useState<IClinicSettings | null>(null);
  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Clinic Profile State
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorTitle, setDoctorTitle] = useState("");
  const [bmdcRegNumber, setBmdcRegNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Branding Customizer State
  const [primaryColor, setPrimaryColor] = useState(branding?.primaryColor || "#0284c7");
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondaryColor || "#0f766e");
  const [brandTagline, setBrandTagline] = useState(branding?.brandTagline || "");
  const [savingBranding, setSavingBranding] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        getClinicSettings(),
        getChamberLocations(),
      ]);
      if (sRes) {
        setSettings(sRes);
        const fetchedClinicName =
          sRes.clinicName ||
          (sRes as any).brandName ||
          (sRes as any).branding?.brandName ||
          "Care Medical Chamber";
        const fetchedDoctorName =
          sRes.doctorName ||
          (sRes as any).doctor?.name ||
          "";
        const fetchedDoctorTitle =
          sRes.doctorTitle ||
          (sRes as any).doctor?.title ||
          "";
        const fetchedBmdc =
          sRes.bmdcRegNumber ||
          (sRes as any).bmdcNumber ||
          (sRes as any).doctor?.bmdcNumber ||
          "";
        const fetchedPhone =
          sRes.contactPhone ||
          (sRes as any).phone ||
          (sRes as any).contact?.phone ||
          "";
        const fetchedEmergency =
          sRes.emergencyPhone ||
          (sRes as any).contact?.emergencyPhone ||
          "";
        const fetchedPrimary =
          sRes.primaryColor ||
          (sRes as any).branding?.primaryColor ||
          "#0284c7";
        const fetchedSecondary =
          sRes.secondaryColor ||
          (sRes as any).branding?.secondaryColor ||
          "#0f766e";
        const fetchedTagline =
          (sRes as any).brandTagline ||
          (sRes as any).branding?.brandTagline ||
          sRes.tagline ||
          "";

        setClinicName(fetchedClinicName);
        setDoctorName(fetchedDoctorName);
        setDoctorTitle(fetchedDoctorTitle);
        setBmdcRegNumber(fetchedBmdc);
        setContactPhone(fetchedPhone);
        setEmergencyPhone(fetchedEmergency);
        setPrimaryColor(fetchedPrimary);
        setSecondaryColor(fetchedSecondary);
        setBrandTagline(fetchedTagline);
      }
      setChambers(cRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update live preview in real time when color pickers change
  const handlePrimaryChange = (color: string) => {
    setPrimaryColor(color);
    updateBrandingState({ primaryColor: color });
  };

  const handleSecondaryChange = (color: string) => {
    setSecondaryColor(color);
    updateBrandingState({ secondaryColor: color });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateClinicSettings({
        clinicName,
        brandName: clinicName,
        doctorName,
        doctorTitle,
        bmdcRegNumber,
        bmdcNumber: bmdcRegNumber,
        contactPhone,
        phone: contactPhone,
        emergencyPhone,
      });

      if (res?.success || res?.id || res?.data) {
        toast.success("Clinic profile & credentials updated successfully!");
        updateBrandingState({ brandName: clinicName });
        await fetchSettings();
      } else {
        toast.error(res?.message || "Failed to update clinic profile");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBranding(true);
    try {
      const res = await updateBranding({
        primaryColor,
        secondaryColor,
        brandName: clinicName.trim() || undefined,
        clinicName: clinicName.trim() || undefined,
        brandTagline: brandTagline.trim() || undefined,
      });

      if (res?.success || res?.id || res?.data) {
        toast.success("Branding & color palette updated! CSS variables synchronized across the whole website.");
        updateBrandingState({
          primaryColor,
          secondaryColor,
          brandName: clinicName,
          brandTagline,
        });
        await fetchSettings();
      } else {
        toast.error(res?.message || "Failed to update branding");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving branding");
    } finally {
      setSavingBranding(false);
    }
  };

  const primaryScale = generateColorScale(primaryColor);
  const secondaryScale = generateColorScale(secondaryColor);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Clinic Settings & Dynamic Branding
          <Badge variant="outline" className="text-base text-primary border-primary/40 py-0.5 px-3">
            White-Label Ready
          </Badge>
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Single-source branding system: change primary/secondary hex colors to instantly retheme the entire web app, public home page, header, booking engine, emails, and PDFs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile & Chambers */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Clinic Profile Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Clinic & Doctor Credentials
              </CardTitle>
              <CardDescription className="text-base">
                Printed on computerized prescriptions and booking confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-bold">Practice / Clinic Name *</Label>
                  <Input
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="rounded-xl h-12 text-base font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Doctor Full Name *</Label>
                    <Input
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="rounded-xl h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-bold">BMDC Registration # *</Label>
                    <Input
                      required
                      value={bmdcRegNumber}
                      onChange={(e) => setBmdcRegNumber(e.target.value)}
                      className="rounded-xl h-12 text-base font-mono"
                      placeholder="e.g. A-54321"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-bold">Doctor Medical Titles / Degrees</Label>
                  <Input
                    value={doctorTitle}
                    onChange={(e) => setDoctorTitle(e.target.value)}
                    className="rounded-xl h-12 text-base"
                    placeholder="e.g. MBBS, FCPS, MD"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Chamber Inquiry Phone</Label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="rounded-xl h-12 text-base"
                      placeholder="+880 1700-112233"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-bold">Emergency Hotline</Label>
                    <Input
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="rounded-xl h-12 text-base font-mono"
                      placeholder="12345 or +880 1700-000000"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl font-bold h-12 px-6 text-base mt-2"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {savingProfile ? "Saving..." : "Save Clinic Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Chamber Locations Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Active Chamber Locations ({chambers.length})
                </CardTitle>
                <CardDescription className="text-base">
                  Manage chamber branches, consultation hours, and multiple break times
                </CardDescription>
              </div>
              <Link href="/admin/dashboard/schedules">
                <Button size="sm" variant="outline" className="rounded-xl font-semibold gap-1.5 text-primary border-primary/40 hover:bg-primary/10">
                  <Clock className="h-3.5 w-3.5" />
                  Manage Schedules & Breaks
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {chambers.map((chamber) => (
                <div
                  key={chamber.id}
                  className="p-3.5 rounded-xl border border-border/70 bg-card flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-foreground">{chamber.name}</h4>
                    <p className="text-muted-foreground mt-0.5">
                      {chamber.address}, {chamber.city}
                    </p>
                    <div className="text-primary font-mono mt-1">
                      Slot duration: {chamber.defaultSlotDurationMinutes} mins
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="text-emerald-600">
                      Active Chamber
                    </Badge>
                    <Link href={`/admin/dashboard/schedules?chamberId=${chamber.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 rounded-lg text-primary hover:bg-primary/10 gap-1 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        Edit Schedule
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Single-Source Branding Customizer */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Live Branding Customizer
              </CardTitle>
              <CardDescription className="text-base">
                Real-time color scale math & contrast foreground engine
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSaveBranding} className="space-y-4">
                {/* Primary Color Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Primary Brand Color</Label>
                    <span className="font-mono text-base font-bold text-foreground">
                      {primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                      className="h-12 w-16 rounded-xl cursor-pointer border border-border bg-transparent p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                      className="rounded-xl h-12 font-mono text-base uppercase"
                    />
                  </div>
                </div>

                {/* Primary Scale Swatches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-base uppercase tracking-wider text-muted-foreground font-semibold">
                    Generated 50-950 Primary Shade Scale
                  </span>
                  <div className="flex rounded-xl overflow-hidden h-9 border border-border">
                    {Object.entries(primaryScale).map(([shade, hex]) => (
                      <div
                        key={shade}
                        style={{ backgroundColor: hex }}
                        title={`${shade}: ${hex}`}
                        className="flex-1 cursor-pointer transition-transform hover:scale-110"
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Color Picker */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Secondary Accent Color</Label>
                    <span className="font-mono text-base font-bold text-foreground">
                      {secondaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="h-12 w-16 rounded-xl cursor-pointer border border-border bg-transparent p-1"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="rounded-xl h-12 font-mono text-base uppercase"
                    />
                  </div>
                </div>

                {/* Secondary Scale Swatches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-base uppercase tracking-wider text-muted-foreground font-semibold">
                    Generated 50-950 Secondary Shade Scale
                  </span>
                  <div className="flex rounded-xl overflow-hidden h-9 border border-border">
                    {Object.entries(secondaryScale).map(([shade, hex]) => (
                      <div
                        key={shade}
                        style={{ backgroundColor: hex }}
                        title={`${shade}: ${hex}`}
                        className="flex-1 cursor-pointer transition-transform hover:scale-110"
                      />
                    ))}
                  </div>
                </div>

                {/* Brand Tagline */}
                <div className="space-y-2 pt-2">
                  <Label className="text-base font-bold">Brand Tagline</Label>
                  <Input
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    className="rounded-xl h-12 text-base"
                    placeholder="e.g. Trusted Clinical Care & Preventive Health"
                  />
                </div>

                {/* Live Button & Badge Preview Box */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
                  <span className="text-base font-bold text-muted-foreground uppercase tracking-wider block">
                    Live UI Component Preview
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" variant="default" className="rounded-xl text-base font-bold h-10 px-4">
                      Primary Button
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl text-base font-bold h-10 px-4">
                      Outline Button
                    </Button>
                    <Badge variant="default" className="text-base py-1 px-3">
                      Active Badge
                    </Badge>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savingBranding}
                  className="w-full rounded-xl font-bold h-12 text-base shadow-md shadow-primary/25"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {savingBranding ? "Saving Palette..." : "Apply & Persist Branding"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
