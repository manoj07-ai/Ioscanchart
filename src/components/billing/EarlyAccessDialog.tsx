"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { track } from "@/lib/analytics/track";

interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: "monthly" | "lifetime";
}

export function EarlyAccessDialog({
  open,
  onOpenChange,
  selectedPlan,
}: EarlyAccessDialogProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setErrorMessage("Please consent to receive launch notifications.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          planInterest: selectedPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join early access.");
      }

      track("early_access_submitted", { email, plan: selectedPlan });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  function handleClose() {
    onOpenChange(false);
    // Reset after transition
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
      setErrorMessage("");
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[var(--bg-1)] border-[var(--line)]">
        <DialogHeader>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--candle)]/10 border border-[var(--candle)]/30 text-[var(--candle)] text-xs font-mono font-medium mb-1 w-fit">
            Early Access • {selectedPlan === "lifetime" ? "Lifetime ($179)" : "Monthly ($39/mo)"}
          </div>
          <DialogTitle className="text-lg font-bold text-[var(--text-0)]">
            Payments Launching Soon
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-2)] leading-relaxed">
            We are currently finalizing payment gateway integration and regulatory compliance.
            Join our priority early-access list to lock in founding trader benefits and get notified the moment checkouts open.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div className="text-sm font-semibold text-[var(--text-0)]">
              You&apos;re on the priority list!
            </div>
            <p className="text-xs text-[var(--text-2)] max-w-xs mx-auto leading-relaxed">
              We have reserved your founding trader discount for{" "}
              <span className="font-mono text-[var(--text-1)]">{email}</span>. We will email you as soon as subscriptions go live.
            </p>
            <Button
              variant="primary-gradient"
              size="sm"
              onClick={handleClose}
              className="mt-2"
            >
              Back to App
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="early-access-email" className="text-xs font-medium text-[var(--text-1)]">
                Email address
              </label>
              <Input
                id="early-access-email"
                type="email"
                placeholder="trader@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
                className="text-xs"
              />
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="early-access-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[var(--line)] bg-[var(--bg-3)] text-[var(--candle)] focus:ring-[var(--candle)] cursor-pointer"
              />
              <label
                htmlFor="early-access-consent"
                className="text-[11px] text-[var(--text-2)] leading-tight cursor-pointer select-none"
              >
                I agree to receive launch updates and product announcements from Iosnapchart. Unsubscribe at any time.
              </label>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={status === "loading"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary-gradient"
                size="sm"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Joining..." : "Join Priority List"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
