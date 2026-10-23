import * as React from "react";
import Link from "next/link";
import { SHOW_TESTIMONIALS } from "@/config/brand";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

/**
 * Placeholder component for future verified testimonials.
 * Strictly hidden until real, consented reviews exist.
 */
export function TestimonialPlaceholder() {
  if (!SHOW_TESTIMONIALS) return null;

  return (
    <div className="py-12 text-center text-xs text-[var(--text-2)]">
      {/* Testimonials will render here once collected with user consent */}
    </div>
  );
}

/**
 * Honest Social Proof: Founding Trader Early-Access Block
 * Zero fabricated stats, ratings, or profit screenshots.
 */
export function SocialProofHonest() {
  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialPlaceholder />

        <Card className="border-[var(--candle)]/40 bg-[var(--bg-2)] p-6 sm:p-8 card-highlight relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--candle-dim)]/10 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="p-0 mb-4 border-none flex flex-row items-center justify-between">
            <Badge variant="bull" size="sm">
              Founding Trader Program
            </Badge>
            <span className="text-xs font-mono text-[var(--candle)]">Early Access</span>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-[var(--text-0)]">
              No Fabricated Testimonials. Just an Honest Invitation.
            </CardTitle>

            <p className="text-sm text-[var(--text-1)] leading-relaxed">
              We despise fake social proof as much as you do: no inflated trader counts, no fabricated 5-star ratings, and no staged P&amp;L screenshots. We let the product speak for itself.
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-1)] leading-relaxed">
              We are actively onboarding our first cohort of <strong className="text-[var(--text-0)]">Founding Traders</strong>. In exchange for your candid feedback and suggestions on our market packs, you receive free analysis credits and direct access to shaping the roadmap.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/app">
                <Button variant="primary-gradient" size="md">
                  Join as a Founding Trader
                </Button>
              </Link>
              <span className="text-xs text-[var(--text-2)]">
                Try 1 full analysis free • No credit card required
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
