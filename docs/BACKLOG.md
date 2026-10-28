# BACKLOG.md

Tracked items that need follow-up. Add items during development; resolve before major releases.

Format:
```
- [ ] [AREA] Description — added by: Prompt XX / date
```

---

## Open Items

- [ ] [AUTH] Swap mock `getCurrentUser()` for real Supabase Auth — tracked in Prompt 10
- [ ] [BILLING] Integrate Stripe for Monthly/Lifetime plans — tracked in Prompt 10
- [ ] [BILLING] Lifetime-Plan Fairness & LLM Cost Exposure (Prompt 08): Define 'lifetime' explicitly as the commercial operating lifetime of the Iosnapchart SaaS product. Uncapped lifetime access exposes the business to unbounded Gemini vision API token expenses ($0.001–$0.01+ per multi-timeframe chart run). Mitigation strategy: Enforce a strict daily fair-use cap (currently 50 analyses/day) enforced in code via `credit_ledger` and `canAnalyze()`, state this cap visibly in pricing copy and Terms of Service, and retain the right to suspend accounts attempting automated headless scraping.
- [ ] [LEGAL] Founder: get legal review of SEBI research-analyst / investment-adviser rules before Indian launch — see `docs/QUESTIONS.md`
- [ ] [LEGAL] Founder: confirm exact USD prices for Monthly ($39) and Lifetime ($179) before enabling checkout
- [ ] [INFRA] Replace hand-written `supabase/types.ts` with `supabase gen types typescript --local` output after migrations run
- [ ] [STORAGE] Add virus/malware scanning to uploaded images (ClamAV or 3rd party) before GA launch
- [ ] [PERF] Add Redis/Upstash rate limiting on `/api/analyse` once traffic grows
- [ ] [ANALYTICS] Choose a GDPR-compliant analytics provider (Plausible/Fathom) — currently using internal `events` table only
- [ ] [A11Y] Conduct full WCAG AA audit before launch
- [ ] [INDIA-OPTIONS] Refine option-chain prompt with real OI/PCR data examples once beta feedback is in
- [ ] [MARKETS] Promote india-* packs from 'beta' to 'full' after QA pass with real charts
- [ ] [DOCS] Add architecture diagram to docs/
- [ ] [TESTS] Add Playwright e2e smoke tests for upload → result flow (Prompt 09)
- [ ] [SEO] Set canonical URLs and OG images for all marketing pages (Prompt 09)
- [ ] [AI-PRICING] Fill real token prices in `src/config/ai-pricing.ts` from Google AI Studio (https://ai.google.dev/pricing). Current: placeholder prices set to 0.
