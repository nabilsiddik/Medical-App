"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  getChamberLocations,
  updateLocationSchedules,
  createChamberLocation,
} from "@/services/doctor/clinicServices";
import { IChamberLocation } from "@/types/doctor.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Clock,
  Building,
  Plus,
  Trash2,
  Save,
  Copy,
  Coffee,
  CheckCircle2,
  CalendarCheck,
  ShieldAlert,
  MapPin,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import MedicalSpikeLoader from "@/components/shared/MedicalSpikeLoader";

const DAYS_OF_WEEK = [
  { index: 0, name: "Sunday", short: "Sun" },
  { index: 1, name: "Monday", short: "Mon" },
  { index: 2, name: "Tuesday", short: "Tue" },
  { index: 3, name: "Wednesday", short: "Wed" },
  { index: 4, name: "Thursday", short: "Thu" },
  { index: 5, name: "Friday", short: "Fri" },
  { index: 6, name: "Saturday", short: "Sat" },
];

interface DayScheduleState {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  slotDuration: number;
  breaks: { id: string; title: string; startTime: string; endTime: string }[];
}

export default function DoctorSchedulesPage() {
  const searchParams = useSearchParams();
  const chamberQuery = searchParams.get("chamberId");

  const [chambers, setChambers] = useState<IChamberLocation[]>([]);
  const [selectedChamberId, setSelectedChamberId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Chamber Dialog State
  const [isNewChamberOpen, setIsNewChamberOpen] = useState(false);
  const [newChamberName, setNewChamberName] = useState("");
  const [newChamberAddress, setNewChamberAddress] = useState("");
  const [newChamberCity, setNewChamberCity] = useState("Dhaka");
  const [newChamberPhone, setNewChamberPhone] = useState("");
  const [newChamberSlotDuration, setNewChamberSlotDuration] = useState("15");
  const [creatingChamber, setCreatingChamber] = useState(false);

  // Copy to all confirmation modal state
  const [confirmCopyDayIndex, setConfirmCopyDayIndex] = useState<number | null>(null);

  // Schedules state for the selected chamber
  const [weeklySchedules, setWeeklySchedules] = useState<DayScheduleState[]>([]);

  // Initialize empty weekly schedule
  const buildDefaultWeeklySchedule = (defaultSlotDuration = 15): DayScheduleState[] => {
    return DAYS_OF_WEEK.map((d) => ({
      dayOfWeek: d.index,
      isActive: [0, 1, 2, 3, 4].includes(d.index),
      startTime: "17:00",
      endTime: "21:00",
      slotDuration: defaultSlotDuration,
      breaks: [
        {
          id: `default-break-${d.index}`,
          title: "Evening Prayer & Break",
          startTime: "18:30",
          endTime: "19:00",
        },
      ],
    }));
  };

  // Fetch all chambers
  const loadChambers = async () => {
    setLoading(true);
    try {
      const data = await getChamberLocations();
      setChambers(data);

      if (data.length > 0) {
        const found = chamberQuery ? data.find((c) => c.id === chamberQuery) : null;
        const activeChamber = found || data[0];
        setSelectedChamberId(activeChamber.id);
        applyChamberSchedules(activeChamber);
      } else {
        setWeeklySchedules(buildDefaultWeeklySchedule());
      }
    } catch (err) {
      console.error("Failed to load chambers:", err);
      toast.error("Failed to load chamber locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChambers();
  }, []);

  // When a chamber is selected, populate weekly schedules
  const applyChamberSchedules = (chamber: IChamberLocation) => {
    const defaultDuration = chamber.defaultSlotDurationMinutes || 15;
    const existing = chamber.schedules || [];

    const mapped = DAYS_OF_WEEK.map((day) => {
      const found = existing.find(
        (s: any) =>
          Number(s.dayOfWeek) === day.index ||
          String(s.dayOfWeek).toUpperCase() === day.name.toUpperCase()
      );

      if (found) {
        let parsedBreaks: { id: string; title: string; startTime: string; endTime: string }[] = [];

        if (Array.isArray(found.breaks)) {
          parsedBreaks = found.breaks.map((b: any, idx: number) => ({
            id: `break-${day.index}-${idx}-${Date.now()}`,
            title: b.title || b.label || "Break",
            startTime: b.startTime || "18:00",
            endTime: b.endTime || "18:30",
          }));
        } else if (found.breakStartTime && found.breakEndTime) {
          parsedBreaks = [
            {
              id: `break-${day.index}-legacy`,
              title: "Break",
              startTime: found.breakStartTime,
              endTime: found.breakEndTime,
            },
          ];
        }

        return {
          dayOfWeek: day.index,
          isActive: found.isActive ?? true,
          startTime: found.startTime || "17:00",
          endTime: found.endTime || "21:00",
          slotDuration: found.slotDuration || defaultDuration,
          breaks: parsedBreaks,
        };
      }

      return {
        dayOfWeek: day.index,
        isActive: [0, 1, 2, 3, 4].includes(day.index),
        startTime: "17:00",
        endTime: "21:00",
        slotDuration: defaultDuration,
        breaks: [],
      };
    });

    setWeeklySchedules(mapped);
  };

  const handleSelectChamber = (id: string) => {
    setSelectedChamberId(id);
    const chamber = chambers.find((c) => c.id === id);
    if (chamber) {
      applyChamberSchedules(chamber);
    }
  };

  // Day Schedule Mutators
  const updateDayField = (dayIndex: number, field: keyof DayScheduleState, value: any) => {
    setWeeklySchedules((prev) =>
      prev.map((day) => (day.dayOfWeek === dayIndex ? { ...day, [field]: value } : day))
    );
  };

  // Breaks Management
  const addBreak = (dayIndex: number) => {
    setWeeklySchedules((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayIndex) return day;
        const newBreak = {
          id: `break-${dayIndex}-${Date.now()}`,
          title: "Break",
          startTime: "18:00",
          endTime: "18:30",
        };
        return {
          ...day,
          breaks: [...day.breaks, newBreak],
        };
      })
    );
  };

  const updateBreak = (
    dayIndex: number,
    breakId: string,
    field: "title" | "startTime" | "endTime",
    val: string
  ) => {
    setWeeklySchedules((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayIndex) return day;
        return {
          ...day,
          breaks: day.breaks.map((b) => (b.id === breakId ? { ...b, [field]: val } : b)),
        };
      })
    );
  };

  const removeBreak = (dayIndex: number, breakId: string) => {
    setWeeklySchedules((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek !== dayIndex) return day;
        return {
          ...day,
          breaks: day.breaks.filter((b) => b.id !== breakId),
        };
      })
    );
  };

  // Copy schedule from one day to all other active days
  const copyToAllDays = (sourceDayIndex: number) => {
    const source = weeklySchedules.find((d) => d.dayOfWeek === sourceDayIndex);
    if (!source) return;

    setWeeklySchedules((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek === sourceDayIndex) return day;
        return {
          ...day,
          isActive: true,
          startTime: source.startTime,
          endTime: source.endTime,
          slotDuration: source.slotDuration,
          breaks: source.breaks.map((b) => ({
            ...b,
            id: `break-${day.dayOfWeek}-${Math.random()}`,
          })),
        };
      })
    );
    toast.success(`Copied ${DAYS_OF_WEEK[sourceDayIndex].name}'s schedule and breaks to all days!`);
  };

  // Save schedules to Database
  const handleSaveSchedules = async () => {
    if (!selectedChamberId) {
      toast.error("Please select a chamber location first");
      return;
    }

    setSaving(true);
    try {
      for (const day of weeklySchedules) {
        if (day.isActive) {
          if (!day.startTime || !day.endTime) {
            toast.error(
              `Please specify both start and end time for ${DAYS_OF_WEEK[day.dayOfWeek].name}`
            );
            setSaving(false);
            return;
          }
          for (const b of day.breaks) {
            if (b.startTime >= b.endTime) {
              toast.error(
                `Break "${b.title || "Break"}" on ${DAYS_OF_WEEK[day.dayOfWeek].name} must end after it starts.`
              );
              setSaving(false);
              return;
            }
          }
        }
      }

      const payload = weeklySchedules.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        slotDuration: Number(day.slotDuration) || 15,
        isActive: day.isActive,
        breaks: day.breaks.map((b) => ({
          title: b.title.trim() || "Break",
          startTime: b.startTime,
          endTime: b.endTime,
        })),
      }));

      const res = await updateLocationSchedules(selectedChamberId, payload);

      if (res?.success) {
        toast.success("Doctor schedules and break times updated successfully!");
        await loadChambers();
      } else {
        toast.error(res?.message || "Failed to update schedules");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving schedules to database");
    } finally {
      setSaving(false);
    }
  };

  // Create new chamber
  const handleCreateChamber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChamberName.trim() || !newChamberAddress.trim()) {
      toast.error("Please provide chamber name and address");
      return;
    }

    setCreatingChamber(true);
    try {
      const res = await createChamberLocation({
        name: newChamberName.trim(),
        address: newChamberAddress.trim(),
        city: newChamberCity.trim() || "Dhaka",
        phoneNumber: newChamberPhone.trim() || undefined,
        defaultSlotDurationMinutes: Number(newChamberSlotDuration) || 15,
        isActive: true,
      });

      if (res?.success) {
        toast.success(`Chamber "${newChamberName}" created successfully!`);
        setIsNewChamberOpen(false);
        setNewChamberName("");
        setNewChamberAddress("");
        setNewChamberPhone("");
        await loadChambers();
        if (res.data?.id) {
          setSelectedChamberId(res.data.id);
        }
      } else {
        toast.error(res?.message || "Failed to create chamber");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error creating chamber");
    } finally {
      setCreatingChamber(false);
    }
  };

  const currentChamber = chambers.find((c) => c.id === selectedChamberId);

  // Loading state with medical spike animation
  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center min-h-[55vh]">
        <MedicalSpikeLoader
          text="Loading Doctor Schedules & Chambers"
          subText="Synchronizing consultation hours and multiple break intervals from database..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-7 w-7 text-primary" />
            Doctor Consultation Schedules & Breaks
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Configure your consultation hours and break slots for each day.
            Patients can only book slots during your active hours outside break times.
          </p>
        </div>

        {/* Add Chamber Dialog Trigger */}
        <Button
          onClick={() => setIsNewChamberOpen(true)}
          className="rounded-xl font-bold text-base gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs shrink-0"
        >
          <Plus className="h-5 w-5" />
          Add Chamber Location
        </Button>
      </div>

      {/* Add Chamber Modal Dialog */}
      <Dialog open={isNewChamberOpen} onOpenChange={setIsNewChamberOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              Register New Chamber Location
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Add a hospital, clinic, or private chamber branch to configure its independent weekly schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateChamber} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="font-semibold text-base text-foreground">
                Chamber / Hospital Name *
              </Label>
              <Input
                placeholder="e.g. Popular Diagnostic Center, Dhanmondi"
                required
                value={newChamberName}
                onChange={(e) => setNewChamberName(e.target.value)}
                className="rounded-xl h-11 text-base"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-base text-foreground">
                Detailed Address *
              </Label>
              <Input
                placeholder="e.g. House 16, Road 2, Dhanmondi, Dhaka"
                required
                value={newChamberAddress}
                onChange={(e) => setNewChamberAddress(e.target.value)}
                className="rounded-xl h-11 text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-semibold text-base text-foreground">City</Label>
                <Input
                  value={newChamberCity}
                  onChange={(e) => setNewChamberCity(e.target.value)}
                  className="rounded-xl h-11 text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-semibold text-base text-foreground">
                  Inquiry Phone (Optional)
                </Label>
                <Input
                  placeholder="e.g. +880 1700-112233"
                  value={newChamberPhone}
                  onChange={(e) => setNewChamberPhone(e.target.value)}
                  className="rounded-xl h-11 text-base"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-base text-foreground">
                Default Slot Duration
              </Label>
              <select
                value={newChamberSlotDuration}
                onChange={(e) => setNewChamberSlotDuration(e.target.value)}
                className="w-full rounded-xl border border-input bg-background h-11 px-3 text-base text-foreground font-semibold"
              >
                <option value="10">10 Minutes per patient</option>
                <option value="15">15 Minutes per patient (Standard)</option>
                <option value="20">20 Minutes per patient</option>
                <option value="30">30 Minutes per patient</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewChamberOpen(false)}
                className="rounded-xl text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingChamber}
                className="rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {creatingChamber ? "Creating..." : "Save Chamber"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Copy to All Days */}
      <Dialog
        open={confirmCopyDayIndex !== null}
        onOpenChange={(open) => !open && setConfirmCopyDayIndex(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Copy className="h-6 w-6 text-primary" />
              Copy Schedule to All Days?
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Are you sure you want to copy{" "}
              <strong className="text-foreground">
                {confirmCopyDayIndex !== null ? DAYS_OF_WEEK[confirmCopyDayIndex]?.name : ""}'s
              </strong>{" "}
              consultation hours, slot duration, and break times to all 7 days of the week?
              <br />
              <span className="text-amber-600 dark:text-amber-400 font-semibold mt-2.5 block">
                This will overwrite existing hours on all other days and cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmCopyDayIndex(null)}
              className="rounded-xl text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (confirmCopyDayIndex !== null) {
                  copyToAllDays(confirmCopyDayIndex);
                  setConfirmCopyDayIndex(null);
                }
              }}
              className="rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-xs"
            >
              <Copy className="h-4 w-4" />
              Yes, Apply to All Days
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chamber Selector Tabs */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="font-bold text-base text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Select Chamber Location to Configure
              </Label>
              <p className="text-base text-muted-foreground">
                Each chamber maintains its independent weekly consultation hours and break intervals.
              </p>
            </div>

            {chambers.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {chambers.map((chamber) => (
                  <button
                    key={chamber.id}
                    type="button"
                    onClick={() => handleSelectChamber(chamber.id)}
                    className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-all border flex items-center gap-2 ${
                      selectedChamberId === chamber.id
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border/80"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{chamber.name}</span>
                    {selectedChamberId === chamber.id && (
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <Badge variant="destructive" className="text-base">
                No chambers registered yet
              </Badge>
            )}
          </div>

          {currentChamber && (
            <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-base text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {currentChamber.address}, {currentChamber.city}
              </span>
              <span className="font-mono text-foreground font-semibold">
                Default Slot: {currentChamber.defaultSlotDurationMinutes || 15} mins
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day-by-Day Schedule Form */}
      <div className="space-y-5">
        {weeklySchedules.map((day) => {
          const dayInfo = DAYS_OF_WEEK.find((d) => d.index === day.dayOfWeek)!;

          return (
            <Card
              key={day.dayOfWeek}
              className={`rounded-2xl transition-all border ${
                day.isActive
                  ? "border-primary/40 bg-card shadow-xs"
                  : "border-border/60 bg-muted/20 opacity-80"
              }`}
            >
              <CardContent className="p-5 sm:p-6 space-y-5">
                {/* Day Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-base ${
                        day.isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dayInfo.short}
                    </span>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{dayInfo.name}</h3>
                      <p className="text-base text-muted-foreground">
                        {day.isActive ? "Consultation active" : "Doctor chamber closed on this day"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => updateDayField(day.dayOfWeek, "isActive", !day.isActive)}
                      className={`px-4 py-2 rounded-full font-semibold text-base transition-colors flex items-center gap-2 ${
                        day.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          day.isActive ? "bg-emerald-600 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                      {day.isActive ? "Active / Open" : "Day Off / Closed"}
                    </button>

                    {day.isActive && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmCopyDayIndex(day.dayOfWeek)}
                        title="Copy this day's timing and breaks to all other days"
                        className="rounded-xl text-base gap-1.5 text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy to all</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Day Active Config Body */}
                {day.isActive ? (
                  <div className="space-y-5 pt-1">
                    {/* Timing and Slots Row: 3 clean columns (Consultation Starts, Consultation Ends, Slot Duration) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {/* Start Time */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-base text-foreground flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          Consultation Starts *
                        </Label>
                        <Input
                          type="time"
                          required
                          value={day.startTime}
                          onChange={(e) =>
                            updateDayField(day.dayOfWeek, "startTime", e.target.value)
                          }
                          className="rounded-xl h-11 font-mono text-base font-semibold"
                        />
                      </div>

                      {/* End Time */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-base text-foreground flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-primary" />
                          Consultation Ends *
                        </Label>
                        <Input
                          type="time"
                          required
                          value={day.endTime}
                          onChange={(e) => updateDayField(day.dayOfWeek, "endTime", e.target.value)}
                          className="rounded-xl h-11 font-mono text-base font-semibold"
                        />
                      </div>

                      {/* Slot Duration */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-base text-foreground">
                          Slot Duration
                        </Label>
                        <select
                          value={day.slotDuration}
                          onChange={(e) =>
                            updateDayField(day.dayOfWeek, "slotDuration", Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-input bg-background h-11 px-3 text-base text-foreground font-semibold"
                        >
                          <option value="10">10 mins per slot</option>
                          <option value="15">15 mins per slot</option>
                          <option value="20">20 mins per slot</option>
                          <option value="30">30 mins per slot</option>
                          <option value="45">45 mins per slot</option>
                          <option value="60">60 mins per slot</option>
                        </select>
                      </div>
                    </div>

                    {/* Multiple Breaks Section - Fully Responsive & Clean */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Coffee className="h-5 w-5 text-amber-500" />
                          <h4 className="font-bold text-base text-foreground">
                            Doctor Breaks ({day.breaks.length})
                          </h4>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addBreak(day.dayOfWeek)}
                          className="rounded-xl text-base font-semibold gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 self-start sm:self-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Add Break Time
                        </Button>
                      </div>

                      {day.breaks.length === 0 ? (
                        <p className="text-base text-muted-foreground italic py-1">
                          No break times added. Patients can book all consecutive slots between{" "}
                          <span className="font-semibold text-foreground">{day.startTime}</span> and{" "}
                          <span className="font-semibold text-foreground">{day.endTime}</span>.
                        </p>
                      ) : (
                        <div className="space-y-3 pt-1">
                          {day.breaks.map((b, bIdx) => (
                            <div
                              key={b.id || bIdx}
                              className="p-3.5 rounded-xl bg-card border border-border/80 flex flex-col md:flex-row items-stretch md:items-center gap-3.5 shadow-xs"
                            >
                              {/* Break Title */}
                              <div className="w-full md:w-56 lg:w-64 shrink-0">
                                <Input
                                  placeholder="Break title (e.g. Lunch, Prayer)"
                                  value={b.title}
                                  onChange={(e) =>
                                    updateBreak(day.dayOfWeek, b.id, "title", e.target.value)
                                  }
                                  className="rounded-xl h-11 text-base font-medium"
                                />
                              </div>

                              {/* Responsive Time Fields Container */}
                              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* From Time */}
                                <div className="flex items-center gap-2 flex-1 min-w-[145px]">
                                  <span className="text-base font-medium text-muted-foreground shrink-0">
                                    From:
                                  </span>
                                  <Input
                                    type="time"
                                    value={b.startTime}
                                    onChange={(e) =>
                                      updateBreak(day.dayOfWeek, b.id, "startTime", e.target.value)
                                    }
                                    className="rounded-xl h-11 w-full min-w-[130px] font-mono text-base font-semibold"
                                  />
                                </div>

                                {/* To Time */}
                                <div className="flex items-center gap-2 flex-1 min-w-[145px]">
                                  <span className="text-base font-medium text-muted-foreground shrink-0">
                                    To:
                                  </span>
                                  <Input
                                    type="time"
                                    value={b.endTime}
                                    onChange={(e) =>
                                      updateBreak(day.dayOfWeek, b.id, "endTime", e.target.value)
                                    }
                                    className="rounded-xl h-11 w-full min-w-[130px] font-mono text-base font-semibold"
                                  />
                                </div>

                                {/* Remove Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeBreak(day.dayOfWeek, b.id)}
                                  className="rounded-xl text-destructive hover:bg-destructive/10 p-2 h-11 w-11 shrink-0 self-end sm:self-center"
                                  title="Remove this break"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-base text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                    Doctor will not be taking consultations on {dayInfo.name} at this chamber.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-20">
        <div className="p-4 sm:p-5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-base text-foreground">
                Ready to publish weekly schedule for{" "}
                <span className="text-primary font-bold">
                  {currentChamber?.name || "Selected Chamber"}
                </span>
                ?
              </p>
              <p className="text-base text-muted-foreground">
                All patient booking slots and break blackouts will immediately take effect.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={loadChambers}
              disabled={saving}
              className="rounded-xl text-base font-semibold w-full sm:w-auto h-11 px-5"
            >
              Reset Changes
            </Button>
            <Button
              type="button"
              onClick={handleSaveSchedules}
              disabled={saving || !selectedChamberId}
              className="rounded-xl text-base font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-11 px-6 shadow-xs"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving to Database..." : "Save Chamber Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
