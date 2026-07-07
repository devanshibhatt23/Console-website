-- Migration: Remove CodeChef from leaderboard_cache
-- CodeChef was removed because the unofficial proxy API (codechef-api.vercel.app)
-- is unreliable and returns 402 errors when its free Vercel quota is exceeded.

DELETE FROM public.leaderboard_cache WHERE platform = 'codechef';
