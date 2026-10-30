"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getChamberLocations, getServices } from "@/services/doctor/clinicServices";
import {
  getAvailabilityDetails,
  bookAppointment,
  ISlotItem,
  IAvailabilityResponse,
} from "@/services/doctor/appointmentServices";
import { IChamberLocation, IService } from "@/types/doctor.interface";
import { Button } from "@/components/shared/buttons/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Building,
  Coffee,
  XCircle,
  CalendarX2,
  Printer,
  Sparkles,
} from "lucide-react";
import MedicalSpikeLoader from "@/components/shared/MedicalSpikeLoader";
import { printAppointmentSlip } from "@/lib/printAppointmentSlip";
import { getLoggedInUser } from "@/services/user/userServices";

export default function BookingWizardPage() {
  const searchParams = useSearchParams();
  const preselectedChamber = searchParams.get("chamberId");

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [loadingChambers, setLoadingChambers] = useState(true);

  // Form State
  const [selectedChamberId, setSelectedChamberId] = useState<string>(preselectedChamber || "");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientGender, setPatientGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");

  // Slots & Availability State
  const [slots, setSlots] = useState<ISlotItem[]>([]);
  const [availabilityInfo, setAvailabilityInfo] = useState<IAvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Booking Result State
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Helper to convert 24h format (e.g. "17:00") into friendly 12h format ("05:00 PM")
  const formatSlotDisplay = (time24?: string) => {
    if (!time24) return "";
    const [hoursStr, minutesStr] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    if (isNaN(hours)) return time24;
    const minutes = minutesStr || "00";
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // Load chambers, services, and logged in user on mount
  useEffect(() => {
    Promise.all([getChamberLocations(), getServices(), getLoggedInUser().catch(() => null)])
      .then(([chamberData, serviceData, currentUser]) => {
        setChambers(chamberData);
        if (chamberData.length > 0 && !selectedChamberId) {
          setSelectedChamberId(chamberData[0].id);
        }

        setServices(serviceData);
        if (serviceData.length > 0 && !selectedServiceId) {
          setSelectedServiceId(serviceData[0].id);
        }

        if (currentUser) {
          if (currentUser.fullName) setPatientName(currentUser.fullName);
          if (currentUser.phoneNumber) setPatientPhone(currentUser.phoneNumber);
          if (currentUser.email) setPatientEmail(currentUser.email);
          if (currentUser.gender) {
            setPatientGender(currentUser.gender === "FEMALE" ? "FEMALE" : "MALE");
          }
        }
      })
      .finally(() => setLoadingChambers(false));

    // Default date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Fetch slots and chamber availability whenever chamber, date or service changes
  useEffect(() => {
    if (selectedChamberId && selectedDate) {
      setLoadingSlots(true);
      getAvailabilityDetails(selectedChamberId, selectedDate, selectedServiceId)
        .then((data) => {
          setAvailabilityInfo(data);
          const slotList = data?.slots || [];
          setSlots(slotList);

          // Select first available (not booked and not in break) slot
          const firstOpen = slotList.find(
            (s) => s.isAvailable && !s.isBooked && !s.isBreak
          );
          if (firstOpen) {
            setSelectedSlot(firstOpen.startTime || firstOpen.time);
          } else {
            setSelectedSlot("");
          }
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedChamberId, selectedDate, selectedServiceId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error("Please enter patient full name");
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 10) {
      toast.error("Please enter a valid contact phone number");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select an available consultation time slot");
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookAppointment({
        chamberId: selectedChamberId,
        serviceId: selectedServiceId || undefined,
        appointmentDate: selectedDate,
        startTime: selectedSlot,
        patientName,
        patientPhone,
        patientEmail: patientEmail || undefined,
        patientAge: patientAge ? parseInt(patientAge) : undefined,
        patientGender,
        chiefComplaint: chiefComplaint || undefined,
        type: "IN_PERSON",
      });

      if (res.success) {
        setBookingResult(res.data);
        setStep(4);
        toast.success("Appointment booked successfully!");
      } else {
        toast.error(res.message || "Failed to book appointment. That slot may have just been taken.");
      }
    } catch {
      toast.error("An error occurred during booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentChamber = chambers.find((c) => c.id === selectedChamberId);
  const currentService = services.find((s) => s.id === selectedServiceId);

  const availableSlotsCount = slots.filter((s) => s.isAvailable && !s.isBooked && !s.isBreak).length;
  const bookedSlotsCount = slots.filter((s) => s.isBooked).length;
  const breakSlotsCount = slots.filter((s) => s.isBreak).length;

  return (
    <div className="min-h-screen py-10 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Chamber & Service" },
              { num: 2, label: "Date & Slot" },
              { num: 3, label: "Patient Details" },
              { num: 4, label: "Confirmation" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-base transition-colors ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-base font-semibold text-muted-foreground mt-2 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-3">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 -z-10 rounded-full" />
            <div
              className="h-1 bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Chamber & Service */}
        {step === 1 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Select Chamber Location & Appointment Type
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                Choose the clinical chamber location and the type of consultation you require.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Chamber selection */}
              <div className="space-y-3">
                <Label className="text-base uppercase tracking-wider text-muted-foreground font-bold">
                  Chamber Location
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {chambers.map((chamber) => {
                    const isSelected = selectedChamberId === chamber.id;
                    return (
                      <div
                        key={chamber.id}
                        onClick={() => setSelectedChamberId(chamber.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-bold text-lg text-foreground">{chamber.name}</div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                        </div>
                        <p className="text-base text-muted-foreground mt-1.5 flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          {chamber.address}, {chamber.city}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-3 pt-2">
                <Label className="text-base uppercase tracking-wider text-muted-foreground font-bold">
                  Consultation Service & Pricing
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.length > 0 ? (
                    services.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      const price = (s.fee ?? s.price) ?? 0;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5 font-semibold text-primary"
                              : "border-border bg-card hover:bg-muted/50"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-base text-foreground">{s.name}</div>
                            <div className="text-base text-muted-foreground">
                              {s.durationMinutes} minutes duration
                            </div>
                          </div>
                          <div className="font-bold text-primary font-mono text-lg">
                            {price === 0 ? "FREE (৳0)" : `৳ ${price.toLocaleString()}`}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-base text-muted-foreground py-2">
                      Loading clinic services...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedChamberId}
                  className="rounded-xl px-8 h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue to Schedule <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Date & Available Time Slot */}
        {step === 2 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Pick Date & Time Slot
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{currentChamber?.name}</span> • Select your preferred consultation date and available time slot.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Date Input */}
              <div className="space-y-2">
                <Label htmlFor="appDate" className="text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Consultation Date
                </Label>
                <Input
                  id="appDate"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl h-12 text-base font-semibold max-w-sm"
                />
              </div>

              {/* Time Slots Area */}
              <div className="space-y-4 pt-2">
                {/* Status Legend */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                  <div className="flex items-center gap-2 font-bold text-base text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Chamber Schedule Slots</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-base font-medium">
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      Available ({availableSlotsCount})
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <span className="h-3 w-3 rounded-full bg-rose-500" />
                      Booked ({bookedSlotsCount})
                    </span>
                    {breakSlotsCount > 0 && (
                      <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                        <span className="h-3 w-3 rounded-full bg-amber-500" />
                        Break ({breakSlotsCount})
                      </span>
                    )}
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="py-12 flex justify-center">
                    <MedicalSpikeLoader
                      text="Checking Chamber Slots..."
                      subText="Evaluating doctor hours, breaks, and active bookings"
                    />
                  </div>
                ) : availabilityInfo?.isClosed || slots.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 mx-auto flex items-center justify-center">
                      <CalendarX2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold text-amber-900 dark:text-amber-200">
                      Doctor Chamber Closed on this Date
                    </h4>
                    <p className="text-base text-amber-800 dark:text-amber-300 max-w-md mx-auto">
                      {availabilityInfo?.reason ||
                        "No consultation schedule found for this day of the week at this chamber. The doctor may be off or visiting another clinic. Please select another date on the calendar."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {slots.map((slot) => {
                      const slotKey = slot.startTime || slot.time;
                      const isSelected = selectedSlot === slotKey;
                      const isAvailable = slot.isAvailable && !slot.isBooked && !slot.isBreak;

                      // 1. Doctor Break Slot
                      if (slot.isBreak) {
                        return (
                          <div
                            key={slotKey}
                            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 flex flex-col items-center justify-center text-center cursor-not-allowed opacity-85 select-none shadow-2xs"
                            title={`Doctor Break: ${slot.breakTitle || "Break Time"}`}
                          >
                            <span className="text-base font-mono font-semibold">
                              {formatSlotDisplay(slotKey)}
                            </span>
                            <span className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-1">
                              <Coffee className="h-3.5 w-3.5" />
                              {slot.breakTitle || "Break"}
                            </span>
                          </div>
                        );
                      }

                      // 2. Already Booked Slot (Disabled so double booking is impossible)
                      if (slot.isBooked) {
                        return (
                          <div
                            key={slotKey}
                            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-slate-500 flex flex-col items-center justify-center text-center cursor-not-allowed opacity-80 select-none shadow-2xs"
                            title="This slot has already been reserved by another patient"
                          >
                            <span className="text-base font-mono font-medium line-through text-slate-500">
                              {formatSlotDisplay(slotKey)}
                            </span>
                            <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                              <XCircle className="h-3.5 w-3.5" />
                              Booked
                            </span>
                          </div>
                        );
                      }

                      // 3. Open & Available Slot
                      return (
                        <button
                          key={slotKey}
                          type="button"
                          onClick={() => setSelectedSlot(slotKey)}
                          className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-md font-bold scale-[1.02]"
                              : "border-slate-200 bg-white hover:border-primary hover:bg-primary/5 text-slate-800 shadow-xs font-medium"
                          }`}
                        >
                          <span className="text-base font-mono font-bold">
                            {formatSlotDisplay(slotKey)}
                          </span>
                          <span
                            className={`text-xs font-semibold flex items-center gap-1 mt-1 ${
                              isSelected ? "text-white" : "text-emerald-600"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Selected
                              </>
                            ) : (
                              "Available"
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl h-11 px-5 text-base font-semibold"
                >
                  <ArrowLeft className="h-5 w-5 mr-1.5" /> Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="rounded-xl h-11 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Enter Patient Details <ArrowRight className="h-5 w-5 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Patient Information Form */}
        {step === 3 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Patient Information
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                Provide patient credentials for appointment confirmation and computerized queue registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleBook} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="pName" className="text-base font-bold text-foreground">
                    Full Patient Name *
                  </Label>
                  <Input
                    id="pName"
                    placeholder="e.g. Rahim Ahmed"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="rounded-xl h-12 text-base font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pPhone" className="text-base font-bold text-foreground">
                      Mobile / WhatsApp Phone *
                    </Label>
                    <Input
                      id="pPhone"
                      placeholder="e.g. 01700112233"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                      className="rounded-xl h-12 text-base font-mono font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pEmail" className="text-base font-bold text-foreground">
                      Email Address (Optional)
                    </Label>
                    <Input
                      id="pEmail"
                      type="email"
                      placeholder="e.g. patient@gmail.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="rounded-xl h-12 text-base font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pAge" className="text-base font-bold text-foreground">
                      Age (Years)
                    </Label>
                    <Input
                      id="pAge"
                      type="number"
                      placeholder="e.g. 35"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="rounded-xl h-12 text-base font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-base font-bold text-foreground">Gender</Label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full h-12 px-3 rounded-xl border border-input bg-card text-base font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pComplaints" className="text-base font-bold text-foreground">
                    Chief Complaint / Primary Symptoms (Optional)
                  </Label>
                  <Input
                    id="pComplaints"
                    placeholder="e.g. High blood pressure follow-up, chest discomfort"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="rounded-xl h-12 text-base"
                  />
                </div>

                {/* Booking Summary Pill */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-base text-foreground space-y-1.5">
                  <div className="font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Booking Summary Preview:
                  </div>
                  <div className="text-foreground font-semibold">
                    {currentChamber?.name} • {selectedDate} at {formatSlotDisplay(selectedSlot)}
                  </div>
                  <div className="text-muted-foreground font-mono">
                    Service: {currentService?.name || "Standard Consultation"} • Fee:{" "}
                    {(currentService?.fee ?? currentService?.price) === 0
                      ? "FREE (৳0)"
                      : `৳ ${(currentService?.fee ?? currentService?.price)?.toLocaleString()}`}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="rounded-xl h-11 px-5 text-base font-semibold"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl h-12 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                  >
                    {submitting ? "Confirming Booking..." : "Confirm & Book Slot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Confirmation Screen */}
        {step === 4 && (
          <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 shadow-md">
            <CardHeader className="text-center p-6 pb-2">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <CardTitle className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                Appointment Confirmed!
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">
                Your consultation slot has been officially reserved in the doctor's schedule.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6 max-w-lg mx-auto">
              {/* Token & Reference Card */}
              <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-xs space-y-2">
                <span className="text-base text-muted-foreground uppercase tracking-widest font-bold">
                  Queue Serial Token
                </span>
                <div className="text-4xl font-black text-primary">
                  Token #{bookingResult?.serialNumber || 1}
                </div>
                <div className="text-base font-mono text-muted-foreground">
                  Ref: {bookingResult?.appointmentRef || bookingResult?.id?.slice(0, 8).toUpperCase() || "APT-CONFIRMED"}
                </div>
              </div>

              {/* Appointment Details List */}
              <div className="space-y-3 text-base">
                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Patient Name:</span>
                  <span className="font-bold text-foreground">{patientName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Chamber Location:</span>
                  <span className="font-bold text-foreground">{currentChamber?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Date & Slot:</span>
                  <span className="font-bold text-primary font-mono">
                    {selectedDate} at {formatSlotDisplay(selectedSlot)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-bold font-mono text-foreground">
                    {(bookingResult?.fee ?? (currentService?.fee ?? currentService?.price)) === 0
                      ? "FREE (৳0)"
                      : `৳ ${(bookingResult?.fee ?? (currentService?.fee ?? currentService?.price))?.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/60 text-base text-muted-foreground space-y-1.5">
                <div className="font-bold text-foreground">Important Instructions:</div>
                <p>• An SMS confirmation has been dispatched to {patientPhone}.</p>
                <p>• Please arrive 10 minutes before your slot for computerized vitals check.</p>
                <p>• To reschedule or cancel, visit your patient dashboard.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    printAppointmentSlip({
                      appointmentRef:
                        bookingResult?.appointmentRef ||
                        bookingResult?.id?.slice(0, 8).toUpperCase() ||
                        "APT-CONFIRMED",
                      serialNumber: bookingResult?.serialNumber || 1,
                      patientName,
                      patientPhone,
                      patientAge,
                      patientGender,
                      chiefComplaint,
                      chamberName: currentChamber?.name || "Care Chamber",
                      chamberAddress: currentChamber?.address,
                      chamberCity: currentChamber?.city,
                      appointmentDate: selectedDate,
                      startTime: formatSlotDisplay(selectedSlot),
                      serviceName: currentService?.name || "Clinical Consultation",
                      fee:
                        bookingResult?.fee ??
                        (currentService?.fee ?? currentService?.price ?? 0),
                      isPaid: bookingResult?.isPaid || false,
                    })
                  }
                  className="rounded-xl h-12 px-5 text-base font-bold flex items-center justify-center gap-2 border-primary/40 hover:bg-primary/10 text-primary cursor-pointer shadow-xs"
                >
                  <Printer className="h-5 w-5" />
                  <span>Download / Print PDF Receipt</span>
                </Button>
                <Link href="/user/dashboard/appointments" className="flex-1">
                  <Button variant="default" className="w-full rounded-xl h-11 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                    View in Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
