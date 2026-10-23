import * as React from "react";
import { brand } from "@/config/brand";
import { Card, CardContent } from "@/components/ui/Card";

/**
 * Founder Note — Truthful story about why the platform was created.
 *
 * NOTE FOR THE FOUNDER:
 * Replace the placeholder text in {{FOUNDER_STORY}} below with your
 * personal story, trading background, or specific reason for building this app.
 */
export function FounderNote() {
  return (
    <section className="py-16 relative bg-[var(--bg-1)]/30 border-t border-[var(--line)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-[var(--line)] bg-[var(--bg-2)] p-6 sm:p-8">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-3)] border border-[var(--candle)] flex items-center justify-center text-sm font-bold text-[var(--candle)]">
                F
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-0)]">
                  A Note from the Builder
                </h3>
                <p className="text-xs text-[var(--text-2)]">Founder, {brand.name}</p>
              </div>
            </div>

            {/* {{FOUNDER_STORY}} — Editable block for founder */}
            <div className="text-xs sm:text-sm text-[var(--text-1)] space-y-3 leading-relaxed border-l-2 border-[var(--candle-dim)] pl-4 my-4 italic">
              <p>
                &ldquo;I built {brand.name} because I was tired of generic AI chatbots that hallucinated price levels when a chart was cropped, and competitor tools that charged high monthly fees while ignoring Indian markets entirely.
              </p>
              <p>
                As a trader, I don&apos;t want fake 90%+ win rate claims. I want an honest second pair of eyes that reads the chart structure, verifies the price scale, gives me the explicit reasons for every support and resistance level, and tells me straight up what condition invalidates the trade.
              </p>
              <p>
                That is the standard we hold every analysis to — from Wall Street to Dalal Street.&rdquo;
              </p>
            </div>

            <div className="pt-2 text-xs text-[var(--text-2)] font-mono">
              — The {brand.name} Team
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
