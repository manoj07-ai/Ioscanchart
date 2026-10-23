# CHANGELOG.md

All notable changes to Iosnapchart are documented here.
Format: `[version] YYYY-MM-DD — description`.

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
