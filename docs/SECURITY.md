# IoSnapChart Security & Compliance Overview

This document outlines the security architecture, data handling safeguards, and threat mitigations implemented across IoSnapChart.

---

## 1. Threat Mitigations & Defenses

### A. File Upload Hardening
* **Size Enforcement:** Maximum 10MB per image, maximum 3 images per multi-timeframe analysis job.
* **Dual-Layer Format Verification:**
  1. Header Content-Type inspection against strict whitelist (`image/jpeg`, `image/png`, `image/webp`).
  2. Binary Magic Bytes signature verification on raw file buffers (checking for PNG `0x89504E47`, JPEG `0xFFD8FF`, and WebP `RIFF...WEBP`). Rejects polyglot exploits and disguised executable scripts.
* **Storage Isolation:** User chart uploads are saved to private Supabase Storage buckets under `{userId}/{analysisId}/img-{N}.jpg`. Direct public bucket listing is disabled.

### B. Server-Side Request Forgery (SSRF) Protection
* **TradingView Snapshot Fetcher:**
  * Only accepts URLs matching strict regex: `^https://www\.tradingview\.com/x/([a-zA-Z0-9]+)/?$`.
  * Arbitrary external URLs, local network IPs (`127.0.0.1`, `localhost`, `10.*`, `192.168.*`, `172.16.*`, `169.254.*`), and non-HTTPS protocols are rejected at the edge.
  * Image CDN resolution strictly verifies hostnames against `s3.tradingview.com` and `*.tradingview.com`.

### C. Rate Limiting & Denial of Service Protection
* Sliding window in-memory rate limiting applied to `POST /api/analyses` and analysis retrieval endpoints (15 requests/minute per IP and authenticated user ID).
* Daily credit and fair-use caps (`canAnalyze` check) prevent abuse of external AI APIs.

### D. Secret Isolation
* `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and billing secrets are strictly server-only environment variables.
* Next.js build bundle is verified to ensure zero leakage of private keys to client bundles.

### E. HTTP Security Headers
Configured globally in `next.config.ts`:
* **Content-Security-Policy (CSP):** Restricts script, style, and connect origins to trusted endpoints.
* **X-Content-Type-Options:** `nosniff` prevents MIME-type sniffing.
* **X-Frame-Options:** `DENY` prevents clickjacking.
* **Referrer-Policy:** `strict-origin-when-cross-origin`.
* **Strict-Transport-Security (HSTS):** `max-age=63072000; includeSubDomains; preload`.
* **Permissions-Policy:** Disables camera, microphone, and geolocation.

### F. Input Validation
* All route parameters and request bodies are strictly parsed using Zod schemas (`src/server/ai/schema.ts`, `src/lib/journal/schema.ts`).
* SQL queries are executed via Supabase parameterised clients with Row Level Security (RLS) enabled on all user tables (`analyses`, `trades`, `journal_days`, `credit_ledger`).

---

## 2. Vulnerability Disclosure & Contact

If you discover a security vulnerability or bug in IoSnapChart, please report it immediately to our security response team:
* **Security Contact:** `security@iosnapchart.com` (or founder email `support@iosnapchart.com`)
* Please do not publicly disclose vulnerabilities until we have had an opportunity to address and patch them.
