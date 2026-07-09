-- Migration: Support POTD Leaderboard
-- 1. Add platform and posted_at columns to problems table
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('codeforces', 'leetcode'));
ALTER TABLE public.problems ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- 2. Backfill platform from existing problem link (solution)
UPDATE public.problems 
SET platform = 'leetcode' 
WHERE platform IS NULL AND solution LIKE '%leetcode.com%';

UPDATE public.problems 
SET platform = 'codeforces' 
WHERE platform IS NULL AND solution LIKE '%codeforces.com%';

-- 3. Backfill posted_at for existing records
UPDATE public.problems 
SET posted_at = created_at;

-- 4. Clean up duplicate submissions (keeping Correct first, then latest submission_time)
DELETE FROM public.submissions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY user_id, problem_id 
      ORDER BY 
        CASE WHEN status = 'Correct' THEN 1 ELSE 2 END ASC, 
        submission_time DESC
    ) as rnum
    FROM public.submissions
  ) t
  WHERE t.rnum > 1
);

-- 5. Add unique constraint to prevent future duplicates
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS unique_user_problem;
ALTER TABLE public.submissions ADD CONSTRAINT unique_user_problem UNIQUE (user_id, problem_id);

-- 6. Seed the cache table for POTD leaderboard
INSERT INTO public.leaderboard_cache (platform, data)
VALUES ('potd', '[]')
ON CONFLICT (platform) DO NOTHING;

-- 7. Update assign_today_potd to set posted_at to the moment of assignment
CREATE OR REPLACE FUNCTION public.assign_today_potd(today_date DATE)
RETURNS SETOF public.problems AS $$
DECLARE
  selected_id UUID;
BEGIN
  -- Check if a problem is already assigned to the target date
  SELECT id INTO selected_id FROM public.problems WHERE date = today_date LIMIT 1;
  
  -- If yes, return the existing problem
  IF selected_id IS NOT NULL THEN
    RETURN QUERY SELECT * FROM public.problems WHERE id = selected_id;
    RETURN;
  END IF;

  -- Otherwise, atomically query the oldest unassigned question (date IS NULL)
  -- Using FOR UPDATE SKIP LOCKED locks the row, preventing concurrent updates by other users loading at midnight
  SELECT id INTO selected_id 
  FROM public.problems 
  WHERE date IS NULL 
  ORDER BY created_at ASC
  LIMIT 1 
  FOR UPDATE SKIP LOCKED;

  -- If an unassigned problem exists, assign it to today's date and return it
  IF selected_id IS NOT NULL THEN
    UPDATE public.problems 
    SET date = today_date,
        posted_at = NOW()
    WHERE id = selected_id;
    
    RETURN QUERY SELECT * FROM public.problems WHERE id = selected_id;
  ELSE
    -- No unassigned problems left in the database pool
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
