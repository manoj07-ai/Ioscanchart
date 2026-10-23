import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Drop Any Chart Screenshot",
      description:
        "Paste an image, upload a file, or drop a TradingView link. Keep the ticker, timeframe, and price scale visible for maximum precision.",
      badge: "Zero Setup",
      icon: "📸",
    },
    {
      step: "02",
      title: "Data-Quality Gate & Market Pack",
      description:
        "Our engine automatically detects your market (US equities, Indian indices, Forex, Crypto, or Options) and verifies image readability before spending credits.",
      badge: "No Hallucinations",
      icon: "🔍",
    },
    {
      step: "03",
      title: "Get Structured Plan in <30s",
      description:
        "Receive a full breakdown: market structure, levels with reasons, bull/bear triggers, entry, stop, targets with R:R, and exact invalidation conditions.",
      badge: "Show Your Work",
      icon: "⚡",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-[var(--bg-1)]/40 border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3">
            Simple 3-Step Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            How It Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            From chart capture to structured execution in under 30 seconds. No complex indicator setup or manual drawing required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <Card key={s.step} className="relative p-6 bg-[var(--bg-2)] border-[var(--line)]">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="font-mono text-2xl font-black text-[var(--line-strong)]">
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-0)] tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--text-1)] leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <div className="pt-2">
                  <Badge variant="bull" size="sm" showIcon={false}>
                    {s.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
