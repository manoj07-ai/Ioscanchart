"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface TourStep {
  title: string;
  description: string;
  target?: string;
}

const STEPS: TourStep[] = [
  {
    title: "1. Drop your chart",
    description: "Drag and drop, click to select, or paste directly with Ctrl+V. Up to 3 timeframes supported.",
  },
  {
    title: "2. Fine-tune market (optional)",
    description: "We auto-detect markets, but you can select Indian indices/options, Forex, or Crypto manually.",
  },
  {
    title: "3. Start analysis",
    description: "Get structured support/resistance levels, scenarios, entry, stop, and R:R targets with technical reasoning.",
  },
];

export function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem("ioscan_tour_seen")) {
        setIsOpen(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const dismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("ioscan_tour_seen", "true");
    } catch {
      // Ignore
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismiss();
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  return (
    <div className="mb-6 rounded-lg border border-[var(--candle)]/40 bg-[var(--bg-1)] p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--candle)]/20 text-[11px] font-bold text-[var(--candle)]">
              {currentStep + 1}
            </span>
            <h3 className="text-sm font-semibold text-[var(--text-0)]">
              {step.title}
            </h3>
            <span className="text-[11px] text-[var(--text-2)]">
              ({currentStep + 1} of {STEPS.length})
            </span>
          </div>
          <p className="text-xs text-[var(--text-1)] pl-7">
            {step.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={dismiss}
            className="text-xs text-[var(--text-2)] hover:text-[var(--text-1)] px-2 py-1"
          >
            Skip tour
          </button>
          <Button
            size="sm"
            variant="primary-gradient"
            onClick={nextStep}
            className="text-xs h-7 px-3"
          >
            {currentStep === STEPS.length - 1 ? "Got it" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
