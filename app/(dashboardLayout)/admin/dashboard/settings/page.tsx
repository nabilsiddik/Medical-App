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
        setClinicName((sRes as any).brandName || sRes.clinicName || "Care Medical Chamber");
        setDoctorName(sRes.doctorName || "");
        setDoctorTitle(sRes.doctorTitle || "");
        setBmdcRegNumber(sRes.bmdcRegNumber || "");
        setContactPhone(sRes.contactPhone || (sRes as any).phone || "");
        setEmergencyPhone(sRes.emergencyPhone || "");
        setPrimaryColor(sRes.primaryColor || "#0284c7");
        setSecondaryColor(sRes.secondaryColor || "#0f766e");
        setBrandTagline((sRes as any).brandTagline || sRes.tagline || "");
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
        doctorName,
        doctorTitle,
        bmdcRegNumber,
        contactPhone,
        emergencyPhone,
      });

      if (res.success) {
        toast.success("Clinic profile updated successfully!");
        updateBrandingState({ brandName: clinicName });
      } else {
        toast.error("Failed to update clinic profile");
      }
    } catch (err) {
      toast.error("Error saving profile");
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
        brandTagline: brandTagline.trim() || undefined,
      });

      if (res.success) {
        toast.success("Branding & color palette updated! CSS variables synchronized.");
        updateBrandingState({
          primaryColor,
          secondaryColor,
          brandName: clinicName,
          brandTagline,
        });
      } else {
        toast.error(res.message || "Failed to update branding");
      }
    } catch (err: any) {
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Clinic Settings & Dynamic Branding
          <Badge variant="outline" className="text-xs text-primary">
            White-Label Ready
          </Badge>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Single-source branding system: change primary/secondary hex colors to instantly retheme the entire web app, emails, and PDFs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile & Chambers */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Clinic Profile Card */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Clinic & Doctor Credentials
              </CardTitle>
              <CardDescription className="text-xs">
                Printed on computerized prescriptions and booking confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Practice / Clinic Name *</Label>
                  <Input
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="rounded-xl h-10 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Doctor Full Name *</Label>
                    <Input
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">BMDC Registration # *</Label>
                    <Input
                      required
                      value={bmdcRegNumber}
                      onChange={(e) => setBmdcRegNumber(e.target.value)}
                      className="rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Doctor Medical Titles / Degrees</Label>
                  <Input
                    value={doctorTitle}
                    onChange={(e) => setDoctorTitle(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Chamber Inquiry Phone</Label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Emergency Hotline</Label>
                    <Input
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl font-semibold mt-2"
                >
                  <Save className="h-4 w-4 mr-1.5" />
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
                <CardDescription className="text-xs">
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
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Live Branding Customizer
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time color scale math & contrast foreground engine
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSaveBranding} className="space-y-4">
                {/* Primary Color Picker */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Primary Brand Color</Label>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                      className="h-10 w-14 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => handlePrimaryChange(e.target.value)}
                      className="rounded-xl h-10 font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                {/* Primary Scale Swatches */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Generated 50-950 Primary Shade Scale
                  </span>
                  <div className="flex rounded-lg overflow-hidden h-7 border border-border">
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
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Secondary Accent Color</Label>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {secondaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="h-10 w-14 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="rounded-xl h-10 font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                {/* Secondary Scale Swatches */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Generated 50-950 Secondary Shade Scale
                  </span>
                  <div className="flex rounded-lg overflow-hidden h-7 border border-border">
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
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-semibold">Brand Tagline</Label>
                  <Input
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                {/* Live Button & Badge Preview Box */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Live UI Component Preview
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="default" className="rounded-xl text-xs font-semibold">
                      Primary Button
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold">
                      Outline Button
                    </Button>
                    <Badge variant="default" className="text-[10px]">
                      Active Badge
                    </Badge>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savingBranding}
                  className="w-full rounded-xl font-bold shadow-md shadow-primary/25"
                >
                  <Save className="h-4 w-4 mr-1.5" />
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
