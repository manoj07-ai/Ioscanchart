"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface EntitlementState {
  plan: "demo" | "monthly" | "lifetime";
  creditsRemaining: number;
  isInfinite: boolean;
  dailyCap: number | null;
  dailyUsed: number;
}

interface PlanSwitcherProps {
  initialUser: { id: string; displayName: string } | null;
  initialEntitlement: EntitlementState | null;
}

export function PlanSwitcher({ initialUser, initialEntitlement }: PlanSwitcherProps) {
  const [entitlement, setEntitlement] = useState<EntitlementState | null>(initialEntitlement);
  const [loading, setLoading] = useState(false);
  const [customCredits, setCustomCredits] = useState<string>("5");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function updatePlan(
    plan: "demo" | "monthly" | "lifetime",
    credits?: number,
    resetDailyUsage = false
  ) {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dev/set-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, credits, resetDailyUsage }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update plan");
      }

      setEntitlement({
        plan: data.entitlement.plan,
        creditsRemaining:
          data.entitlement.creditsRemaining === null ||
          data.entitlement.creditsRemaining === "Infinity" ||
          data.entitlement.creditsRemaining > 900000
            ? 999999
            : data.entitlement.creditsRemaining,
        isInfinite: data.entitlement.creditsRemaining === "Infinity" || data.entitlement.plan !== "demo",
        dailyCap: data.entitlement.dailyCap,
        dailyUsed: data.entitlement.dailyUsed,
      });

      setMessage({ text: data.message, type: "success" });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Error switching plan",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current State Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Profile Status</CardTitle>
            {entitlement?.plan && (
              <Badge
                variant={
                  entitlement.plan === "lifetime"
                    ? "amber"
                    : entitlement.plan === "monthly"
                    ? "bull"
                    : "neutral"
                }
              >
                {entitlement.plan.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
              <span className="text-[var(--text-2)] block mb-1">User ID</span>
              <span className="text-[var(--text-0)] truncate block">
                {initialUser?.id ? `${initialUser.id.slice(0, 8)}...` : "None"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
              <span className="text-[var(--text-2)] block mb-1">Credits</span>
              <span className="text-[var(--text-0)] text-sm font-semibold block">
                {entitlement?.isInfinite ? "∞ (Unlimited)" : entitlement?.creditsRemaining ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
              <span className="text-[var(--text-2)] block mb-1">Today&apos;s Usage</span>
              <span className="text-[var(--text-0)] text-sm font-semibold block">
                {entitlement?.dailyUsed ?? 0}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
              <span className="text-[var(--text-2)] block mb-1">Daily Cap</span>
              <span className="text-[var(--text-0)] text-sm font-semibold block">
                {entitlement?.dailyCap !== null ? `${entitlement?.dailyCap}/day` : "None"}
              </span>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-xs font-mono ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Switch Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => updatePlan("demo", 1, true)}
              className="justify-start h-auto p-4 text-left flex flex-col items-start gap-1"
            >
              <div className="font-semibold text-xs text-[var(--text-0)]">Demo — Fresh User (1 credit)</div>
              <div className="text-[11px] text-[var(--text-2)]">Tests initial upload flow &amp; happy path.</div>
            </Button>

            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => updatePlan("demo", 0)}
              className="justify-start h-auto p-4 text-left flex flex-col items-start gap-1 border-amber-500/30 hover:border-amber-500/60"
            >
              <div className="font-semibold text-xs text-amber-400">Demo — Exhausted (0 credits)</div>
              <div className="text-[11px] text-[var(--text-2)]">Triggers 402 paywall dialog immediately.</div>
            </Button>

            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => updatePlan("monthly", 999, true)}
              className="justify-start h-auto p-4 text-left flex flex-col items-start gap-1 border-[var(--candle)]/30 hover:border-[var(--candle)]/60"
            >
              <div className="font-semibold text-xs text-[var(--candle)]">Monthly Plan (Unlimited)</div>
              <div className="text-[11px] text-[var(--text-2)]">50/day fair use cap; all 8 market packs.</div>
            </Button>

            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => updatePlan("lifetime", 999999, true)}
              className="justify-start h-auto p-4 text-left flex flex-col items-start gap-1 border-purple-500/30 hover:border-purple-500/60"
            >
              <div className="font-semibold text-xs text-purple-400">Lifetime Plan (Unlimited)</div>
              <div className="text-[11px] text-[var(--text-2)]">Lifetime access with 50/day fair use cap.</div>
            </Button>
          </div>

          {/* Custom Credits & Reset */}
          <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-1)]">Custom Demo Credits:</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value)}
                className="w-20 h-8 text-xs font-mono"
              />
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => updatePlan("demo", parseInt(customCredits, 10) || 0)}
              >
                Apply
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => updatePlan(entitlement?.plan ?? "demo", entitlement?.creditsRemaining, true)}
              className="ml-auto text-xs text-[var(--text-2)]"
            >
              Reset Today&apos;s Usage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation links */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <Link href="/app" className="text-[var(--candle)] hover:underline">
          ← Open Chart Uploader (/app)
        </Link>
        <span className="text-[var(--line)]">•</span>
        <Link href="/app/upgrade" className="text-[var(--candle)] hover:underline">
          View Upgrade Page (/app/upgrade) →
        </Link>
      </div>
    </div>
  );
}
