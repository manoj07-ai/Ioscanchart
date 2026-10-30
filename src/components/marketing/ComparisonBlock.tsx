import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, X } from "lucide-react";

export function ComparisonBlock() {
  const points = [
    {
      feature: "Reasoning for Levels",
      generic: "Lists random price numbers without explaining why they exist.",
      ours: "Every level has an explicit reason (prior supply, EMA shelf, POC, liquidity pool).",
    },
    {
      feature: "Handling Cropped / Unreadable Charts",
      generic: "Hallucinates imaginary prices and levels even when the chart scale is cut off.",
      ours: "Data-Quality Gate warns you immediately if the axis is unreadable — never burns a credit on bad data.",
    },
    {
      feature: "Honest Confidence Metrics",
      generic: "Claims fake-precise '94% win rate' or guaranteed profit statistics.",
      ours: "Labels output as 'Model confidence' with explicit reminders that it is pattern match certainty, not a statistical guarantee.",
    },
    {
      feature: "Market Context & Specialized Packs",
      generic: "Treats a 5m Nifty option chart the same as a daily Apple stock chart.",
      ours: "Pluggable Market Packs inject market-specific context: trading sessions, expiry rhythms, lot sizes, tick sizes, and circuit limits.",
    },
    {
      feature: "Indian Markets & Option Chains",
      generic: "Stops at global US charts; refuses or fails on NIFTY, BANKNIFTY, or NSE options.",
      ours: "First-class support for Indian indices, NSE/BSE equities, and option chain screenshots (Max Pain, PCR, OI walls).",
    },
  ];

  return (
    <section className="py-20 relative bg-[var(--bg-1)]/50 border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="amber" size="sm" className="mb-3">
            Built for Serious Traders
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Why It&apos;s Different: Purpose-Built vs. Generic AI
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Most generic chatbots guess without context. We built an explainable analysis engine that shows its work and respects risk management.
          </p>
        </div>

        <Card className="overflow-hidden border-[var(--line-strong)] bg-[var(--bg-2)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--line-strong)] bg-[var(--bg-3)]/60 text-[var(--text-0)] font-semibold">
                    <th className="py-4 px-6 w-1/4">Capability</th>
                    <th className="py-4 px-6 w-3/8 text-[var(--bear)]">Generic AI / Chatbots</th>
                    <th className="py-4 px-6 w-3/8 text-[var(--candle)] font-bold bg-[var(--candle-dim)]/15">
                      Iosnapchart Engine
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {points.map((p) => (
                    <tr key={p.feature} className="hover:bg-[var(--bg-3)]/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[var(--text-0)] align-top">
                        {p.feature}
                      </td>
                      <td className="py-4 px-6 text-[var(--text-2)] leading-relaxed align-top">
                        <div className="flex items-start gap-1.5">
                          <X className="w-4 h-4 text-[var(--bear)] shrink-0 mt-0.5" />
                          <span>{p.generic}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[var(--text-1)] font-medium leading-relaxed align-top bg-[var(--candle-dim)]/10">
                        <div className="flex items-start gap-1.5">
                          <Check className="w-4 h-4 text-[var(--candle)] shrink-0 mt-0.5" />
                          <span>{p.ours}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
