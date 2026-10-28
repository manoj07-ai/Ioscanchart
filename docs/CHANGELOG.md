# CHANGELOG.md

All notable changes to Iosnapchart are documented here.
Format: `[version] YYYY-MM-DD — description`.

---

## [0.12.0] 2026-10-28 — Prompt 12: Trading Journal Redesign & Public SEO Tool

### Added
- Professional P&L-Calendar Trading Journal (`/app/journal`):
  - Month calendar view with daily profit/loss tinting (`--candle` and `--bear` intensity scaling), glyphs (`▲/▼`), trade counts, weekly totals, and monthly P&L total.
  - Stats strip: Net P&L, Win Rate (strictly gated at ≥10 trades), Profit Factor, Avg Win / Avg Loss, Best Day, Total Trades with W/L/BE split.
  - Equity curve: cumulative running P&L / R trajectory with zero baseline, range chips (Month / 3M / YTD / All), and hover tooltips.
  - R-multiple alongside Currency: instant global toggle between P&L ($) and R.
  - Plan vs Actual: integration with AI analyses (`analysis_id`), prefilling planned setup, and logging plan adherence (Yes / Partly / No) with P&L split.
  - Multi-currency support: USD, INR (`en-IN` formatting), EUR, GBP, AUD, JPY, and Points mode.
  - Weekend-aware calendar: toggle between Mon–Fri and 7-day view, customizable week start (Sunday or Monday).
  - Privacy mode: single-click toggle to blur all monetary values for screen sharing and social posts.
  - Tags and Mistakes: setup tags, mistake tags (FOMO, moved stop, oversized, early exit, revenge trade, no setup) with comprehensive breakdown tabs.
  - CSV Import & Export: batch import with column mapping validation, export to CSV, and downloadable standard template.
  - Sample Data Mode: in-memory non-persisted test dataset with clear disclaimer banner and one-click clear.
- Public SEO-Facing Journal:
  - Pillar landing page `/trading-journal` (≥1,200 words with field table, review methodology, FAQ schema, embedded sample preview).
  - Guest Mode Interactive Tool `/tools/trading-journal` (full client-side storage via IndexedDB/localStorage, zero login required).
  - 6 dedicated market pages `/trading-journal/[market]` (Forex, Crypto, Stocks, Options, Futures, Nifty & Bank Nifty).
  - 4 original educational blog posts under `/blog/...`.
  - Downloadable CSV template `/downloads/trading-journal-template.csv`.
- Database schema migration `supabase/migrations/0004_trades.sql` introducing `trades` and `journal_days` tables with full RLS and indexes.

## [0.3.0] 2026-10-23 — Prompt 03: Marketing Landing Page

### Added
- Public marketing site in `src/app/(marketing)/`:
  - `Navbar`: Responsive header with frosted blur on scroll, navigation links, Sign in stub, and primary CTA.
  - `Hero`: Headline ("Drop any chart. From Wall Street to Dalal Street."), sub-headline, primary CTA, secondary sample jump link, micro-trust notes, and ambient `CandleBackdrop`.
  - `HeroSampleCard`: Animated preview card clearly marked as an "Example analysis" showcasing NIFTY 50 1D/1H, data quality gate, levels with reasons, bull/bear triggers with model confidence, and actionable trade plan with invalidation.
  - `MarketTickerStrip`: Covered markets strip highlighting US Equities, Forex, Crypto, Gold, Global Indices, and Indian Markets (NIFTY, BANKNIFTY, SENSEX, India Options with "New" and "Beta" badges).
  - `InteractiveDemo`: Before/after split view with 3 pre-baked JSON instrument samples (NIFTY 50, AAPL, XAUUSD), complete with market structure, levels with reasons, bull/bear scenarios, and options Open Interest & Max Pain readouts.
  - `HowItWorks`: 3-step workflow (Drop chart → Quality check & market pack → Structured plan in <30s).
  - `FeaturesGrid`: 8 core features grid (Levels with reasons, Dual scenarios, Entry/stop/targets with R:R, Invalidation rules, Multi-timeframe confluence, Options chain & payoff reading, Trading journal, Academy).
  - `ComparisonBlock`: "Why it's different" table contrasting our explainable engine against generic chatbots without naming competitors.
  - `MarketsDeepDive`: Two-column comparison of Global vs. India markets with India options marked as Beta.
  - `PricingSection`: Config-driven pricing reading from `plans.ts` (Demo, Monthly, Lifetime, "Shown in USD", CTAs routing to `/app/upgrade`).
  - `SocialProofHonest`: Founding Trader early-access block with `<TestimonialPlaceholder />` gated by `SHOW_TESTIMONIALS = false`.
  - `FounderNote`: "Why I built this" block with `{{FOUNDER_STORY}}` placeholder for founder editing.
  - `FaqSection`: Accordion addressing all 9 questions (regulatory advice, accuracy, Indian options, blurry charts, refunds, guarantees).
  - `Footer`: Legal navigation (`/terms`, `/privacy`, `/disclaimer`, `/risk`), contact info, copyright, and mandatory regulatory notice.
  - `StickyMobileCta`: Mobile floating action bar activating after scrolling past the hero section.
- SEO & Analytics:
  - `src/app/robots.ts` and `src/app/sitemap.ts` with all marketing routes.
  - JSON-LD structured data (`SoftwareApplication`, `FAQPage`) embedded in landing page.
  - Client-side event tracking helper `src/lib/analytics/track.ts` and `/api/events` receiver route.
- Legal & Compliance verification:
  - Unit test `src/__tests__/marketing-compliance.test.ts` verifying zero fabricated stats ("1,300", "1,000+", "4.7") and `SHOW_TESTIMONIALS = false`.
