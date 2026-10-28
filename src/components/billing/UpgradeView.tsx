"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { PLANS } from "@/config/plans";
import { EarlyAccessDialog } from "./EarlyAccessDialog";
import { UpgradeComparison } from "./UpgradeComparison";
import { track } from "@/lib/analytics/track";
import Link from "next/link";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparklesIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

interface UpgradeViewProps {
  currentPlan?: string;
  creditsRemaining?: number;
}

export function UpgradeView({ currentPlan = "demo", creditsRemaining = 0 }: UpgradeViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">("monthly");
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "lifetime" | null>(null);

  useEffect(() => {
    track("paywall_viewed", { source: "upgrade_page", currentPlan });
  }, [currentPlan]);

  async function handlePlanSelect(planId: "monthly" | "lifetime") {
    setSelectedPlan(planId);
    setLoadingPlan(planId);
    track("upgrade_clicked", { planId, source: "upgrade_page" });

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      // 501 expected during stub phase
      if (res.status === 501 || !res.ok) {
        setEarlyAccessOpen(true);
      }
    } catch {
      setEarlyAccessOpen(true);
    } finally {
      setLoadingPlan(null);
    }
  }

  const monthly = PLANS.monthly;
  const lifetime = PLANS.lifetime;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Top Bar Navigation & Context */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-2)] hover:text-[var(--candle)] transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Workspace
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-2)]">Current Plan:</span>
          <Badge variant={currentPlan === "demo" ? "neutral" : "bull"}>
            {currentPlan.toUpperCase()} {currentPlan === "demo" && `(${creditsRemaining} left)`}
          </Badge>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--candle)]/10 border border-[var(--candle)]/30 text-[var(--candle)] text-xs font-mono font-medium">
          Transparent Trader Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
          Upgrade to Professional Chart Intelligence
        </h1>
        <p className="text-sm text-[var(--text-2)] leading-relaxed">
          Structured trade setups with verified levels, invalidation triggers, and multi-timeframe confluence.
          No black boxes. No emotional bias.
        </p>
        <div className="pt-2">
          <span className="text-xs font-mono text-[var(--text-2)] bg-[var(--bg-2)] px-3 py-1 rounded-full border border-[var(--line)]">
            Prices shown in USD • No hidden fees
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan Card */}
        <div className="relative rounded-3xl border-2 border-[var(--candle)]/60 bg-[var(--bg-1)] p-8 flex flex-col justify-between shadow-xl shadow-black/40 hover:border-[var(--candle)] transition-all">
          <div className="absolute -top-3.5 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--candle)] text-[#04120A] flex items-center gap-1.5 shadow-md">
              <SparklesIcon className="w-3.5 h-3.5" /> MOST POPULAR
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-lg font-bold text-[var(--text-0)]">{monthly.name}</div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-4xl font-black text-[var(--text-0)] font-mono">${monthly.price}</span>
                <span className="text-sm text-[var(--text-2)] font-mono">/ month</span>
              </div>
              <p className="text-xs text-[var(--text-2)] mt-2 leading-relaxed">
                Full daily access. Cancel anytime in self-serve settings.{" "}
                <span className="opacity-60">[Subject to terms]</span>
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--line)]">
              {monthly.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-1)]">
                  <CheckIcon className="w-4 h-4 text-[var(--candle)] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Button
              variant="primary-gradient"
              size="lg"
              className="w-full font-bold text-xs"
              disabled={loadingPlan === "monthly"}
              onClick={() => handlePlanSelect("monthly")}
            >
              {loadingPlan === "monthly" ? "Checking out..." : "Upgrade to Monthly"}
            </Button>
          </div>
        </div>

        {/* Lifetime Plan Card */}
        <div className="relative rounded-3xl border border-[var(--line)] bg-[var(--bg-1)] p-8 flex flex-col justify-between hover:border-purple-500/60 transition-all">
          <div className="absolute -top-3.5 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center gap-1.5">
              <ShieldCheckIcon className="w-3.5 h-3.5" /> BEST VALUE
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-lg font-bold text-[var(--text-0)]">{lifetime.name}</div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-4xl font-black text-[var(--text-0)] font-mono">${lifetime.price}</span>
                <span className="text-sm text-[var(--text-2)] font-mono">one-time</span>
              </div>
              <p className="text-xs text-[var(--text-2)] mt-2 leading-relaxed">
                Pay once, keep lifetime access. Includes all future market pack upgrades.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--line)]">
              {lifetime.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-1)]">
                  <CheckIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Button
              variant="secondary"
              size="lg"
              className="w-full font-bold text-xs hover:border-purple-500/60"
              disabled={loadingPlan === "lifetime"}
              onClick={() => handlePlanSelect("lifetime")}
            >
              {loadingPlan === "lifetime" ? "Checking out..." : "Get Lifetime Access"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="max-w-4xl mx-auto pt-6">
        <UpgradeComparison />
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-4 pt-6">
        <h3 className="text-xl font-bold text-[var(--text-0)] text-center">
          Billing &amp; Subscription Questions
        </h3>

        <Accordion type="single" className="w-full space-y-2 border-none">
          <AccordionItem id="cancel" className="border border-[var(--line)] rounded-xl px-4 bg-[var(--bg-1)]">
            <AccordionTrigger className="text-xs font-semibold text-[var(--text-0)] py-3">
              How does cancellation work on the monthly plan?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[var(--text-2)] leading-relaxed pb-3">
              You can cancel your subscription at any time with a single click in your settings.
              You will continue to have full access until the end of your paid billing period with no further charges.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="daily-cap" className="border border-[var(--line)] rounded-xl px-4 bg-[var(--bg-1)]">
            <AccordionTrigger className="text-xs font-semibold text-[var(--text-0)] py-3">
              What is the 50 analyses/day fair-use cap?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[var(--text-2)] leading-relaxed pb-3">
              To guarantee fast processing times and prevent automated bot abuse, each active trader has a generous
              50 analyses/day allowance. 99.8% of discretionary traders analyze fewer than 15 charts daily. The quota
              resets at 00:00 UTC every day.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem id="blurry" className="border border-[var(--line)] rounded-xl px-4 bg-[var(--bg-1)]">
            <AccordionTrigger className="text-xs font-semibold text-[var(--text-0)] py-3">
              What happens if my chart screenshot is unreadable?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[var(--text-2)] leading-relaxed pb-3">
              Our data-quality gate automatically evaluates resolution and readability. If a chart cannot be read reliably,
              zero credit is consumed and our system guides you on how to take a clearer capture.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Early Access Modal */}
      <EarlyAccessDialog
        open={earlyAccessOpen}
        onOpenChange={setEarlyAccessOpen}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
