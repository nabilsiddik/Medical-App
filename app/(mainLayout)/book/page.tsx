"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getChamberLocations, getServices } from "@/services/doctor/clinicServices";
import { getAvailableSlots, bookAppointment } from "@/services/doctor/appointmentServices";
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
  FileText,
  AlertCircle,
  Building,
  Sparkles,
} from "lucide-react";

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
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientGender, setPatientGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");

  // Slots State
  const [slots, setSlots] = useState<{ startTime: string; endTime: string; isBooked: boolean; isAvailable?: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Booking Result State
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Load chambers and services on mount
  useEffect(() => {
    Promise.all([getChamberLocations(), getServices()])
      .then(([chamberData, serviceData]) => {
        setChambers(chamberData);
        if (chamberData.length > 0 && !selectedChamberId) {
          setSelectedChamberId(chamberData[0].id);
        }

        setServices(serviceData);
        if (serviceData.length > 0 && !selectedServiceId) {
          setSelectedServiceId(serviceData[0].id);
        }
      })
      .finally(() => setLoadingChambers(false));

    // Default date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Fetch slots whenever chamber or date changes
  useEffect(() => {
    if (selectedChamberId && selectedDate) {
      setLoadingSlots(true);
      getAvailableSlots(selectedChamberId, selectedDate, selectedServiceId)
        .then((data) => {
          setSlots(data);
          if (data.length > 0) {
            const firstOpen = data.find((s: any) => !s.isBooked && (s.isAvailable ?? true));
            if (firstOpen) setSelectedSlot(firstOpen.startTime);
          }
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedChamberId, selectedDate, selectedServiceId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error("Please enter patient name");
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 10) {
      toast.error("Please enter a valid contact phone number");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select an available time slot");
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
        toast.error(res.message || "Failed to book appointment. Please try another slot.");
      }
    } catch {
      toast.error("An error occurred during booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentChamber = chambers.find((c) => c.id === selectedChamberId);
  const currentService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="min-h-screen py-10 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Chamber & Service" },
              { num: 2, label: "Date & Slot" },
              { num: 3, label: "Patient Details" },
              { num: 4, label: "Confirmation" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    step >= s.num
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground mt-1.5 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10" />
            <div
              className="h-0.5 bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Chamber & Service */}
        {step === 1 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Select Chamber Location & Appointment Type</CardTitle>
              <CardDescription>
                Choose the clinical chamber location and the type of consultation you require.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chamber selection */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Chamber Location
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {chambers.map((chamber) => {
                    const isSelected = selectedChamberId === chamber.id;
                    return (
                      <div
                        key={chamber.id}
                        onClick={() => setSelectedChamberId(chamber.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-bold text-foreground">{chamber.name}</div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          {chamber.address}, {chamber.city}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-3 pt-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Appointment Type & Pricing
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.length > 0 ? (
                    services.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      const price = (s.fee ?? s.price) ?? 0;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5 font-semibold text-primary"
                              : "border-border bg-card hover:bg-muted/50"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-foreground">{s.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {s.durationMinutes} minutes
                            </div>
                          </div>
                          <div className="font-bold text-primary font-mono text-sm">
                            {price === 0 ? "FREE (৳0)" : `৳ ${price.toLocaleString()}`}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-xs text-muted-foreground py-2">
                      Loading clinic services...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedChamberId}
                  className="rounded-xl px-6"
                >
                  Continue to Schedule <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Date & Available Time Slot */}
        {step === 2 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Pick Date & Time Slot</CardTitle>
              <CardDescription>
                {currentChamber?.name} • Select a date and consultation slot. Doctor breaks and booked slots are automatically excluded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Input */}
              <div className="space-y-2">
                <Label htmlFor="appDate" className="text-xs font-semibold">
                  Consultation Date
                </Label>
                <Input
                  id="appDate"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Available Chamber Slots</Label>
                  <span className="text-xs text-muted-foreground">
                    {slots.filter((s) => !s.isBooked && (s.isAvailable ?? true)).length} slots open
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                    Loading live chamber slots...
                  </div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {slots.map((slot) => {
                      const isAvailable = !slot.isBooked && (slot.isAvailable ?? true);
                      const isSelected = selectedSlot === slot.startTime;

                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSlot(slot.startTime)}
                          className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border text-center transition-all ${
                            !isAvailable
                              ? "bg-muted text-muted-foreground/50 border-border cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                    No consultation schedule found for this date. The doctor may be off or at another chamber on this day. Please try another day.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="rounded-xl px-6"
                >
                  Enter Patient Details <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Patient Information Form */}
        {step === 3 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Patient Information</CardTitle>
              <CardDescription>
                Provide the patient details for computerized registration and SMS token generation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pName" className="text-xs font-semibold">
                    Full Patient Name *
                  </Label>
                  <Input
                    id="pName"
                    placeholder="e.g. Rahim Ahmed"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pPhone" className="text-xs font-semibold">
                      Mobile / WhatsApp Phone *
                    </Label>
                    <Input
                      id="pPhone"
                      placeholder="e.g. 01811223344"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      required
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="pAge" className="text-xs font-semibold">
                        Age (Years)
                      </Label>
                      <Input
                        id="pAge"
                        type="number"
                        placeholder="e.g. 42"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="rounded-xl h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Gender</Label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-card text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pComplaints" className="text-xs font-semibold">
                    Chief Complaint / Primary Symptoms
                  </Label>
                  <Input
                    id="pComplaints"
                    placeholder="e.g. Fever for 3 days, body ache, dry cough"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>

                {/* Summary Pill */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
                  <div className="font-semibold text-primary">Booking Summary:</div>
                  <div className="text-muted-foreground">
                    {currentChamber?.name} • {selectedDate} at {selectedSlot}
                  </div>
                  <div className="text-muted-foreground font-mono">
                    Service: {currentService?.name || "Consultation"} • Fee:{" "}
                    {(currentService?.fee ?? currentService?.price) === 0
                      ? "FREE (৳0)"
                      : `৳${(currentService?.fee ?? currentService?.price)?.toLocaleString()}`}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl px-6 font-semibold"
                  >
                    {submitting ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Confirmation Screen */}
        {step === 4 && (
          <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 shadow-md">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-300">
                Appointment Confirmed!
              </CardTitle>
              <CardDescription>
                Your serial token has been reserved in the chamber queue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 max-w-md mx-auto">
              {/* Token Card */}
              <div className="p-6 rounded-2xl bg-card border border-border text-center shadow-xs space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  Queue Serial Token
                </span>
                <div className="text-4xl font-black text-primary">
                  Token #{bookingResult?.serialNumber || 1}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  Ref: {bookingResult?.appointmentRef || bookingResult?.id?.slice(0, 8).toUpperCase() || "APT-CONFIRMED"}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold text-foreground">{patientName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Chamber:</span>
                  <span className="font-semibold text-foreground">{currentChamber?.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-semibold text-foreground">
                    {selectedDate} at {selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-bold font-mono text-foreground">
                    {(bookingResult?.fee ?? (currentService?.fee ?? currentService?.price)) === 0
                      ? "FREE (৳0)"
                      : `৳${(bookingResult?.fee ?? (currentService?.fee ?? currentService?.price))?.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground space-y-1">
                <div className="font-semibold text-foreground">Next Steps:</div>
                <p>• An SMS confirmation has been dispatched to {patientPhone}.</p>
                <p>• Please arrive 10 minutes before your slot to complete vitals recording.</p>
                <p>• Cancellation policy: Patient cancellations are non-refundable.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/user/dashboard/appointments" className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    View in Dashboard
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="default" className="w-full rounded-xl">
                    Back to Home
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
