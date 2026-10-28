-- =============================================================================
-- Migration 0004 — Trades & P&L Calendar Journal
-- Replaces old journal_entries table with high-fidelity trade execution records
-- and daily psychological journaling notes.
-- =============================================================================

-- Add settings column to profiles if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'settings'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN settings jsonb NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ── trades ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  analysis_id uuid NULL REFERENCES public.analyses(id) ON DELETE SET NULL,
  trade_date date NOT NULL,
  symbol text NOT NULL,
  market text NULL,
  direction text NULL CHECK (direction IN ('long', 'short')),
  pnl numeric(18,4) NOT NULL,
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
  followed_plan text NULL CHECK (followed_plan IN ('yes', 'partly', 'no')),
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trades_user_date ON public.trades(user_id, trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_user_symbol ON public.trades(user_id, symbol);

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trades: users manage own trades" ON public.trades;
CREATE POLICY "trades: users manage own trades"
  ON public.trades FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── journal_days ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.journal_days (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day date NOT NULL,
  note text NULL,
  mood smallint NULL CHECK (mood BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);

ALTER TABLE public.journal_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journal_days: users manage own days" ON public.journal_days;
CREATE POLICY "journal_days: users manage own days"
  ON public.journal_days FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
