-- =============================================================================
-- Migration 0002 — Credit ledger, auditable transactions, and early access
-- Iosnapchart — Prompt 08: Credits, paywall, pricing
-- =============================================================================

-- ── credit_ledger ────────────────────────────────────────────────────────────
-- Auditable, append-only log of credit deductions, grants, and refunds.
-- Unique on (analysis_id, reason) ensures idempotency per analysis.

CREATE TABLE IF NOT EXISTS credit_ledger (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_id uuid,
  delta       integer NOT NULL,
  reason      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_ledger_analysis_reason_unique UNIQUE (analysis_id, reason)
);

CREATE INDEX IF NOT EXISTS credit_ledger_user_id_idx    ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS credit_ledger_analysis_id_idx ON credit_ledger(analysis_id);
CREATE INDEX IF NOT EXISTS credit_ledger_created_at_idx ON credit_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS credit_ledger_daily_usage_idx ON credit_ledger(user_id, reason, created_at);

ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credit_ledger: users read their own rows" ON credit_ledger;
CREATE POLICY "credit_ledger: users read their own rows"
  ON credit_ledger FOR SELECT
  USING (user_id = auth.uid());

-- ── early_access ─────────────────────────────────────────────────────────────
-- Captures waitlist emails when users attempt checkout before Stripe is live.

CREATE TABLE IF NOT EXISTS early_access (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email          text NOT NULL,
  plan_interest  text,
  consent        boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS early_access_email_idx ON early_access(email);
CREATE INDEX IF NOT EXISTS early_access_created_at_idx ON early_access(created_at DESC);

ALTER TABLE early_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "early_access: anyone can insert" ON early_access;
CREATE POLICY "early_access: anyone can insert"
  ON early_access FOR INSERT
  WITH CHECK (true);
