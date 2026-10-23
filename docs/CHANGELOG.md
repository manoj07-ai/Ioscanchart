# CHANGELOG.md

All notable changes to Iosnapchart are documented here.
Format: `[version] YYYY-MM-DD — description`.

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
