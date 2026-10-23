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
