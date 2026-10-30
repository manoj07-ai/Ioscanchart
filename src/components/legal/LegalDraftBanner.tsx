import React from "react";
import { AlertTriangle } from "lucide-react";

export function LegalDraftBanner() {
  const showBanner = process.env.NEXT_PUBLIC_LEGAL_DRAFT_BANNER !== "false";

  if (!showBanner) return null;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-[var(--amber)]/40 bg-[var(--amber)]/10 space-y-3 my-6">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--amber)] uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 text-[var(--amber)] shrink-0" />
        <span>DRAFT — Pending Formal Legal Review</span>
      </div>

      <p className="text-xs text-[var(--text-1)] leading-relaxed">
        This document serves as an operational compliance framework for IoSnapChart. Prior to public scale or paid marketing, the founder&apos;s qualified legal counsel in applicable jurisdictions (US, India, EU/UK) must review and approve these provisions.
      </p>

      <div className="pt-2 border-t border-[var(--amber)]/20 space-y-1.5 text-[11px] text-[var(--text-2)] font-mono">
        <div className="font-semibold text-[var(--amber)]">Key Items Founder&apos;s Legal Counsel Must Verify:</div>
        <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
          <li>
            <strong>Investment Advice Boundaries:</strong> Confirm pure technical pattern recognition does not trigger SEBI RA/IA registration in India, SEC/FINRA adviser rules in the US, or MiFID II in Europe.
          </li>
          <li>
            <strong>Data Retention & Privacy:</strong> Confirm retention schedule for user-uploaded chart images and audit trails under GDPR, CCPA, and India DPDP Act.
          </li>
          <li>
            <strong>Refunds &amp; Digital Credits:</strong> Enforce strict &quot;no refunds once AI analysis credits are consumed&quot; policy compliant with digital goods consumer protection laws.
          </li>
          <li>
            <strong>Lifetime Plan Definition:</strong> Explicitly define &quot;lifetime&quot; as the commercial lifespan of the product, with reasonable daily fair-use quotas to manage AI API costs.
          </li>
          <li>
            <strong>Age Restriction (18+):</strong> Validate mandatory 18+ age gate and indemnification against unauthorized minor participation.
          </li>
        </ul>
      </div>
    </div>
  );
}
