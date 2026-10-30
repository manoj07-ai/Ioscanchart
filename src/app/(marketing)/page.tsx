import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { CandleBackdrop } from "@/components/marketing/CandleBackdrop";
import { HeroSampleCard } from "@/components/marketing/HeroSampleCard";
import { Check } from "lucide-react";
import { MarketTickerStrip } from "@/components/marketing/MarketTickerStrip";
import { InteractiveDemo } from "@/components/marketing/InteractiveDemo";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { ComparisonBlock } from "@/components/marketing/ComparisonBlock";
import { MarketsDeepDive } from "@/components/marketing/MarketsDeepDive";
import { PricingSection } from "@/components/marketing/PricingSection";
import { SocialProofHonest } from "@/components/marketing/SocialProofHonest";
import { FounderNote } from "@/components/marketing/FounderNote";
import { FaqSection } from "@/components/marketing/FaqSection";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WickDivider } from "@/components/ui/WickDivider";

export const metadata: Metadata = {
  title: `${brand.name} — Drop any chart. From Wall Street to Dalal Street.`,
  description:
    "Drop any chart screenshot and get a structured, explainable trade plan: market structure, key levels with reasons, bull/bear scenarios, entry, stop, targets, and invalidations.",
  openGraph: {
    title: `${brand.name} — Drop any chart. From Wall Street to Dalal Street.`,
    description: brand.tagline,
    url: "https://iosnapchart.com",
    siteName: brand.name,
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: brand.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Explainable AI Chart Analysis`,
    description: brand.tagline,
    creator: brand.twitter,
  },
};

export default function MarketingHomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name,
        url: "https://iosnapchart.com",
        logo: "https://iosnapchart.com/icon.svg",
        sameAs: [`https://x.com/${brand.twitter.replace("@", "")}`],
      },
      {
        "@type": "SoftwareApplication",
        name: brand.name,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: brand.tagline,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "1 Free Full Analysis taste",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this financial advice or a trade signal service?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. This platform provides educational technical analysis only. It reads chart structure, levels, and scenarios on the image you upload.",
            },
          },
          {
            "@type": "Question",
            name: "Which markets and instruments are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Global equities (US NYSE, NASDAQ), Forex, Crypto, Gold/Commodities, Global indices, and Indian markets including NIFTY, BANKNIFTY, FINNIFTY, SENSEX, NSE stocks, and options.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Section 1 & 2: Hero ── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <CandleBackdrop opacity={0.06} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Value Proposition (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2">
                <Badge variant="bull" size="sm">
                  Global Markets + India Indices &amp; Options
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-0)] leading-[1.12]">
                Drop any chart. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[var(--candle)] to-[var(--candle-hi)] bg-clip-text text-transparent">
                  From Wall Street to Dalal Street.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-1)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get a structured trade plan with every level explained — market structure, support, resistance, bull/bear scenarios, entry, stop, targets, and the exact conditions that invalidate the idea.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/app">
                  <Button variant="primary-gradient" size="lg" className="w-full sm:w-auto shadow-xl">
                    Analyze a chart free →
                  </Button>
                </Link>
                <a
                  href="#demo"
                  className="text-xs sm:text-sm font-semibold text-[var(--text-1)] hover:text-[var(--candle)] transition-colors underline underline-offset-4"
                >
                  See a sample analysis
                </a>
              </div>

              {/* Trust & Policy Micro-note */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[var(--text-2)]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--candle)] stroke-[2.5]" /> 1 Full Free Analysis
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--candle)] stroke-[2.5]" /> No Credit Card Required
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[var(--candle)] stroke-[2.5]" /> &lt;30s Latency
                </span>
              </div>
            </div>

            {/* Right Column: Animated Sample Card (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <HeroSampleCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Market Ticker Strip ── */}
      <MarketTickerStrip />

      {/* ── Section 4: Interactive Demo (Before / After) ── */}
      <InteractiveDemo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WickDivider />
      </div>

      {/* ── Section 5: How It Works (3 Steps) ── */}
      <HowItWorks />

      {/* ── Section 6: Features Grid ── */}
      <FeaturesGrid />

      {/* ── Section 7: "Why It's Different" Comparison Block ── */}
      <ComparisonBlock />

      {/* ── Section 8: Markets Deep Dive ── */}
      <MarketsDeepDive />

      {/* ── Section 9: Pricing Plans ── */}
      <PricingSection />

      {/* ── Section 10: Honest Social Proof (Founding Trader) ── */}
      <SocialProofHonest />

      {/* ── Section 11: Founder Note ── */}
      <FounderNote />

      {/* ── Section 12: FAQ Accordion ── */}
      <FaqSection />

      {/* ── Section 13: Final CTA Banner ── */}
      <section className="py-20 relative bg-gradient-to-b from-[var(--bg-0)] to-[var(--bg-1)] border-t border-[var(--line)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="bull" size="sm">
            Zero-Friction First Run
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-0)]">
            Ready to See the Reasoning Behind Your Chart?
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-1)] max-w-xl mx-auto leading-relaxed">
            Drop your chart screenshot now. Get an explainable, disciplined plan before your next session opens.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app">
              <Button variant="primary-gradient" size="lg" className="w-full sm:w-auto shadow-2xl">
                Analyze your chart now →
              </Button>
            </Link>
          </div>

          <p className="text-xs text-[var(--text-2)] font-mono">
            1 Free Analysis included • All 8 market packs unlocked
          </p>
        </div>
      </section>
    </>
  );
}
