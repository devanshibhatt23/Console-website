-- Migration: Add leaderboard_cache table for persistent caching
-- This stores the pre-computed leaderboard JSON from external APIs (CF, LC, CC)
-- so that server restarts don't cause cold-start API calls.

CREATE TABLE public.leaderboard_cache (
  platform TEXT PRIMARY KEY,               -- 'codeforces' | 'leetcode_rating' | 'leetcode_questions' | 'codechef'
  data JSONB NOT NULL DEFAULT '[]',         -- Array of leaderboard entries stored as JSON
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed the table with empty rows for each platform,
-- so the server can always do an UPDATE instead of INSERT.
INSERT INTO public.leaderboard_cache (platform, data) VALUES
  ('codeforces', '[]'),
  ('leetcode_rating', '[]'),
  ('leetcode_questions', '[]'),
  ('codechef', '[]');

-- This table is only ever written to by the backend server using the Service Role Key.
-- The anon/public role should only be able to read it.
ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (even unauthenticated users) can read the cache to view the leaderboard.
CREATE POLICY "Allow public read access to leaderboard cache"
  ON public.leaderboard_cache FOR SELECT
  USING (true);

-- Policy: Only the service role (server) can update the cache. No direct client writes allowed.
-- (Service Role bypasses RLS by default, so no explicit policy is needed for the server,
-- but we explicitly block non-service authenticated users from writing.)
CREATE POLICY "Disallow client writes to leaderboard cache"
  ON public.leaderboard_cache FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Disallow client updates to leaderboard cache"
  ON public.leaderboard_cache FOR UPDATE
  USING (false);
