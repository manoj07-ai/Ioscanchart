-- =============================================================================
-- Migration 0003 — Soft delete for analyses & Academy lesson progress
-- Iosnapchart — Prompt 07: History, Journal, Academy, Settings
-- =============================================================================

-- ── analyses soft-delete ─────────────────────────────────────────────────────
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
CREATE INDEX IF NOT EXISTS analyses_deleted_at_idx ON analyses(deleted_at);

-- ── lesson_progress ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  completed   boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lesson_progress_user_slug_unique UNIQUE (user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_id_idx ON lesson_progress(user_id);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_progress: users own their rows" ON lesson_progress;
CREATE POLICY "lesson_progress: users own their rows"
  ON lesson_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
