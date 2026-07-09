-- Extend resources table with domain, week, ordering, and type fields
-- This migration adds metadata needed for Track Mode and Library Mode

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS domain TEXT,
  ADD COLUMN IF NOT EXISTS week_number INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS order_in_week INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'article' CHECK (type IN ('video', 'article', 'exercise', 'tool', 'docs'));

-- Index for fast domain queries
CREATE INDEX IF NOT EXISTS idx_resources_domain ON public.resources (domain);
CREATE INDEX IF NOT EXISTS idx_resources_domain_week ON public.resources (domain, week_number, order_in_week);

-- Backfill existing rows: set domain = category if domain is null
UPDATE public.resources SET domain = category WHERE domain IS NULL;
