-- The three tables this service uses.
--
-- They were created by hand on the server and existed nowhere in this
-- repository until 2026-10-01, which meant a second deployment had no way to
-- stand itself up and no record of what the columns were. Everything here is
-- safe to re-run.

-- One row per username ever rendered with the counter.
CREATE TABLE IF NOT EXISTS github_profile_views (
  username        text PRIMARY KEY,
  views           bigint      NOT NULL DEFAULT 0,
  last_viewed_at  timestamptz NOT NULL DEFAULT now()
);

-- One row per counter request. `ip_hash` is a salted SHA-256 prefix and is
-- NULL unless IP_HASH_SALT is set: see hashVisitorIp in lib/utils.ts for why
-- an unsalted hash of an address is not anonymisation.
CREATE TABLE IF NOT EXISTS github_view_logs (
  id          bigserial PRIMARY KEY,
  username    text        NOT NULL,
  ip_hash     text,
  user_agent  text,
  referrer    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS github_view_logs_username_idx ON github_view_logs (username, created_at DESC);

-- The one-hour response cache. `expires_at` is read on every lookup, so an
-- expired row is simply never returned; pruning is housekeeping, not
-- correctness.
CREATE TABLE IF NOT EXISTS github_stats_cache (
  cache_key   text PRIMARY KEY,
  data        jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS github_stats_cache_expires_idx ON github_stats_cache (expires_at);
