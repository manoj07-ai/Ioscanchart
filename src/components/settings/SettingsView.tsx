"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { brand } from "@/config/brand";
import { Check, Copy, Mail } from "lucide-react";
import { MARKET_PACKS, type MarketPackId } from "@/config/markets";
import type { Plan } from "@/server/billing";

interface SettingsViewProps {
  initialUser: {
    id: string;
    displayName: string | null;
  };
  initialEntitlement: {
    plan: Plan;
    creditsRemaining: number;
    dailyCap: number | null;
    dailyUsed: number;
  };
}

export function SettingsView({ initialUser, initialEntitlement }: SettingsViewProps) {
  // Profile state
  const [displayName, setDisplayName] = useState(initialUser.displayName || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Entitlement state
  const [entitlement] = useState(initialEntitlement);

  // Trading Preferences state (stored in localStorage)
  const [defaultMarket, setDefaultMarket] = useState<MarketPackId>("us-equities");
  const [defaultStyle, setDefaultStyle] = useState("swing");
  const [defaultAccountSize, setDefaultAccountSize] = useState("10000");
  const [defaultRiskPercent, setDefaultRiskPercent] = useState("1.0");
  const [prefSaved, setPrefSaved] = useState(false);

  // Data deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("iosnapchart_user_preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.defaultMarket) setDefaultMarket(parsed.defaultMarket);
        if (parsed.defaultStyle) setDefaultStyle(parsed.defaultStyle);
        if (parsed.defaultAccountSize) setDefaultAccountSize(parsed.defaultAccountSize);
        if (parsed.defaultRiskPercent) setDefaultRiskPercent(parsed.defaultRiskPercent);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save Display Name to API
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (res.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSavingProfile(false);
    }
  }

  // Save Trading Preferences to localStorage
  function handleSavePreferences(e: React.FormEvent) {
    e.preventDefault();
    try {
      const prefs = {
        defaultMarket,
        defaultStyle,
        defaultAccountSize,
        defaultRiskPercent,
      };
      localStorage.setItem("iosnapchart_user_preferences", JSON.stringify(prefs));
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    }
  }

  // Handle Data Deletion
  async function handleConfirmDelete() {
    setDeletingData(true);
    try {
      const res = await fetch("/api/user/delete-data", {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        setDeleteRequested(true);
        setDeleteMessage(json.message);
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error("Delete request failed:", err);
    } finally {
      setDeletingData(false);
    }
  }

  // Copy User ID
  function handleCopyUserId() {
    navigator.clipboard.writeText(initialUser.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  const isUnlimited =
    entitlement.creditsRemaining === Infinity || entitlement.creditsRemaining === null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
          Account & Settings
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Manage your profile, active subscription plan, and default trading parameters.
        </p>
      </div>

      {deleteRequested && (
        <div className="p-4 rounded-xl border border-[var(--amber)]/40 bg-[var(--amber)]/10 text-xs text-[var(--text-1)] space-y-1">
          <div className="font-bold text-[var(--amber)]">Data Deletion Scheduled</div>
          <p>{deleteMessage}</p>
        </div>
      )}

      {/* 1. Profile Section */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-5">
        <h2 className="text-base font-bold text-[var(--text-0)]">Profile Information</h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-1)]">
              Display Name
            </label>
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Henderson"
                className="text-xs"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={savingProfile}
                className="shrink-0 text-xs flex items-center gap-1.5"
              >
                {savingProfile ? "Saving..." : profileSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--candle)]" />
                    <span>Saved</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-2)]">
              Account ID (Internal UUID)
            </label>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-[var(--text-2)] bg-[var(--bg-2)] px-2.5 py-1.5 rounded-lg border border-[var(--line)] truncate flex-1">
                {initialUser.id}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyUserId}
                className="shrink-0 text-xs flex items-center gap-1.5"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--candle)]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Plan & Credits Card */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-0)]">Active Plan</h2>
              <Badge
                variant={entitlement.plan === "demo" ? "neutral" : "bull"}
                size="sm"
                className="uppercase tracking-wider font-mono"
              >
                {entitlement.plan}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-2)]">
              {entitlement.plan === "demo"
                ? "You are currently on the free trial plan with 1 complimentary analysis."
                : entitlement.plan === "monthly"
                ? "Monthly Pro membership with daily fair-use allotment."
                : "Lifetime Founder membership."}
            </p>
          </div>

          <Link href="/app/upgrade">
            <Button
              variant={entitlement.plan === "demo" ? "primary-gradient" : "secondary"}
              size="sm"
            >
              {entitlement.plan === "demo" ? "Upgrade to Pro →" : "Manage Subscription"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)]">
              Credits Remaining
            </span>
            <div className="font-mono text-lg font-bold text-[var(--text-0)]">
              {isUnlimited ? "Unlimited" : entitlement.creditsRemaining}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)]">
              Daily Usage Today
            </span>
            <div className="font-mono text-lg font-bold text-[var(--text-0)]">
              {entitlement.dailyUsed}{" "}
              <span className="text-xs text-[var(--text-2)] font-normal">
                {entitlement.dailyCap ? `/ ${entitlement.dailyCap} cap` : "used"}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)]">
              Billing Status
            </span>
            <div className="font-mono text-lg font-bold text-[var(--candle)]">
              Active
            </div>
          </div>
        </div>
      </div>

      {/* 3. Default Trading Preferences */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[var(--text-0)]">
            Default Trading Preferences
          </h2>
          <p className="text-xs text-[var(--text-2)]">
            These preferences pre-fill the analysis form when you drop a new chart.
          </p>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-1)]">
                Default Market Pack
              </label>
              <select
                value={defaultMarket}
                onChange={(e) => setDefaultMarket(e.target.value as MarketPackId)}
                className="w-full text-xs rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-3 py-2 focus:outline-none focus:border-[var(--candle)]"
              >
                {Object.values(MARKET_PACKS).map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-1)]">
                Trading Style
              </label>
              <select
                value={defaultStyle}
                onChange={(e) => setDefaultStyle(e.target.value)}
                className="w-full text-xs rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-3 py-2 focus:outline-none focus:border-[var(--candle)]"
              >
                <option value="scalp">Intraday / Scalping (1m - 15m)</option>
                <option value="swing">Swing Trading (1h - Daily)</option>
                <option value="position">Position Trading (Weekly)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-1)]">
                Default Account Size
              </label>
              <Input
                type="number"
                value={defaultAccountSize}
                onChange={(e) => setDefaultAccountSize(e.target.value)}
                placeholder="10000"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-1)]">
                Default Risk per Trade (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={defaultRiskPercent}
                onChange={(e) => setDefaultRiskPercent(e.target.value)}
                placeholder="1.0"
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="secondary" size="sm" className="text-xs flex items-center gap-1.5">
              {prefSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--candle)]" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
            {prefSaved && (
              <span className="text-xs text-[var(--candle)] font-mono">
                Saved to your browser
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 4. Support Contact */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[var(--text-0)]">Need Support or Have Feedback?</h2>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            Reach out directly to our engineering & analysis desk. We typically respond within 24 hours.
          </p>
          <div className="text-xs font-mono text-[var(--candle)] pt-1">
            {brand.supportEmail}
          </div>
        </div>

        <a
          href={`mailto:${brand.supportEmail}?subject=Support%20Request%20-%20${brand.name}`}
          className="shrink-0"
        >
          <Button variant="secondary" size="sm" className="text-xs flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </Button>
        </a>
      </div>

      {/* 5. Data & Privacy (Danger Zone) */}
      <div className="p-6 rounded-xl border border-red-500/20 bg-red-950/10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-red-400">Privacy & Data Deletion</h2>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            Under GDPR and data privacy laws, you can request permanent deletion of all your stored chart uploads, trade plans, and journal logs.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30"
        >
          Request Data Deletion
        </Button>
      </div>

      {/* Data Deletion Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirm Data Deletion Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to request data deletion? This action queues all your uploaded screenshots, analyses, and journal history for permanent purge after our 30-day compliance hold.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-xs text-[var(--text-2)]">
            <span className="font-semibold text-[var(--text-1)] block mb-1">
              Audit Event Logged:
            </span>
            A compliance event <code className="text-red-400 font-mono">user_data_delete_requested</code> will be registered for user <code className="font-mono text-[var(--text-0)]">{initialUser.id}</code>.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingData}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deletingData}
              className="text-xs"
            >
              {deletingData ? "Submitting..." : "Yes, Request Deletion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
