"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/config/plans";
import { EarlyAccessDialog } from "./EarlyAccessDialog";
import { UpgradeComparison } from "./UpgradeComparison";
import { track } from "@/lib/analytics/track";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparklesIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "NO_CREDITS" | "DAILY_CAP";
}

export function UpgradeDialog({
  open,
  onOpenChange,
  reason = "NO_CREDITS",
}: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("monthly");
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (open) {
      track("paywall_viewed", { source: "upgrade_dialog", reason });
    }
  }, [open, reason]);

  async function handleCheckout(planId: "monthly" | "lifetime") {
    setSelectedPlan(planId);
    setCheckoutLoading(true);
    track("upgrade_clicked", { planId, source: "upgrade_dialog" });

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      // 501 expected during stub phase
      if (res.status === 501 || !res.ok) {
        onOpenChange(false);
        setEarlyAccessOpen(true);
      }
    } catch {
      onOpenChange(false);
      setEarlyAccessOpen(true);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const monthly = PLANS.monthly;
  const lifetime = PLANS.lifetime;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl bg-[var(--bg-1)] border-[var(--line)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
                {reason === "DAILY_CAP" ? "Daily Limit Reached" : "Analysis Credits Exhausted"}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-2)] bg-[var(--bg-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                Prices shown in USD
              </span>
            </div>

            <DialogTitle className="text-xl md:text-2xl font-bold text-[var(--text-0)]">
              {reason === "DAILY_CAP"
                ? "You've hit today's analysis limit"
                : "Upgrade for unlimited chart breakdowns"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-2)] leading-relaxed">
              {reason === "DAILY_CAP"
                ? "To ensure low latency for all traders, analyses are subject to a daily fair-use cap. Your quota resets at 00:00 UTC."
                : "Your demo plan provided 1 complimentary chart reading. Upgrade to unlock continuous multi-timeframe analysis, options structure, and all 8 market packs."}
            </DialogDescription>
          </DialogHeader>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            {/* Monthly Card */}
            <div className="relative rounded-2xl border-2 border-[var(--candle)]/40 bg-[var(--bg-2)]/50 p-5 flex flex-col justify-between hover:border-[var(--candle)] transition-colors shadow-lg shadow-black/20">
              <div className="absolute -top-3 right-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--candle)] text-[#04120A] flex items-center gap-1">
                  <SparklesIcon className="w-3 h-3" /> POPULAR
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-0)]">{monthly.name}</div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-[var(--text-0)] font-mono">${monthly.price}</span>
                    <span className="text-xs text-[var(--text-2)] font-mono">/ month</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-2)] mt-1">
                    Cancel anytime from settings. No lock-in. <span className="opacity-60">[Subject to terms]</span>
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                  {monthly.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-1)]">
                      <CheckIcon className="w-4 h-4 text-[var(--candle)] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="primary-gradient"
                  className="w-full text-xs font-semibold"
                  disabled={checkoutLoading}
                  onClick={() => handleCheckout("monthly")}
                >
                  Upgrade to Monthly
                </Button>
              </div>
            </div>

            {/* Lifetime Card */}
            <div className="relative rounded-2xl border border-[var(--line)] bg-[var(--bg-2)]/30 p-5 flex flex-col justify-between hover:border-purple-500/50 transition-colors">
              <div className="absolute -top-3 right-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                  <ShieldCheckIcon className="w-3 h-3" /> BEST VALUE
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-0)]">{lifetime.name}</div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-[var(--text-0)] font-mono">${lifetime.price}</span>
                    <span className="text-xs text-[var(--text-2)] font-mono">one-time payment</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-2)] mt-1">
                    Pay once, access forever. All future market packs included.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                  {lifetime.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-1)]">
                      <CheckIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="secondary"
                  className="w-full text-xs font-semibold hover:border-purple-500/60"
                  disabled={checkoutLoading}
                  onClick={() => handleCheckout("lifetime")}
                >
                  Get Lifetime Access
                </Button>
              </div>
            </div>
          </div>

          {/* Toggle Comparison Table */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-mono text-[var(--candle)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showComparison ? "Hide capability comparison ▲" : "Show Demo vs. Paid capability comparison ▼"}
            </button>

            {showComparison && (
              <div className="mt-4 pt-4 border-t border-[var(--line)]">
                <UpgradeComparison />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Early Access Waitlist Modal (triggered on 501) */}
      <EarlyAccessDialog
        open={earlyAccessOpen}
        onOpenChange={setEarlyAccessOpen}
        selectedPlan={selectedPlan}
      />
    </>
  );
}
