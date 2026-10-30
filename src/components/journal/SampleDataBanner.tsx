"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SampleDataBannerProps {
  onClear: () => void;
}

export function SampleDataBanner({ onClear }: SampleDataBannerProps) {
  return (
    <div className="rounded-xl border border-[var(--amber)]/40 bg-[var(--amber)]/10 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[var(--amber)] shrink-0" />
        <div>
          <span className="font-bold text-[var(--amber)] block">
            Preview Mode: Sample Data Active
          </span>
          <span className="text-[var(--text-1)] text-[11px]">
            These sample trades are for demonstration only. They are not persisted to your account and do not affect real statistics.
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onClear}
        className="shrink-0 text-xs h-8 px-3 border-[var(--amber)]/40 hover:bg-[var(--amber)]/20 flex items-center gap-1.5"
      >
        <span>Clear Sample Data</span>
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
