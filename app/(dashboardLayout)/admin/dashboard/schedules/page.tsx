"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  getChamberLocations,
  updateLocationSchedules,
  createChamberLocation,
} from "@/services/doctor/clinicServices";
import { IChamberLocation, IScheduleBreak } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  AlertCircle,
  CalendarCheck,
  ShieldAlert,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  maxPatients: number | "";
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

  // Schedules state for the selected chamber
  const [weeklySchedules, setWeeklySchedules] = useState<DayScheduleState[]>([]);

  // Initialize empty weekly schedule
  const buildDefaultWeeklySchedule = (defaultSlotDuration = 15): DayScheduleState[] => {
    return DAYS_OF_WEEK.map((d) => ({
      dayOfWeek: d.index,
      // Default Monday-Thursday active, others closed by default until configured
      isActive: [0, 1, 2, 3, 4].includes(d.index),
      startTime: "17:00",
      endTime: "21:00",
      slotDuration: defaultSlotDuration,
      maxPatients: 30,
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
        // Select chamber from URL query or default to first
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
      // Find matching schedule in database for this day of week
      const found = existing.find(
        (s: any) =>
          Number(s.dayOfWeek) === day.index ||
          String(s.dayOfWeek).toUpperCase() === day.name.toUpperCase()
      );

      if (found) {
        // Parse breaks (JSON array or legacy fields)
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
          maxPatients: found.maxPatients || 30,
          breaks: parsedBreaks,
        };
      }

      // Default day schedule if none exists yet
      return {
        dayOfWeek: day.index,
        isActive: [0, 1, 2, 3, 4].includes(day.index),
        startTime: "17:00",
        endTime: "21:00",
        slotDuration: defaultDuration,
        maxPatients: 30,
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
          startTime: "13:00",
          endTime: "14:00",
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
          maxPatients: source.maxPatients,
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
      // Validate times
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

      // Format payload for backend
      const payload = weeklySchedules.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        slotDuration: Number(day.slotDuration) || 15,
        maxPatients: day.maxPatients ? Number(day.maxPatients) : null,
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
        // Refresh chamber locations
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

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Doctor Consultation Schedules & Breaks
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your available consultation hours and multiple break slots for each day.
            Patients will only be able to book during your active hours outside break times.
          </p>
        </div>

        {/* Add Chamber Dialog */}
        <Dialog open={isNewChamberOpen} onOpenChange={setIsNewChamberOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Add New Chamber
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <form onSubmit={handleCreateChamber}>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Create Chamber Location
                </DialogTitle>
                <DialogDescription>
                  Add a hospital wing, private chamber, or clinic location to manage its weekly
                  consultation slots.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label className="font-semibold">Chamber / Branch Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Dhanmondi Central Chamber"
                    value={newChamberName}
                    onChange={(e) => setNewChamberName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold">Address *</Label>
                  <Input
                    required
                    placeholder="e.g. House 45, Road 7/A, Dhanmondi"
                    value={newChamberAddress}
                    onChange={(e) => setNewChamberAddress(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-semibold">City</Label>
                    <Input
                      value={newChamberCity}
                      onChange={(e) => setNewChamberCity(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-semibold">Inquiry Phone</Label>
                    <Input
                      placeholder="+8801700000000"
                      value={newChamberPhone}
                      onChange={(e) => setNewChamberPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold">Default Slot Duration (Minutes)</Label>
                  <select
                    value={newChamberSlotDuration}
                    onChange={(e) => setNewChamberSlotDuration(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground"
                  >
                    <option value="10">10 Minutes per patient</option>
                    <option value="15">15 Minutes per patient (Standard)</option>
                    <option value="20">20 Minutes per patient</option>
                    <option value="30">30 Minutes per patient</option>
                    <option value="45">45 Minutes per patient</option>
                    <option value="60">60 Minutes per patient</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewChamberOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creatingChamber}
                  className="rounded-xl font-semibold gap-2"
                >
                  {creatingChamber ? "Creating..." : "Save Chamber"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chamber Selector Tabs */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="font-bold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Select Chamber Location to Configure
              </Label>
              <p className="text-muted-foreground">
                Each chamber maintains its own independent weekly schedule, consultation hours, and
                break intervals.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                Loading chambers...
              </div>
            ) : chambers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chambers.map((chamber) => (
                  <button
                    key={chamber.id}
                    type="button"
                    onClick={() => handleSelectChamber(chamber.id)}
                    className={`px-4 py-2.5 rounded-xl font-semibold transition-all border flex items-center gap-2 ${
                      selectedChamberId === chamber.id
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border/80"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{chamber.name}</span>
                    {selectedChamberId === chamber.id && (
                      <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <Badge variant="destructive">No chambers registered yet</Badge>
            )}
          </div>

          {currentChamber && (
            <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
              <span className="flex items-center gap-1.5">
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
      <div className="space-y-4">
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
              <CardContent className="p-5 space-y-4">
                {/* Day Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        day.isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dayInfo.short}
                    </span>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{dayInfo.name}</h3>
                      <p className="text-muted-foreground">
                        {day.isActive ? "Consultation active" : "Doctor chamber closed on this day"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => updateDayField(day.dayOfWeek, "isActive", !day.isActive)}
                      className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1.5 ${
                        day.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          day.isActive ? "bg-emerald-600 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                      {day.isActive ? "Active / Open" : "Day Off / Closed"}
                    </button>

                    {day.isActive && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToAllDays(day.dayOfWeek)}
                        title="Copy this day's timing and breaks to all other days"
                        className="rounded-xl gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Copy to all</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Day Active Config Body */}
                {day.isActive ? (
                  <div className="space-y-4 pt-1">
                    {/* Timing and Slots Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Start Time */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          Consultation Starts *
                        </Label>
                        <Input
                          type="time"
                          required
                          value={day.startTime}
                          onChange={(e) =>
                            updateDayField(day.dayOfWeek, "startTime", e.target.value)
                          }
                          className="rounded-xl h-10 font-mono font-semibold"
                        />
                      </div>

                      {/* End Time */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          Consultation Ends *
                        </Label>
                        <Input
                          type="time"
                          required
                          value={day.endTime}
                          onChange={(e) => updateDayField(day.dayOfWeek, "endTime", e.target.value)}
                          className="rounded-xl h-10 font-mono font-semibold"
                        />
                      </div>

                      {/* Slot Duration */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-foreground">Slot Duration</Label>
                        <select
                          value={day.slotDuration}
                          onChange={(e) =>
                            updateDayField(day.dayOfWeek, "slotDuration", Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-input bg-background h-10 px-3 text-foreground font-semibold"
                        >
                          <option value="10">10 mins per slot</option>
                          <option value="15">15 mins per slot</option>
                          <option value="20">20 mins per slot</option>
                          <option value="30">30 mins per slot</option>
                          <option value="45">45 mins per slot</option>
                          <option value="60">60 mins per slot</option>
                        </select>
                      </div>

                      {/* Max Patients */}
                      <div className="space-y-1.5">
                        <Label className="font-semibold text-foreground">Max Patients / Day</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 30"
                          min="1"
                          max="200"
                          value={day.maxPatients}
                          onChange={(e) =>
                            updateDayField(
                              day.dayOfWeek,
                              "maxPatients",
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                          className="rounded-xl h-10 font-mono font-semibold"
                        />
                      </div>
                    </div>

                    {/* Multiple Breaks Section */}
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-amber-500" />
                          <h4 className="font-bold text-foreground">
                            Doctor Breaks ({day.breaks.length})
                          </h4>
                          <span className="text-muted-foreground hidden sm:inline">
                            (Prayer, Lunch, Rest - blocked from patient bookings)
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addBreak(day.dayOfWeek)}
                          className="rounded-xl font-semibold gap-1.5 border-dashed border-primary/50 text-primary hover:bg-primary/10"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Break Time
                        </Button>
                      </div>

                      {day.breaks.length === 0 ? (
                        <p className="text-muted-foreground italic py-1">
                          No break times added. Patients can book all consecutive slots between{" "}
                          <span className="font-semibold text-foreground">{day.startTime}</span> and{" "}
                          <span className="font-semibold text-foreground">{day.endTime}</span>.
                        </p>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {day.breaks.map((b, bIdx) => (
                            <div
                              key={b.id || bIdx}
                              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2.5 rounded-lg bg-card border border-border/70"
                            >
                              <div className="flex-1">
                                <Input
                                  placeholder="Break Title (e.g. Lunch Break, Evening Prayer)"
                                  value={b.title}
                                  onChange={(e) =>
                                    updateBreak(day.dayOfWeek, b.id, "title", e.target.value)
                                  }
                                  className="rounded-lg h-9 font-medium"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">From:</span>
                                  <Input
                                    type="time"
                                    value={b.startTime}
                                    onChange={(e) =>
                                      updateBreak(day.dayOfWeek, b.id, "startTime", e.target.value)
                                    }
                                    className="rounded-lg h-9 w-28 font-mono font-semibold"
                                  />
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">To:</span>
                                  <Input
                                    type="time"
                                    value={b.endTime}
                                    onChange={(e) =>
                                      updateBreak(day.dayOfWeek, b.id, "endTime", e.target.value)
                                    }
                                    className="rounded-lg h-9 w-28 font-mono font-semibold"
                                  />
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBreak(day.dayOfWeek, b.id)}
                                  className="rounded-lg text-destructive hover:bg-destructive/10 p-2 h-9 w-9"
                                  title="Remove this break"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
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
        <div className="p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                Ready to publish weekly schedule for{" "}
                <span className="text-primary font-bold">
                  {currentChamber?.name || "Selected Chamber"}
                </span>
                ?
              </p>
              <p className="text-muted-foreground">
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
              className="rounded-xl font-semibold w-full sm:w-auto"
            >
              Reset Changes
            </Button>
            <Button
              type="button"
              onClick={handleSaveSchedules}
              disabled={saving || !selectedChamberId}
              className="rounded-xl font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-xs"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving to Database..." : "Save Chamber Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