- Total unit tests passing: 26/26. Build generates 23 static and dynamic routes with zero warnings.

---

## [0.2.0] 2026-10-23 — Prompt 02: Design System

### Added
- Design tokens in `src/styles/tokens.css` with semantic CSS variables (`--bg-0..3`, `--line`, `--text-0..2`, `--candle`, `--candle-hi`, `--bear`, `--amber`, `--info`, `--cta-dark`, radii, motion).
- Tailwind CSS variables mapped and integrated in `src/styles/tokens.css` and `src/app/globals.css`.
- UI Primitives in `src/components/ui/`:
  - `Button`: primary-gradient (lime-leaning candle with dark `#04120A` text), secondary, ghost, danger; sizes sm/md/lg/icon; loading spinner state.
  - `Card`: header, title, description, content, footer with subtle inner top highlight (`card-highlight`).
  - `Badge`: bull, bear, amber, neutral with mandatory icon+label.
  - `Input`: dark styled with `--bg-3`, start/end adornments, error state, focus ring in `--candle`.
  - `Tabs`: accessible tab list, triggers, and tab panels with keyboard navigation.
  - `Accordion`: animated collapsible sections.
  - `Tooltip`: accessible tooltip with delay, styled to dark terminal.
  - `Dialog`: modal dialog with backdrop blur, focus trap, and escape key support.
  - `Progress`: linear progress bar with candle gradient and indeterminate shimmer mode.
  - `Skeleton`: shimmer animation supporting custom dimensions and circle variant.
  - `Toast`: zero-dependency toast system (`ToastProvider`, `useToast`, `Toaster`).
  - `Switch`: accessible toggle switch with smooth thumb slide.
  - `Select`: styled dark select dropdown.
  - `WickDivider`: section divider featuring a subtle candle glyph and wick lines.
- Trading Domain Primitives in `src/components/analysis/primitives/`:
  - `PriceTag`: font-mono, tabular numerals, click-to-copy with visual checkmark feedback.
  - `BiasPill`: ▲ Bullish / ▼ Bearish / ◆ Neutral (icon + text label always paired, never color alone).
  - `LevelChip`: Support, Resistance, Key Zone, Pivot with strength dots (1-3).
  - `RiskRewardBar`: visual R:R bar showing risk zone (coral) vs reward zone (candle green) with ratio format (`1:X`).
  - `ConfidenceMeter`: explicitly labelled "Model confidence" with tooltip explaining it is the model's pattern match certainty, not a statistical win rate.
- Brand Identity:
  - Original SVG `LogoMark` and `Logo` (candlestick body with upward pilot-arrow wick; no competitor bull or U shapes).
  - Favicon set in `src/app/icon.svg`.
  - OpenGraph image template in `src/components/brand/OgImageTemplate.tsx`.
- Ambient Background: `CandleBackdrop` SVG with slow ambient drift, <=8% opacity, respecting `prefers-reduced-motion`.
- Dev-only component gallery route `/dev/design` displaying all tokens, primitives, states, and WCAG AA contrast notes (returns 404 in production).
- Unit tests in `src/__tests__/design-primitives.test.tsx` verifying `Button`, `BiasPill`, `PriceTag`, and `LevelChip` (10 tests). Total tests: 23 passing.

---

## [0.1.0] 2026-10-23 — Prompt 01: Bootstrap

### Added
- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS + pnpm workspace
- `src/config/brand.ts` — single source of truth for product name (Iosnapchart)
- `src/config/plans.ts` — Demo / Monthly / Lifetime plan config with USD prices, credits, daily caps
- `src/config/legal.ts` — `SHORT_DISCLAIMER`, `LONG_DISCLAIMER`, `RISK_WARNING` (educational analysis framing, no profit guarantees)
- `src/config/markets.ts` — 8 market packs (us-equities, forex, crypto, commodities, global-indices, india-indices, india-equities, india-options)
- `src/styles/tokens.css` — full CSS variable token set (bg, text, candle, bear, amber, info, motion, radii)
- `src/lib/supabase/` — typed server + browser clients + hand-written DB types stub
- `src/server/auth/index.ts` — `getCurrentUser()` returning mock dev user (DEV_USER_ID)
- `src/server/billing/index.ts` — `getEntitlement()`, `consumeCredit()`, `refundCredit()` with Postgres RPC
- `src/server/ai/client.ts` — Gemini client stub (GEMINI_MODEL from env)
- `src/server/analysis/pipeline.ts` — analysis pipeline stubs (full impl Prompt 04)
- `src/server/markets/packs.ts` — market pack context stubs (full impl Prompt 04)
- `supabase/migrations/0001_init.sql` — all tables with RLS, indexes, billing RPCs
- `supabase/seed.sql` — dev profile + 3 seed lessons
- `.env.example` — all required env vars documented
- `.env.local` — local placeholder (gitignored)
- `docs/SETUP.md`, `docs/BACKLOG.md`, `docs/CHANGELOG.md`, `docs/QUESTIONS.md`
- `/api/health` route returning `{ status, version, timestamp, env }`
- Vitest config (`.mts` ESM), 2 test files, 13 tests — all passing
- `vitest.config.mts` — jsdom environment, `@` alias
- Placeholder home page using `brand.name` (no hardcoded strings)
- All 22 routes stubbed with placeholder pages per AGENTS.md §6
- Full folder structure per AGENTS.md §12

### Toolchain
- `pnpm typecheck` → `tsc --noEmit` ✅
- `pnpm lint` → `eslint src/` ✅
- `pnpm test` → `vitest run` → 13/13 ✅
