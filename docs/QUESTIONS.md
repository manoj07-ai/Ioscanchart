# QUESTIONS.md

Open questions for the founder. Do NOT resolve these without founder input.
Format: `[STATUS] Question — added Prompt XX`

---

## 🔴 Blocking (need answer before launch)

- [ ] **[LEGAL/INDIA]** SEBI Research Analyst (RA) and Investment Adviser (IA) regulations: does offering chart-based "educational analysis" to Indian users require RA/IA registration? Founder to get a lawyer's review before launch. Current copy is framed as "educational technical analysis of the chart you provide" — keep it that way until legal gives a green light. — *Prompt 01*

- [ ] **[LEGAL/GLOBAL]** Similar question for other regulated markets (UK FCA, MAS Singapore, ASIC Australia) once international marketing begins. — *Prompt 01*

- [ ] **[PRICING]** Confirm final USD prices: Monthly = \$39/mo, Lifetime = \$179 one-time? These are placeholders in `src/config/plans.ts`. — *Prompt 01*

## 🟡 Non-blocking (resolve before post-launch marketing)

- [ ] **[BRAND]** Confirm product name "Iosnapchart" is final and trademark-clear before spending on marketing assets. — *Prompt 01*

- [ ] **[TESTIMONIALS]** When do we have real, consented testimonials to replace `<TestimonialPlaceholder />` components? — *Prompt 03*

- [ ] **[INDIA-OPTIONS]** Are lot sizes / expiry schedules in the `india-options` market pack current? Verify against current NSE circulars before launch. — *Prompt 04*

- [ ] **[DAILY-CAP]** Is 50 analyses/day the right soft cap for Monthly/Lifetime? Revisit once we know average LLM cost per analysis. — *Prompt 01*

- [ ] **[JOURNAL/CURRENCY]** Default currency for new users: proceed with infer from locale, fallback USD. — *Prompt 12*
- [ ] **[JOURNAL/PUBLIC-LINKS]** Allow public shareable links to a user's calendar? Default: no (image export only to avoid fake-proof abuse). — *Prompt 12*
- [ ] **[JOURNAL/GUEST-IMPORT]** Should guest-mode local trades auto-import after signup? Default: yes, with a confirmation step. — *Prompt 12*
- [ ] **[JOURNAL/CALENDAR-WEEKENDS]** Keep Mon–Fri as default calendar view? Default: Mon–Fri, with toggle for 7-day view and auto-enable when user trades crypto/weekends. — *Prompt 12*

## ✅ Resolved

*(none yet)*
