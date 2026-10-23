-- =============================================================================
-- Migration 0001 — Initial schema
-- Iosnapchart — https://iosnapchart.com
--
-- How to run:
--   Option A (Supabase CLI): supabase db push
--   Option B (SQL editor): paste into Supabase Dashboard → SQL Editor → Run
--
-- This migration is idempotent: all tables/types use IF NOT EXISTS.
-- RLS is enabled on all tables; policies enforce user_id = auth.uid().
-- (During dev with mocked auth, the service-role key bypasses RLS — see docs/SETUP.md)
-- =============================================================================

-- ── Custom Enum Types ──────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('demo', 'monthly', 'lifetime');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE analysis_status AS ENUM ('queued', 'reading', 'done', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE input_type AS ENUM ('image', 'tv_link');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE journal_outcome AS ENUM ('win', 'loss', 'breakeven', 'skipped');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── profiles ──────────────────────────────────────────────────────────────
-- One row per user. Created on first sign-in (or manually in dev).

CREATE TABLE IF NOT EXISTS profiles (
  id           uuid PRIMARY KEY,  -- matches auth.users.id
  display_name text,
  plan         plan_type NOT NULL DEFAULT 'demo',
  credits      integer   NOT NULL DEFAULT 1 CHECK (credits >= 0),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: users own their row" ON profiles;
CREATE POLICY "profiles: users own their row"
  ON profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── analyses ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analyses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status         analysis_status NOT NULL DEFAULT 'queued',
  market_pack    text,
  instrument     text,
  timeframe      text,
  input_type     input_type NOT NULL DEFAULT 'image',
  created_at     timestamptz NOT NULL DEFAULT now(),
  completed_at   timestamptz,
  result         jsonb,
  model          text,
  prompt_version text,
  latency_ms     integer,
  cost_usd       numeric(10, 6),
  error          text
);

CREATE INDEX IF NOT EXISTS analyses_user_id_idx      ON analyses(user_id);
CREATE INDEX IF NOT EXISTS analyses_status_idx       ON analyses(status);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx   ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_market_pack_idx  ON analyses(market_pack);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analyses: users own their rows" ON analyses;
CREATE POLICY "analyses: users own their rows"
  ON analyses FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── analysis_images ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analysis_images (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id     uuid NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  storage_path    text NOT NULL,  -- path inside the 'charts' storage bucket
  timeframe_label text,           -- e.g. '1D', '1H', '5m'
  width           integer,
  height          integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analysis_images_analysis_id_idx ON analysis_images(analysis_id);

ALTER TABLE analysis_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analysis_images: users own via analysis" ON analysis_images;
CREATE POLICY "analysis_images: users own via analysis"
  ON analysis_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM analyses a
      WHERE a.id = analysis_images.analysis_id
        AND a.user_id = auth.uid()
    )
  );

-- ── journal_entries ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS journal_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_id uuid REFERENCES analyses(id) ON DELETE SET NULL,
  outcome     journal_outcome NOT NULL,
  r_multiple  numeric(6, 2),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx    ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_analysis_id_idx ON journal_entries(analysis_id);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON journal_entries(created_at DESC);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journal_entries: users own their rows" ON journal_entries;
CREATE POLICY "journal_entries: users own their rows"
  ON journal_entries FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── lessons ───────────────────────────────────────────────────────────────
-- Public read; admin-only write (enforced at app layer for now).

CREATE TABLE IF NOT EXISTS lessons (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  title      text NOT NULL,
  body_md    text NOT NULL,
  "order"    integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_order_idx ON lessons("order");

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons: public read" ON lessons;
CREATE POLICY "lessons: public read"
  ON lessons FOR SELECT
  USING (true);

-- ── events ────────────────────────────────────────────────────────────────
-- Lightweight product analytics log; append-only at app layer.

CREATE TABLE IF NOT EXISTS events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  props      jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_user_id_idx    ON events(user_id);
CREATE INDEX IF NOT EXISTS events_name_idx       ON events(name);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events: users own their rows" ON events;
CREATE POLICY "events: users own their rows"
  ON events FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Billing RPC Functions ─────────────────────────────────────────────────
-- Transactional credit debit/refund used by src/server/billing/index.ts

CREATE OR REPLACE FUNCTION consume_credit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
BEGIN
  SELECT credits INTO current_credits
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;  -- row-level lock prevents race conditions

  IF current_credits IS NULL OR current_credits <= 0 THEN
    RETURN false;
  END IF;

  UPDATE profiles
  SET credits = credits - 1
  WHERE id = p_user_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION refund_credit(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + 1
  WHERE id = p_user_id;
END;
$$;
