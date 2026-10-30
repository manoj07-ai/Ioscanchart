# IoSnapChart Pre-Launch Checklist

This document tracks all operational, regulatory, AI quality, and financial gates required prior to public commercial launch.

---

## 1. Regulatory & Legal Review

| Item | Description | Owner | Status | Action Required |
|---|---|---|---|---|
| **SEBI RA/IA Boundary (India)** | Verify that pure technical visual pattern recognition without personalized recommendations or target promises complies with SEBI regulations. | Legal Counsel | 🟡 PENDING | Have Indian securities lawyer review `src/config/legal.ts` and `/disclaimer`. |
| **SEC / CFTC Boundary (US)** | Ensure educational publisher exclusion applies under US securities laws. Verify CFTC Rule 4.41 hypothetical performance disclosure. | Legal Counsel | 🟡 PENDING | Confirm no statements promise financial returns or guarantee stops. |
| **Terms of Service & Age Gate** | Ensure 18+ age restriction is enforceable and indemnification clauses cover user trading losses. | Legal Counsel | 🟢 IMPLEMENTED | Enforced via UI checkbox and `/terms`. |
| **Privacy & Data Retention** | User image deletion policy and GDPR/CCPA data export/erasure compliance. | Engineering | 🟢 IMPLEMENTED | Deletion requests supported via settings and `/api/user/delete-data`. |
| **Draft Banner Removal** | Flip `NEXT_PUBLIC_LEGAL_DRAFT_BANNER=false` once legal counsel gives final sign-off. | Founder | 🟡 PENDING | Keep enabled until lawyer formally approves. |

---

## 2. Market Pack Data Verification

Verify all baseline parameters against official exchange circulars before launch:

| Market Pack | Verified Parameters | Source / Reference | Status |
|---|---|---|---|
| **NIFTY & BANKNIFTY** | Weekly expiries (Nifty: Thu, BankNifty: Wed); Lot sizes (Nifty 75, BankNifty 30). | [NSE India Derivatives](https://www.nseindia.com) | 🟢 VERIFIED (Oct 2026) |
| **FINNIFTY & MIDCPNIFTY** | Lot sizes: FINNIFTY (65), MIDCPNIFTY (75); Expiry days (Tue/Mon). | [NSE India](https://www.nseindia.com) | 🟢 VERIFIED (Oct 2026) |
| **SENSEX & BANKEX** | Lot sizes: SENSEX (20), BANKEX (15); Expiry: Friday. | [BSE India](https://www.bseindia.com) | 🟢 VERIFIED (Oct 2026) |
| **US Equities** | Regular hours 09:30-16:00 ET; Pre-market 04:00-09:30 ET; After-hours 16:00-20:00 ET. | [NYSE](https://www.nyse.com) | 🟢 VERIFIED |
| **MCX Commodities** | Trading hours 09:00 - 23:30 IST; Gold 10g quote unit. | [MCX India](https://www.mcxindia.com) | 🟢 VERIFIED |
| **Forex & Crypto** | 24/5 FX sessions and 24/7/365 continuous crypto liquidity. | Global interbank / CME | 🟢 VERIFIED |

---

## 3. Marketing Claim Honesty (Zero Fake Proof Audit)

Run a strict codebase audit to confirm zero fabricated claims, fake testimonials, or misleading statistics:

* [x] **No fake user reviews or fake profile pictures.** (All sample reviews are either removed or labeled clearly as sample previews).
* [x] **Sample size gating on statistics:** Win rate, profit factor, and expectancy return `null` and show educational guidance when trade count is &lt;10.
* [x] **No guaranteed profit claims:** All marketing hero copy speaks to &quot;explainable structure&quot;, &quot;invalidation points&quot;, and &quot;risk management&quot;.
* [x] **Mandatory short disclaimer:** Visible on every analysis result and exported graphic.

---

## 4. AI Quality, Evaluation & Quota Controls

| Gate | Target | Current Status | Notes |
|---|---|---|---|
| **Eval Harness (≥30 Charts)** | 100% schema valid; stops strictly on correct side of entry; blurry charts default to `wait`. | 🟢 PASSED | Run `pnpm eval` to verify fixtures. |
| **Cost & Token Tracking** | Every analysis logs prompt tokens, completion tokens, and USD cost. | 🟢 IMPLEMENTED | `src/server/observability/logger.ts` active. |
| **Gemini Budget Alerts** | Set hard billing cap and 50%/80% warning thresholds in Google Cloud Console / AI Studio. | 🟡 FOUNDER ACTION | Set up billing budget alert at $50/day. |
| **Fallback Models** | Primary `gemini-2.0-flash` with graceful backoff retry on 429/503. | 🟢 IMPLEMENTED | Retries with 2s exponential backoff. |

---

## 5. Security & Infrastructure

| Check | Tool / Mechanism | Status |
|---|---|---|
| **File Upload Hardening** | Magic bytes verification (PNG/JPG/WebP/GIF) + 10MB limit. | 🟢 PASS |
| **SSRF Protection** | Strict TradingView `/x/` regex + host whitelist (`s3.tradingview.com`). | 🟢 PASS |
| **Security Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options in `next.config.ts`. | 🟢 PASS |
| **Rate Limiting** | Sliding window rate limit on `/api/analyses` (15 req/min). | 🟢 PASS |
| **Secrets Audit** | No client bundle leaks; all API keys in `.env.local` server-only. | 🟢 PASS |
| **Database Backups** | Supabase daily point-in-time recovery (PITR) enabled. | 🟡 FOUNDER ACTION | Confirm PITR active in Supabase project dashboard. |

---

## 6. Next Immediate Step
* **Prompt 10 (Future):** Swap in real Supabase Auth and Stripe checkout when ready to launch paid processing.
