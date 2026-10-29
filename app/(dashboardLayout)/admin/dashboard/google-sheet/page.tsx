"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Bot,
  ExternalLink,
  Sparkles,
  Database,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/shared/buttons/Button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getGoogleSheetStatus,
  syncGoogleSheetKnowledgeBase,
  toggleAiChatStatus,
} from "@/services/doctor/chatServices";
import { IGoogleSheetStatus } from "@/types/doctor.interface";

export default function GoogleSheetKnowledgeBasePage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [status, setStatus] = useState<IGoogleSheetStatus>({
    isConnected: false,
    aiChatEnabled: true,
    totalEntries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await getGoogleSheetStatus();
      setStatus(data);
      if (data.sheetUrl) {
        setSheetUrl(data.sheetUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetUrl.trim()) {
      toast.error("Please enter a valid Google Sheet URL");
      return;
    }

    setSyncing(true);
    try {
      const res = await syncGoogleSheetKnowledgeBase(sheetUrl);
      if (res.success) {
        toast.success(res.message || "Google Sheet synced successfully!");
        fetchStatus();
      } else {
        toast.error(res.message || "Failed to sync Google Sheet.");
      }
    } catch {
      toast.error("Failed to sync Google Sheet.");
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleAi = async () => {
    setToggling(true);
    const nextState = !status.aiChatEnabled;
    try {
      const res = await toggleAiChatStatus(nextState);
      if (res.success) {
        setStatus((prev) => ({ ...prev, aiChatEnabled: nextState }));
        toast.success(
          nextState
            ? "AI Assistant auto-reply enabled."
            : "AI Assistant auto-reply paused (Manual Doctor reply only)."
        );
      }
    } catch {
      toast.error("Failed to update AI status.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
            <span>Google Sheet AI Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect your clinical Google Sheet containing services, pricing, chamber hours, and FAQ to power intelligent AI patient support.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={fetchStatus}
          className="rounded-xl text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh Status
        </Button>
      </div>

      {/* Status & Control KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Connection Status */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sheet Connection
              </span>
              <div className="text-xl font-bold text-foreground flex items-center gap-2 pt-1">
                {status.isConnected ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Not Connected</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                {status.lastSyncAt
                  ? `Last synced: ${new Date(status.lastSyncAt).toLocaleString()}`
                  : "Sync required to train AI"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Knowledge Base Entries */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Knowledge Base Entries
              </span>
              <div className="text-2xl font-black text-foreground pt-1">
                {status.totalEntries}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Services, pricing, chamber hours & medical FAQ
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* AI Auto-Reply Switch */}
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Auto-Response
              </span>
              <div>
                <Badge
                  variant={status.aiChatEnabled ? "default" : "secondary"}
                  className="text-xs font-semibold px-2.5 py-0.5"
                >
                  {status.aiChatEnabled ? "⚡ Active (Auto-Replies)" : "⏸️ Paused (Manual Only)"}
                </Badge>
              </div>
              <button
                type="button"
                onClick={handleToggleAi}
                disabled={toggling}
                className="text-xs text-primary font-semibold hover:underline block pt-1 cursor-pointer"
              >
                {status.aiChatEnabled ? "Pause AI Assistant" : "Activate AI Assistant"}
              </button>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Form */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Connect & Synchronize Google Spreadsheet</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Paste your Google Sheet URL (must be set to "Anyone with the link can view"). The system extracts your services, fees, chamber timings, and custom answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSync} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FileSpreadsheet className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="pl-10 rounded-xl h-11 text-xs"
                  required
                />
              </div>
              <Button
                type="submit"
                isLoading={syncing}
                loadingText="Synchronizing..."
                className="rounded-xl h-11 px-6 font-semibold shrink-0"
              >
                Sync Knowledge Base
              </Button>
            </div>

            {sheetUrl && (
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span>Direct Document Link:</span>
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  Open in Google Sheets <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Format Guidelines Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">
            Recommended Google Sheet Column Structure
          </CardTitle>
          <CardDescription className="text-xs">
            To achieve the highest AI answer precision, structure your Google Sheet headers like this:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border/70 font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Service / Topic</th>
                  <th className="py-2.5 px-3">Price (BDT)</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Chamber Location</th>
                  <th className="py-2.5 px-3">Timings</th>
                  <th className="py-2.5 px-3">Clinical Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium">New Patient Consultation</td>
                  <td className="py-2.5 px-3">1000</td>
                  <td className="py-2.5 px-3">15 mins</td>
                  <td className="py-2.5 px-3">Dhanmondi Care Chamber</td>
                  <td className="py-2.5 px-3">Sun-Thu 5 PM - 9 PM</td>
                  <td className="py-2.5 px-3 font-sans">Full clinical exam by Prof. Dr. Sarah</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium">Free Report Review</td>
                  <td className="py-2.5 px-3">0 (FREE)</td>
                  <td className="py-2.5 px-3">10 mins</td>
                  <td className="py-2.5 px-3">All Chambers</td>
                  <td className="py-2.5 px-3">Consultation hours</td>
                  <td className="py-2.5 px-3 font-sans">Free of charge within 14 days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-medium">Online Video Call</td>
                  <td className="py-2.5 px-3">800</td>
                  <td className="py-2.5 px-3">20 mins</td>
                  <td className="py-2.5 px-3">Telemedicine / Virtual</td>
                  <td className="py-2.5 px-3">Slot based</td>
                  <td className="py-2.5 px-3 font-sans">HD Video consultation link provided</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

