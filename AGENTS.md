<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Architecture & Specifications

## §6. Data Model: Trades & Journal

### `trades` table
Stores individual executions for both manual trades and AI-assisted setups.
```sql
CREATE TABLE IF NOT EXISTS public.trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  analysis_id uuid NULL REFERENCES public.analyses(id) ON DELETE SET NULL,
  trade_date date NOT NULL,                 -- DATE ONLY YYYY-MM-DD, no timezone shift
  symbol text NOT NULL,
  market text NULL,                         -- market pack id
  direction text NULL CHECK (direction IN ('long','short')),
  pnl numeric(18,4) NOT NULL,               -- signed, in currency
  currency text NOT NULL DEFAULT 'USD',
  r_multiple numeric(8,3) NULL,
  entry_price numeric(18,6) NULL,
  exit_price numeric(18,6) NULL,
  quantity numeric(18,6) NULL,
  multiplier numeric(12,4) NOT NULL DEFAULT 1,
  fees numeric(18,4) NOT NULL DEFAULT 0,
  risk_amount numeric(18,4) NULL,
  setup_tags text[] NOT NULL DEFAULT '{}',
  mistake_tags text[] NOT NULL DEFAULT '{}',
  followed_plan text NULL CHECK (followed_plan IN ('yes','partly','no')),
  note text NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON public.trades(user_id, trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_user_symbol ON public.trades(user_id, symbol);
```

### `journal_days` table
Stores daily reflections and psychological notes:
```sql
CREATE TABLE IF NOT EXISTS public.journal_days (
  user_id uuid NOT NULL,
  day date NOT NULL,
  note text NULL,
  mood smallint NULL CHECK (mood BETWEEN 1 AND 5),
  PRIMARY KEY (user_id, day)
);
```

Settings are stored in `profiles.settings jsonb`: `{ currency, weekStart: 0|1, showWeekends: boolean, privacyBlur: boolean, defaultView: 'pnl'|'r' }`.

## §7. Journal Experience & SEO Routes

### `/app/journal` (Authenticated P&L Calendar Journal)
- Stats Strip: Net P&L, Win Rate (gated at >=10 trades), Profit Factor, Avg Win/Loss, Best Day, Trade count.
- Running Equity Curve: area chart with zero baseline, range chips (Month / 3M / YTD / All).
- Month Calendar: rounded day cells tinted green/red by daily net with glyphs (`▲/▼`), 3-step intensity, week summary column, monthly P&L header.
- Add-Trade Card: quick row + accordion (direction, fills, multiplier, plan adherence, analysis link).
- Trade Log: daily grouped execution history with 6-second undo.
- Insights: sortable breakdowns across Weekday, Symbol, Setup, Mistakes, Plan Adherence, and Market.

### Public & Guest SEO Journal Routes
- `/trading-journal`: Pillar landing page (>=1,200 words, FAQ JSON-LD, sample preview).
- `/tools/trading-journal`: Guest-mode interactive tool (browser storage, no login required).
- `/trading-journal/[market]`: Forex, Crypto, Stocks, Options, Futures, Nifty & Bank Nifty.
- `/downloads/trading-journal-template.csv`: Standard CSV template.
- `/blog/...`: Educational journaling and expectancy guides.

