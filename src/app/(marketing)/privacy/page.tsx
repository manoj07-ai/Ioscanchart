import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";

export const metadata: Metadata = {
  title: "Privacy Policy | IoSnapChart",
  description:
    "Privacy policy detailing data retention of chart images, telemetry, GDPR rights, and non-sale of personal data.",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-[var(--text-1)] text-xs sm:text-sm leading-relaxed">
      <header className="space-y-3 border-b border-[var(--line)] pb-6">
        <div className="text-xs font-mono text-[var(--candle)] font-semibold uppercase tracking-wider">
          Data Governance &amp; Security
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans">
          Privacy Policy
        </h1>
        <p className="text-xs text-[var(--text-2)] font-mono">
          Last Updated: October 2026 · GDPR / CCPA / DPDP Ready Framework
        </p>
      </header>

      <LegalDraftBanner />

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          1. Principles of Privacy
        </h2>
        <p>
          At {brand.name}, we believe in minimal data footprint. We do not sell your personal data, we do not employ third-party advertising tracking cookies, and we do not monetize your trade logs or chart images.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          2. Information We Collect
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Account Data:</strong> Email address, encrypted authentication tokens, and subscription entitlement status.
          </li>
          <li>
            <strong>Uploaded Chart Images:</strong> Visual charts submitted via file upload or TradingView snapshot URLs. These images are transmitted securely to our cloud storage and AI pipeline.
          </li>
          <li>
            <strong>Journal &amp; Execution Data:</strong> Optional trade logs, P&amp;L records, R-multiples, and notes entered into your journal.
          </li>
          <li>
            <strong>Technical Telemetry:</strong> Anonymized error logs, latency metrics, and core product events (e.g., analysis completed, paywall viewed).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          3. How We Process and Retain Chart Images
        </h2>
        <p>
          Uploaded chart images are stored in secure, private cloud buckets (Supabase Storage). They are processed through Google Gemini models via enterprise APIs where data is not used to train global frontier models without consent.
        </p>
        <p>
          <strong>Retention Period:</strong> Chart images associated with active analyses are retained to allow you to review historical results. Users can request immediate deletion of any analysis and its underlying image files directly from the user settings panel (&quot;Delete my data&quot;) or by contacting support.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          4. Zero Non-Essential Cookies
        </h2>
        <p>
          We do not use tracking or behavioral advertising cookies. We only use strictly essential local storage and session identifiers necessary to keep you authenticated, remember your privacy view preferences, and store guest journal logs locally on your own device.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          5. Your Rights (GDPR, CCPA, and Global Privacy)
        </h2>
        <p>
          Regardless of your geography, you have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access a complete export of your personal data and trade logs in standard CSV/JSON format.</li>
          <li>Request complete erasure (&quot;Right to be Forgotten&quot;) of your account, history, and uploaded images.</li>
          <li>Object to or restrict specific automated processing.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          6. Contact Data Protection
        </h2>
        <p>
          To exercise your privacy rights or submit a deletion request, email us at:{" "}
          <a href={`mailto:${brand.supportEmail}`} className="text-[var(--candle)] underline font-mono">
            {brand.supportEmail}
          </a>.
        </p>
      </section>

      <footer className="pt-6 border-t border-[var(--line)] flex flex-wrap gap-4 text-xs font-mono text-[var(--text-2)]">
        <Link href="/terms" className="hover:text-[var(--candle)]">Terms of Service</Link>
        <span>·</span>
        <Link href="/disclaimer" className="hover:text-[var(--candle)]">Full Disclaimer</Link>
        <span>·</span>
        <Link href="/risk" className="hover:text-[var(--candle)]">Risk Disclosure</Link>
      </footer>
    </article>
  );
}
