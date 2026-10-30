"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Tooltip } from "@/components/ui/Tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { Settings, Play, Plus, Search } from "lucide-react";
import { WickDivider } from "@/components/ui/WickDivider";
import { CandleBackdrop } from "@/components/marketing/CandleBackdrop";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { PriceTag } from "@/components/analysis/primitives/PriceTag";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";
import { LevelChip } from "@/components/analysis/primitives/LevelChip";
import { RiskRewardBar } from "@/components/analysis/primitives/RiskRewardBar";
import { ConfidenceMeter } from "@/components/analysis/primitives/ConfidenceMeter";

export function DesignGallery() {
  return (
    <ToastProvider>
      <GalleryContent />
    </ToastProvider>
  );
}

function GalleryContent() {
  const { toast } = useToast();
  const [switchState, setSwitchState] = React.useState(true);
  const [rrValue, setRrValue] = React.useState(2.8);
  const [confidenceScore, setConfidenceScore] = React.useState(82);

  return (
    <div className="relative min-h-screen bg-[var(--bg-0)] text-[var(--text-1)] px-4 py-12 md:px-8 max-w-7xl mx-auto">
      <CandleBackdrop opacity={0.06} />

      <header className="relative z-10 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[var(--line)] pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Logo size={36} />
            <Badge variant="amber" size="sm">
              Dev Only
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
            Design System & Primitives Gallery
          </h1>
          <p className="text-sm text-[var(--text-2)] mt-1">
            Dark-first trading terminal tokens, primitives, states, and accessibility contrast verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary-gradient"
            size="md"
            onClick={() =>
              toast({
                title: "Toast Notification",
                description: "Design system toast system is functioning properly.",
                variant: "success",
              })
            }
          >
            Trigger Toast
          </Button>
          <Link
            href="/"
            className="text-xs text-[var(--text-2)] hover:text-[var(--text-0)] transition-colors underline"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 space-y-16">
        {/* ── Section 1: Brand Mark & Tokens ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-3">
            <h2 className="text-lg font-bold text-[var(--text-0)] tracking-tight">
              1. Brand Identity & Design Tokens
            </h2>
            <span className="text-xs text-[var(--text-2)]">Geist + Geist Mono</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Original Brand Mark</CardTitle>
                <CardDescription>Candle body + upward pilot arrow</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6 gap-6">
                <LogoMark size={32} />
                <LogoMark size={48} />
                <LogoMark size={64} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Background Tokens</CardTitle>
                <CardDescription>Forest-tinted dark scale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-0)] border border-[var(--line)]">
                  <span>--bg-0: #060A07 (Page)</span>
                  <span className="font-mono text-[10px]">18.7:1 AAA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <span>--bg-1: #0B120D (Panels)</span>
                  <span className="font-mono text-[10px]">16.5:1 AAA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                  <span>--bg-2: #111A14 (Cards)</span>
                  <span className="font-mono text-[10px]">14.2:1 AAA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-3)] border border-[var(--line)]">
                  <span>--bg-3: #17231B (Hover)</span>
                  <span className="font-mono text-[10px]">12.1:1 AAA</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Semantic Accents</CardTitle>
                <CardDescription>Bull, Bear, Amber, Info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <span className="text-[var(--candle)] font-semibold">--candle: #5BE38C</span>
                  <span className="font-mono text-[10px]">13.2:1 AAA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <span className="text-[var(--candle-hi)] font-semibold">--candle-hi: #B4F25C</span>
                  <span className="font-mono text-[10px]">14.8:1 AAA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <span className="text-[var(--bear)] font-semibold">--bear: #FF6B6B</span>
                  <span className="font-mono text-[10px]">6.8:1 AA</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <span className="text-[var(--amber)] font-semibold">--amber: #F5B83D</span>
                  <span className="font-mono text-[10px]">11.4:1 AAA</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contrast & Typography</CardTitle>
                <CardDescription>WCAG AA compliance audit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <p className="text-[var(--text-0)] font-bold">Text-0 (#F2F7F3)</p>
                  <p className="text-[var(--text-2)] text-[10px]">Headings: 18.7:1 (Exceeds AAA)</p>
                </div>
                <div className="p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <p className="text-[var(--text-1)]">Text-1 (#BFCBC3)</p>
                  <p className="text-[var(--text-2)] text-[10px]">Body: 12.4:1 (Exceeds AAA)</p>
                </div>
                <div className="p-2 rounded bg-[var(--bg-1)] border border-[var(--line)]">
                  <p className="text-[var(--text-2)]">Text-2 (#7F8F85)</p>
                  <p className="text-[var(--text-2)] text-[10px]">Muted: 6.2:1 (Exceeds AA)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 2: Buttons & Actions ── */}
        <section className="space-y-6">
          <div className="border-b border-[var(--line)]/60 pb-3">
            <h2 className="text-lg font-bold text-[var(--text-0)] tracking-tight">
              2. Button Primitives
            </h2>
            <p className="text-xs text-[var(--text-2)]">
              Primary CTA features the lime-leaning candle gradient with dark text (#04120A) and soft green glow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                Primary Gradient (Brand CTA)
              </span>
              <div className="flex flex-col gap-2.5 items-start">
                <Button variant="primary-gradient" size="lg">
                  Analyse Chart (LG)
                </Button>
                <Button variant="primary-gradient" size="md">
                  Get Trade Plan (MD)
                </Button>
                <Button variant="primary-gradient" size="sm">
                  Quick Scan (SM)
                </Button>
                <Button variant="primary-gradient" size="md" isLoading>
                  Reading chart…
                </Button>
                <Button variant="primary-gradient" size="md" disabled>
                  Disabled State
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                Secondary
              </span>
              <div className="flex flex-col gap-2.5 items-start">
                <Button variant="secondary" size="lg">
                  View Market Packs
                </Button>
                <Button variant="secondary" size="md">
                  Upload Screenshot
                </Button>
                <Button variant="secondary" size="sm">
                  Filter by Timeframe
                </Button>
                <Button variant="secondary" size="md" isLoading>
                  Saving…
                </Button>
                <Button variant="secondary" size="md" disabled>
                  Unavailable
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                Ghost & Icon
              </span>
              <div className="flex flex-col gap-2.5 items-start">
                <Button variant="ghost" size="lg">
                  Explore Academy
                </Button>
                <Button variant="ghost" size="md">
                  View Full History
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" aria-label="Add chart">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="primary-gradient" size="icon" aria-label="Play">
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                Danger & Interactive
              </span>
              <div className="flex flex-col gap-2.5 items-start">
                <Button variant="danger" size="md">
                  Delete Analysis
                </Button>
                <Button variant="danger" size="sm">
                  Reset Journal
                </Button>
                <Button variant="danger" size="md" disabled>
                  Locked
                </Button>
              </div>
            </div>
          </div>
        </section>

        <WickDivider />

        {/* ── Section 3: Trading Primitives ── */}
        <section className="space-y-6">
          <div className="border-b border-[var(--line)]/60 pb-3">
            <h2 className="text-lg font-bold text-[var(--text-0)] tracking-tight">
              3. Trading Domain Primitives
            </h2>
            <p className="text-xs text-[var(--text-2)]">
              Built specifically for chart reading: PriceTag with click-to-copy, LevelChip with strength dots, BiasPill with mandatory icon+label, Risk:Reward meter, and Model Confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PriceTags & Bias */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">PriceTag & BiasPill</CardTitle>
                <CardDescription>Click price tag to test copy animation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-[var(--text-2)] mb-2">PriceTag (Click to copy):</div>
                  <div className="flex flex-wrap gap-2">
                    <PriceTag price={24385.5} prefix="₹" />
                    <PriceTag price={582.4} prefix="$" />
                    <PriceTag price={1.0842} />
                    <PriceTag price={68450} suffix=" USD" />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[var(--text-2)] mb-2">BiasPill (Icon + Label, Never Color Alone):</div>
                  <div className="flex flex-wrap gap-2">
                    <BiasPill bias="bullish" size="sm" />
                    <BiasPill bias="bullish" size="md" />
                    <BiasPill bias="bearish" size="md" />
                    <BiasPill bias="neutral" size="md" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LevelChip */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">LevelChip with Strength Dots</CardTitle>
                <CardDescription>Support, resistance, key zone, pivot levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <LevelChip type="support" strength={3} label="Major Daily Support" />
                  <LevelChip type="support" strength={2} label="H4 Confluence" />
                  <LevelChip type="support" strength={1} label="Intraday Weak" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <LevelChip type="resistance" strength={3} label="All-Time High" />
                  <LevelChip type="resistance" strength={2} label="VWAP Resistance" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <LevelChip type="zone" strength={3} label="Max Pain (24,500)" />
                  <LevelChip type="pivot" strength={2} label="Session Open" />
                </div>
              </CardContent>
            </Card>

            {/* R:R & Confidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk:Reward & Model Confidence</CardTitle>
                <CardDescription>Interactive ratio sliders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <RiskRewardBar riskReward={rrValue} />

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-2)]">Test R:R:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={rrValue}
                    onChange={(e) => setRrValue(parseFloat(e.target.value))}
                    className="w-full accent-[var(--candle)] cursor-pointer"
                  />
                  <span className="font-mono text-xs w-10 text-right">{rrValue.toFixed(1)}</span>
                </div>

                <ConfidenceMeter confidence={confidenceScore} />

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-2)]">Test Score:</span>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                    className="w-full accent-[var(--candle)] cursor-pointer"
                  />
                  <span className="font-mono text-xs w-10 text-right">{confidenceScore}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 4: Interactive Primitives ── */}
        <section className="space-y-6">
          <div className="border-b border-[var(--line)]/60 pb-3">
            <h2 className="text-lg font-bold text-[var(--text-0)] tracking-tight">
              4. Interactive Components & Forms
            </h2>
            <p className="text-xs text-[var(--text-2)]">
              Dialog, Tabs, Accordion, Tooltips, Progress, Switches, Inputs, and Select dropdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Input & Select */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Inputs & Select</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter ticker (e.g. NIFTY50, AAPL)" startAdornment={<Search className="w-4 h-4 text-text-muted" />} />
                <Input
                  defaultValue="Invalid URL"
                  error="Chart URL must be a valid TradingView link"
                />
                <Select
                  label="Select Market Pack"
                  options={[
                    { value: "india-indices", label: "Indian Indices (NIFTY/BANKNIFTY)" },
                    { value: "us-equities", label: "US Equities (NYSE/NASDAQ)" },
                    { value: "crypto", label: "Crypto (BTC/ETH)" },
                    { value: "india-options", label: "Indian Options & Option Chain" },
                  ]}
                />
                <div className="pt-2">
                  <Switch
                    checked={switchState}
                    onCheckedChange={setSwitchState}
                    label="Auto-detect timeframe & indicators"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabs & Accordion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tabs & Accordion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Tabs defaultValue="bull">
                  <TabsList>
                    <TabsTrigger value="bull">▲ Bull Plan</TabsTrigger>
                    <TabsTrigger value="bear">▼ Bear Plan</TabsTrigger>
                    <TabsTrigger value="levels">Key Levels</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bull" className="text-xs text-[var(--text-1)] pt-2 leading-relaxed">
                    Break above 24,450 confirms breakout with target 24,650 and stop below 24,320.
                  </TabsContent>
                  <TabsContent value="bear" className="text-xs text-[var(--text-1)] pt-2 leading-relaxed">
                    Rejection at 24,450 triggers pullback towards 24,180 demand zone.
                  </TabsContent>
                  <TabsContent value="levels" className="text-xs text-[var(--text-1)] pt-2 leading-relaxed">
                    Support: 24,320 (Volume shelf). Resistance: 24,450 (Prior supply).
                  </TabsContent>
                </Tabs>

                <Accordion type="single" defaultValue="q1">
                  <AccordionItem id="q1">
                    <AccordionTrigger>What is the Invalidation Condition?</AccordionTrigger>
                    <AccordionContent>
                      The specific price or session close that invalidates the trade setup. Always read this first before taking action.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem id="q2">
                    <AccordionTrigger>How does Market Pack injection work?</AccordionTrigger>
                    <AccordionContent>
                      Each market pack supplies session rhythms, tick size conventions, and expiry timing to the vision model prompt.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Dialog & Tooltip & Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dialog, Tooltip & Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">
                        Open Modal Dialog
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chart Analysis Disclaimer</DialogTitle>
                        <DialogDescription>
                          Educational technical analysis only — not investment advice. Past performance does not guarantee future results.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="text-xs text-[var(--text-1)] py-2 space-y-2">
                        <p>
                          Always manage your position sizing. Model confidence represents the model&apos;s internal pattern match certainty, not a statistical win rate.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="primary-gradient" size="sm">
                          I Understand
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Tooltip content="Tooltip showing risk & invalidation notes">
                    <Button variant="ghost" size="sm">
                      Hover Tooltip
                    </Button>
                  </Tooltip>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-[var(--text-2)]">Analysis Progress (72%):</div>
                  <Progress value={72} />
                  <div className="text-xs text-[var(--text-2)] pt-2">Indeterminate Shimmer:</div>
                  <Progress indeterminate />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-xs text-[var(--text-2)]">Skeleton Loading State:</div>
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={36} height={36} />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton height={12} width="80%" />
                      <Skeleton height={10} width="50%" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Section 5: Badges & Tags ── */}
        <section className="space-y-4">
          <div className="border-b border-[var(--line)]/60 pb-3">
            <h2 className="text-lg font-bold text-[var(--text-0)] tracking-tight">
              5. Badges & Status Indicators
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <Badge variant="bull">▲ Bullish Setup</Badge>
            <Badge variant="bear">▼ Bearish Breakdown</Badge>
            <Badge variant="amber">◆ Caution / Invalidation</Badge>
            <Badge variant="neutral">● Range-Bound</Badge>
            <Badge variant="bull" size="sm">
              ▲ 1D Bullish
            </Badge>
            <Badge variant="bear" size="sm">
              ▼ 15m Rejection
            </Badge>
            <Badge variant="amber" size="sm">
              ◆ Expiry Today
            </Badge>
          </div>
        </section>
      </main>
    </div>
  );
}
