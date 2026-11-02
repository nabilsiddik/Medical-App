"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Users, Clock, ArrowRight, RefreshCw, Volume2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QueueItem {
  id: string;
  serialNumber: number;
  patient: {
    name: string;
    gender?: string;
  };
  status: "WAITING" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED";
  type: string;
  startTime?: string;
  chamberName?: string;
}

export default function ChamberQueuePublicPage() {
  const [nowServing, setNowServing] = useState<QueueItem | null>(null);
  const [waitingList, setWaitingList] = useState<QueueItem[]>([]);
  const [chambers, setChambers] = useState<{ id: string; name: string }[]>([]);
  const [selectedChamberId, setSelectedChamberId] = useState<string>("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mask patient name for HIPAA/privacy compliance: "Sarah Jenkins" -> "Sarah J***"
  const maskName = (fullName: string) => {
    if (!fullName) return "Patient";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].slice(0, 3) + "***";
    }
    const first = parts[0];
    const lastInitial = parts[parts.length - 1][0];
    return `${first} ${lastInitial}***`;
  };

  const fetchQueue = useCallback(async (chamberId?: string) => {
    try {
      const q = chamberId ? `?chamberId=${chamberId}` : "";
      const res = await fetch(`/api/proxy/appointments/queue/live${q}`, { cache: "no-store" });
      if (!res.ok) {
        // Fallback demo queue display if backend proxy is unconfigured
        return;
      }
      const data = await res.json();
      if (data?.data) {
        setNowServing(data.data.nowServing || null);
        setWaitingList(data.data.waiting || []);
        if (data.data.chambers && data.data.chambers.length > 0) {
          setChambers(data.data.chambers);
        }
      }
      setLastRefreshed(new Date());
    } catch {
      // Offline fallback silent
    }
  }, []);

  useEffect(() => {
    fetchQueue(selectedChamberId);
    const interval = setInterval(() => {
      fetchQueue(selectedChamberId);
    }, 10000); // Poll every 10 seconds for real-time live display

    return () => clearInterval(interval);
  }, [fetchQueue, selectedChamberId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Chamber Live Queue Display
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-400">
              Auto-updating every 10s • Last updated: {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Chamber Selector & Fullscreen CTA */}
        <div className="flex items-center gap-3">
          {chambers.length > 1 && (
            <select
              value={selectedChamberId}
              onChange={(e) => setSelectedChamberId(e.target.value)}
              className="h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Chambers</option>
              {chambers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="outline"
            onClick={() => fetchQueue(selectedChamberId)}
            className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 h-11 px-4 text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={toggleFullscreen}
            className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 h-11 px-4 text-sm font-semibold"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" />
            TV Fullscreen
          </Button>
        </div>
      </div>

      {/* Main Queue Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
        
        {/* BIG NOW SERVING CARD */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-primary/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
            
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-base font-bold uppercase tracking-wider">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              Now In Doctor's Consultation Room
            </div>

            <div className="space-y-2">
              <span className="text-base sm:text-lg font-semibold text-slate-400 uppercase tracking-widest">
                Current Token Number
              </span>
              <div className="text-7xl sm:text-8xl md:text-9xl font-black text-primary tracking-tight font-mono drop-shadow-md">
                {nowServing ? `#${nowServing.serialNumber}` : "--"}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {nowServing ? maskName(nowServing.patient.name) : "No Patient Currently Consulting"}
              </div>
              <p className="text-base text-slate-400 mt-2">
                {nowServing
                  ? `Estimated time remaining: 10-15 mins`
                  : "Please wait for receptionist to call next token"}
              </p>
            </div>
          </div>
        </div>

        {/* UP NEXT WAITING LIST */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col flex-1 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-white">Up Next in Queue</h2>
              </div>
              <Badge variant="outline" className="border-slate-700 text-slate-300 text-sm px-3 py-1">
                {waitingList.length} Waiting
              </Badge>
            </div>

            {waitingList.length > 0 ? (
              <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
                {waitingList.slice(0, 8).map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      idx === 0
                        ? "bg-primary/10 border-primary/40 shadow-xs"
                        : "bg-slate-950/70 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-800 text-white font-mono font-black text-base flex items-center justify-center">
                        #{item.serialNumber}
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">
                          {maskName(item.patient.name)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {item.type === "VIDEO_CALL" ? "Telemedicine" : "In-Person"} • Slot {item.startTime}
                        </div>
                      </div>
                    </div>

                    <div>
                      {idx === 0 ? (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm font-semibold px-3 py-1">
                          Prepare Next
                        </Badge>
                      ) : (
                        <span className="text-sm text-slate-500 font-mono">
                          Pos #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Users className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-base">No other patients currently waiting.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Info & Instructions */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
        <div>
          📢 <span className="text-slate-300 font-medium">Patient Notice:</span> When your token is called, please proceed to Consultation Room 1 with previous prescriptions & investigation reports.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/book" className="text-primary hover:underline font-semibold flex items-center gap-1">
            Need an appointment? Book online <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white">
            Practice Home
          </Link>
        </div>
      </div>
    </div>
  );
}
