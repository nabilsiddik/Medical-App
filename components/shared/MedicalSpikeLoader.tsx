"use client";

import React from "react";
import { Activity } from "lucide-react";

interface MedicalSpikeLoaderProps {
  text?: string;
  subText?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function MedicalSpikeLoader({
  text = "Loading Clinical Data...",
  subText = "Synchronizing patient schedule & medical records",
  fullScreen = false,
  className = "",
}: MedicalSpikeLoaderProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 text-center select-none ${className}`}>
      {/* Medical ECG Pulse Wave Graphic */}
      <div className="relative w-64 h-24 flex items-center justify-center">
        {/* Soft background grid lines (Cardiograph ECG Paper style) */}
        <div
          className="absolute inset-0 rounded-xl opacity-15 dark:opacity-25 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px",
          }}
        />

        {/* Ambient pulse glow behind the spike */}
        <div className="absolute w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />

        {/* ECG SVG Waveform */}
        <svg
          viewBox="0 0 300 100"
          className="w-full h-full relative z-10 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle baseline shadow path */}
          <path
            d="M 10 50 L 60 50 L 75 42 L 85 58 L 98 12 L 112 88 L 122 45 L 132 54 L 145 50 L 290 50"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary/20"
          />

          {/* Animated Glowing ECG Spike Path */}
          <path
            d="M 10 50 L 60 50 L 75 42 L 85 58 L 98 12 L 112 88 L 122 45 L 132 54 L 145 50 L 290 50"
            stroke="url(#ecgGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-ecg-trace"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1673b8" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#1673b8" stopOpacity="1" />
              <stop offset="100%" stopColor="#0f5991" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Heartbeat Badge in Center */}
        <div className="absolute -top-1 -right-1 flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 border border-primary/30 text-primary animate-pulse">
          <Activity className="h-4 w-4" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground tracking-wide flex items-center justify-center gap-2">
          <span>{text}</span>
          <span className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
          </span>
        </h3>
        {subText && <p className="text-base text-muted-foreground">{subText}</p>}
      </div>

      {/* Keyframe animation injected inline */}
      <style jsx>{`
        @keyframes ecgTrace {
          0% {
            stroke-dasharray: 60 280;
            stroke-dashoffset: 340;
          }
          100% {
            stroke-dasharray: 60 280;
            stroke-dashoffset: -340;
          }
        }
        .animate-ecg-trace {
          stroke-dasharray: 80 260;
          animation: ecgTrace 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-2xl max-w-sm w-full">
          {content}
        </div>
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{content}</div>;
}

