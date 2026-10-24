import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function FeaturesGrid() {
  const features = [
    {
      title: "Levels with Reasons",
      description:
        "Every support, resistance, and key zone is tagged with an explicit rationale (e.g. prior supply shelf, 20 EMA confluence, POC) so you understand the logic.",
      badge: "Grounded",
      icon: (
        <svg className="w-5 h-5 text-[var(--candle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      accentClass: "bg-[var(--candle)]/10 text-[var(--candle)] border-[var(--candle)]/20",
    },
    {
      title: "Dual Bull/Bear Scenarios",
      description:
        "Markets don't move in straight lines. We map both bullish expansion and bearish breakdown triggers with clearly labelled model confidence.",
      badge: "Probabilistic",
      icon: (
        <svg className="w-5 h-5 text-[var(--info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      accentClass: "bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20",
    },
    {
      title: "Defined Entry, Stop & Targets",
      description:
        "Actionable risk-to-reward profiling with entry zones, protective stops, and multiple scale-out target milestones calculated automatically.",
      badge: "Precision",
      icon: (
        <svg className="w-5 h-5 text-[var(--candle-hi)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
      ),
      accentClass: "bg-[var(--candle-hi)]/10 text-[var(--candle-hi)] border-[var(--candle-hi)]/20",
    },
    {
      title: "Explicit Invalidation Rules",
      description:
        "Never stay married to a thesis. Every trade plan explicitly highlights the condition that renders the setup wrong so you can cut losses early.",
      badge: "Risk Control",
      icon: (
        <svg className="w-5 h-5 text-[var(--bear)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      accentClass: "bg-[var(--bear)]/10 text-[var(--bear)] border-[var(--bear)]/20",
    },
    {
      title: "Multi-Timeframe Confluence",
      description:
        "Upload up to 3 chart screenshots at once (e.g. Daily + 1-Hour + 15-Minute). The model checks for alignment, higher-timeframe trend, and conflicts.",
      badge: "Confluence",
      icon: (
        <svg className="w-5 h-5 text-[var(--candle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      accentClass: "bg-[var(--candle)]/10 text-[var(--candle)] border-[var(--candle)]/20",
    },
    {
      title: "Option Chain & Payoff Reading",
      description:
        "Upload option chain screenshots or payoff graphs. Extract Max Pain, Put-Call Ratio (PCR), and major Call/Put Open Interest walls for expiry context.",
      badge: "Derivatives",
      icon: (
        <svg className="w-5 h-5 text-[var(--amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      ),
      accentClass: "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/20",
    },
    {
      title: "Integrated Trading Journal",
      description:
        "Log outcomes of your analyses (win, loss, breakeven, or skipped) to calculate realized R-multiples and track personal decision discipline over time.",
      badge: "Discipline",
      icon: (
        <svg className="w-5 h-5 text-[var(--text-0)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      accentClass: "bg-[var(--bg-3)] text-[var(--text-0)] border-[var(--line-strong)]",
    },
    {
      title: "Trading Academy & Playbooks",
      description:
        "Interactive mini-lessons explaining market structure, reading multi-timeframe confluence, taking high-contrast screenshots, and managing risk.",
      badge: "Education",
      icon: (
        <svg className="w-5 h-5 text-[var(--candle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      accentClass: "bg-[var(--candle)]/10 text-[var(--candle)] border-[var(--candle)]/20",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Subtle ambient backdrop glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--candle)]/5 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3 px-3 py-1 font-mono text-[11px] tracking-wide uppercase border border-[var(--line)]">
            Core Toolkit
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Everything You Need to Plan Your Trade
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Designed for serious technical traders who value transparency, reasoning, and disciplined execution over black-box signals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative flex flex-col justify-between p-5 bg-[var(--bg-1)] border-[var(--line)] hover:border-[var(--candle)]/40 hover:bg-[var(--bg-2)]/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-xl overflow-hidden"
            >
              <CardHeader className="p-0 pb-3">
                <div className="flex items-center justify-between mb-4">
                  {/* Modern Icon container with subtle tinted border and background */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-xs ${f.accentClass}`}>
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--bg-2)] group-hover:bg-[var(--bg-3)] border border-[var(--line)] text-[var(--text-2)] transition-colors">
                    {f.badge}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-[var(--text-0)] group-hover:text-[var(--text-0)] tracking-tight">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-xs text-[var(--text-1)] leading-relaxed group-hover:text-[var(--text-0)]/90 transition-colors">
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
