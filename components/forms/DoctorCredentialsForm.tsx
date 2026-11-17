"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/shared/buttons/Button";
import { toast } from "sonner";
import { updateClinicSettings } from "@/services/doctor/clinicServices";
import { IClinicSettings } from "@/types/doctor.interface";
import {
  Stethoscope,
  Award,
  FileCheck,
  DollarSign,
  GraduationCap,
  Save,
  CheckCircle2,
} from "lucide-react";

interface DoctorCredentialsFormProps {
  settings: IClinicSettings | null;
}

export default function DoctorCredentialsForm({ settings }: DoctorCredentialsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [doctorName, setDoctorName] = useState(settings?.doctorName || "");
  const [doctorTitle, setDoctorTitle] = useState(settings?.doctorTitle || "");
  const [specialization, setSpecialization] = useState(settings?.specialization || "");
  const [degrees, setDegrees] = useState(settings?.degrees || "");
  const [bmdcNumber, setBmdcNumber] = useState(settings?.bmdcNumber || settings?.bmdcRegNumber || "");
  const [experienceYears, setExperienceYears] = useState(settings?.experienceYears?.toString() || "15");
  const [contactEmail, setContactEmail] = useState(settings?.email || settings?.contactEmail || "");
  const [bio, setBio] = useState(settings?.bio || "");
  const [consultationFee, setConsultationFee] = useState(settings?.consultationFee?.toString() || "1000");
  const [videoConsultationFee, setVideoConsultationFee] = useState(settings?.videoConsultationFee?.toString() || "800");

  const [certificationsText, setCertificationsText] = useState(
    Array.isArray(settings?.certifications) ? settings.certifications.join(", ") : ""
  );
  const [certificateDocsText, setCertificateDocsText] = useState(
    Array.isArray(settings?.certificateDocuments) ? settings.certificateDocuments.join(", ") : ""
  );
  const [awardsText, setAwardsText] = useState(
    Array.isArray(settings?.awards) ? settings.awards.join(", ") : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: Partial<IClinicSettings> = {
        doctorName: doctorName.trim(),
        doctorTitle: doctorTitle.trim(),
        specialization: specialization.trim(),
        degrees: degrees.trim(),
        bmdcNumber: bmdcNumber.trim(),
        bmdcRegNumber: bmdcNumber.trim(),
        email: contactEmail.trim(),
        experienceYears: Number(experienceYears) || 0,
        bio: bio.trim(),
        consultationFee: Number(consultationFee) || 0,
        videoConsultationFee: Number(videoConsultationFee) || 0,
        certifications: certificationsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certificateDocuments: certificateDocsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        awards: awardsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await updateClinicSettings(payload);
      if (res.success) {
        toast.success("Doctor profile and clinical credentials updated successfully!");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch {
      toast.error("Failed to update doctor credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Clinical Title & Designations */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span>Professional Designation & Qualifications</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Displayed on website hero section, doctor cards, and generated prescription headers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Doctor Full Name</Label>
              <Input
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Prof. Dr. Sarah Ahmed"
                className="rounded-xl h-10 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Doctor Title / Prefix</Label>
              <Input
                value={doctorTitle}
                onChange={(e) => setDoctorTitle(e.target.value)}
                placeholder="Senior Consultant Physician"
                className="rounded-xl h-10 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Medical Degrees</Label>
              <Input
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                placeholder="MBBS, FCPS (Medicine), MD, MACP (USA)"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">BMDC Registration No.</Label>
              <Input
                value={bmdcNumber}
                onChange={(e) => setBmdcNumber(e.target.value)}
                placeholder="A-54321"
                className="rounded-xl h-10 text-xs font-mono font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Years of Experience</Label>
              <Input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="15"
                className="rounded-xl h-10 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Specialization</Label>
              <Input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Internal Medicine, Cardiovascular Care, Diabetes & Lifestyle"
                className="rounded-xl h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Public Topbar & Chamber Email</Label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="doctor@chamber.com"
                className="rounded-xl h-10 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Doctor Bio / Statement</Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief professional introduction for patients..."
              className="w-full text-xs p-3 rounded-xl border border-border bg-card h-24 resize-none leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fees & Consultation Charges */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span>Consultation Fees</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Default pricing for regular in-person chamber visits and virtual consultations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">In-Person Consultation Fee (BDT)</Label>
              <Input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="1000"
                className="rounded-xl h-10 text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Online Video Consultation Fee (BDT)</Label>
              <Input
                type="number"
                value={videoConsultationFee}
                onChange={(e) => setVideoConsultationFee(e.target.value)}
                placeholder="800"
                className="rounded-xl h-10 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications, Certificates & Awards */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Certifications, Document Links & Awards</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Provide comma-separated list of recognized credentials and verification documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Certifications (comma separated)</Label>
            <Input
              value={certificationsText}
              onChange={(e) => setCertificationsText(e.target.value)}
              placeholder="e.g. Fellowship in Cardiology (UK), Advanced Clinical Echocardiography, ACLS Certified"
              className="rounded-xl h-10 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Certificate Document Links / Upload URLs (comma separated)</Label>
            <Input
              value={certificateDocsText}
              onChange={(e) => setCertificateDocsText(e.target.value)}
              placeholder="https://example.com/certs/bmdc-certificate.pdf, https://example.com/certs/fcps.pdf"
              className="rounded-xl h-10 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Honors & Awards (comma separated)</Label>
            <Input
              value={awardsText}
              onChange={(e) => setAwardsText(e.target.value)}
              placeholder="Gold Medalist in Medicine 2018, National Health Service Excellence Award"
              className="rounded-xl h-10 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={submitting}
          loadingText="Saving Credentials..."
          className="rounded-xl h-11 px-6 font-semibold shadow-xs gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Doctor Profile & Credentials</span>
        </Button>
      </div>
    </form>
  );
}

