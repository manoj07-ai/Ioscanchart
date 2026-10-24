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
      accent: "candle",
      icon: (
        <svg className="w-6 h-6 text-[var(--candle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      containerClass: "bg-[var(--candle)]/10 text-[var(--candle)] border-[var(--candle)]/25 group-hover:border-[var(--candle)]/50",
    },
    {
      step: "02",
      title: "Data-Quality Gate & Market Pack",
      description:
        "Our engine automatically detects your market (US equities, Indian indices, Forex, Crypto, or Options) and verifies image readability before spending credits.",
      badge: "No Hallucinations",
      accent: "info",
      icon: (
        <svg className="w-6 h-6 text-[var(--info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      containerClass: "bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/25 group-hover:border-[var(--info)]/50",
    },
    {
      step: "03",
      title: "Get Structured Plan in <30s",
      description:
        "Receive a full breakdown: market structure, levels with reasons, bull/bear triggers, entry, stop, targets with R:R, and exact invalidation conditions.",
      badge: "Show Your Work",
      accent: "candle-hi",
      icon: (
        <svg className="w-6 h-6 text-[var(--candle-hi)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      containerClass: "bg-[var(--candle-hi)]/10 text-[var(--candle-hi)] border-[var(--candle-hi)]/25 group-hover:border-[var(--candle-hi)]/50",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-[var(--bg-1)]/40 border-t border-[var(--line)] overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[var(--candle)]/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="neutral" size="sm" className="mb-3 px-3 py-1 font-mono text-[11px] tracking-wide uppercase border border-[var(--line)]">
            Simple 3-Step Workflow
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            How It Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            From chart capture to structured execution in under 30 seconds. No complex indicator setup or manual drawing required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, idx) => (
            <Card
              key={s.step}
              className="group relative p-6 bg-[var(--bg-1)] border-[var(--line)] hover:border-[var(--candle)]/40 hover:bg-[var(--bg-2)]/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-xl flex flex-col justify-between"
            >
              <CardContent className="p-0 space-y-5">
                <div className="flex items-center justify-between">
                  {/* Clean SVG icon pill with responsive hover scaling */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-xs ${s.containerClass}`}
                  >
                    {s.icon}
                  </div>

                  {/* High contrast step watermark pill */}
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-[var(--bg-2)] group-hover:bg-[var(--bg-3)] border border-[var(--line)] text-[var(--text-2)] group-hover:text-[var(--text-0)] transition-colors">
                    STEP {s.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-0)] tracking-tight group-hover:text-[var(--text-0)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--text-1)] leading-relaxed group-hover:text-[var(--text-0)]/90 transition-colors">
                    {s.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)] font-semibold">
                    {s.badge}
                  </span>

                  {idx < steps.length - 1 && (
                    <span className="hidden md:inline text-[var(--text-2)] font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
