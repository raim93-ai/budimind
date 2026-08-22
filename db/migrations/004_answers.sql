-- Migration 004: per-question answer storage
-- `answers` snapshots each question's text alongside the chosen value so any
-- historical result can be rendered question-by-question even if instruments
-- are revised later.
-- Format: [{"i":0,"q":"Question text...","v":2}, ...]

ALTER TABLE assessment_responses ADD COLUMN answers TEXT;

-- Backfill existing rows from the stored responses arrays using the current
-- instrument definitions is done in application space (needs TS scoring defs);
-- rows submitted after this migration always include answers.
