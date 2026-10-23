import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function FeaturesGrid() {
  const features = [
    {
      title: "Levels with Reasons",
      description:
        "Every support, resistance, and key zone is tagged with an explicit rationale (e.g. prior supply shelf, 20 EMA confluence, POC) so you understand the logic.",
      icon: "🎯",
    },
    {
      title: "Dual Bull/Bear Scenarios",
      description:
        "Markets don't move in straight lines. We map both bullish expansion and bearish breakdown triggers with clearly labelled model confidence.",
      icon: "⚖️",
    },
    {
      title: "Defined Entry, Stop & Targets",
      description:
        "Actionable risk-to-reward profiling with entry zones, protective stops, and multiple scale-out target milestones calculated automatically.",
      icon: "📐",
    },
    {
      title: "Explicit Invalidation Rules",
      description:
        "Never stay married to a thesis. Every trade plan explicitly highlights the condition that renders the setup wrong so you can cut losses early.",
      icon: "🚫",
    },
    {
      title: "Multi-Timeframe Confluence",
      description:
        "Upload up to 3 chart screenshots at once (e.g. Daily + 1-Hour + 15-Minute). The model checks for alignment, higher-timeframe trend, and conflicts.",
      icon: "📊",
    },
    {
      title: "Option Chain & Payoff Reading",
      description:
        "Upload option chain screenshots or payoff graphs. Extract Max Pain, Put-Call Ratio (PCR), and major Call/Put Open Interest walls for expiry context.",
      icon: "⛓️",
    },
    {
      title: "Integrated Trading Journal",
      description:
        "Log outcomes of your analyses (win, loss, breakeven, or skipped) to calculate realized R-multiples and track personal decision discipline over time.",
      icon: "📓",
    },
    {
      title: "Trading Academy & Playbooks",
      description:
        "Interactive mini-lessons explaining market structure, reading multi-timeframe confluence, taking high-contrast screenshots, and managing risk.",
      icon: "🎓",
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3">
            Core Toolkit
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Everything You Need to Plan Your Trade
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Designed for serious technical traders who value transparency, reasoning, and disciplined execution over black-box signals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="p-2 bg-[var(--bg-2)] border-[var(--line)] hover:border-[var(--line-strong)] transition-all">
              <CardHeader className="p-4 pb-2">
                <span className="text-2xl mb-2">{f.icon}</span>
                <CardTitle className="text-sm font-bold text-[var(--text-0)]">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <p className="text-xs text-[var(--text-1)] leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
