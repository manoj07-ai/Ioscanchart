"use client";

import * as React from "react";
import Link from "next/link";
import { PLANS } from "@/config/plans";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { track } from "@/lib/analytics/track";

export function PricingSection() {
  const { demo, monthly, lifetime } = PLANS;

  return (
    <section id="pricing" className="py-20 relative bg-[var(--bg-1)]/40 border-t border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="bull" size="sm" className="mb-3">
            Transparent Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Simple Plans with 1 Free Taste
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Test the full engine on your own chart with zero credit card required. Upgrade when you need unlimited multi-timeframe planning.
          </p>
          <span className="inline-block mt-2 font-mono text-[11px] text-[var(--text-2)] bg-[var(--bg-2)] px-2.5 py-0.5 rounded-full border border-[var(--line)]">
            All prices shown in USD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Free Taste (Demo) */}
          <Card className="flex flex-col justify-between border-[var(--line)] bg-[var(--bg-2)]">
            <div>
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="neutral" size="sm">
                    {demo.name}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-0)] font-mono">
                    $0
                  </span>
                  <span className="text-xs text-[var(--text-2)]">/ forever</span>
                </div>
                <CardDescription className="text-xs">
                  Experience the full analysis pipeline on your first chart before committing.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                  Includes:
                </div>
                <ul className="space-y-2 text-xs text-[var(--text-1)]">
                  {demo.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[var(--candle)] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-[var(--text-2)]">
                    <span className="opacity-50">○</span>
                    <span>Multi-timeframe confluence requires Monthly</span>
                  </li>
                </ul>
              </CardContent>
            </div>
            <CardFooter className="p-6 pt-0 mt-4">
              <Link href="/app" className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => track("pricing_free_taste_clicked")}
                >
                  Start Free Taste
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 2: Monthly (Popular) */}
          <Card className="flex flex-col justify-between relative border-[var(--candle)] bg-[var(--bg-2)] shadow-2xl shadow-[var(--candle-glow)] scale-[1.02]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="bull" size="sm" showIcon={false}>
                Most Popular
              </Badge>
            </div>
            <div>
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="bull" size="sm">
                    {monthly.name}
                  </Badge>
                  <span className="text-[11px] text-[var(--candle)] font-mono">50 analyses / day</span>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-0)] font-mono">
                    ${monthly.price}
                  </span>
                  <span className="text-xs text-[var(--text-2)]">/ month</span>
                </div>
                <CardDescription className="text-xs">
                  For active traders requiring daily setups across Wall Street and Indian markets.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                  Everything in Free, plus:
                </div>
                <ul className="space-y-2 text-xs text-[var(--text-1)]">
                  {monthly.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[var(--candle)] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <CardFooter className="p-6 pt-0 mt-4">
              <Link href="/app/upgrade" className="w-full">
                <Button
                  variant="primary-gradient"
                  size="md"
                  className="w-full font-bold"
                  onClick={() => track("pricing_monthly_clicked")}
                >
                  Get Monthly Access
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Card 3: Lifetime (Best Value) */}
          <Card className="flex flex-col justify-between border-[var(--line-strong)] bg-[var(--bg-2)]">
            <div>
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="amber" size="sm">
                    {lifetime.name}
                  </Badge>
                  <span className="text-[11px] text-[var(--amber)] font-mono">One-Time Payment</span>
                </div>
                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-0)] font-mono">
                    ${lifetime.price}
                  </span>
                  <span className="text-xs text-[var(--text-2)]">/ one-time</span>
                </div>
                <CardDescription className="text-xs">
                  Pay once, own forever. Front-load savings with guaranteed access to all future market packs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-3">
                <div className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                  Maximum Advantage:
                </div>
                <ul className="space-y-2 text-xs text-[var(--text-1)]">
                  {lifetime.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[var(--candle)] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <CardFooter className="p-6 pt-0 mt-4">
              <Link href="/app/upgrade" className="w-full">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full hover:border-[var(--candle)]"
                  onClick={() => track("pricing_lifetime_clicked")}
                >
                  Get Lifetime Access
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
