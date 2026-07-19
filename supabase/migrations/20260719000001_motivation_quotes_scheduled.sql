-- Migration: Motivation Quotes Scheduled Date

-- 1. Add scheduled_date column to allow admins to lock quotes to a specific day
ALTER TABLE public.motivation_quotes ADD COLUMN IF NOT EXISTS scheduled_date DATE;

-- 2. Add an index for faster lookups when querying for today's quote
CREATE INDEX IF NOT EXISTS idx_motivation_quotes_scheduled_date ON public.motivation_quotes(scheduled_date);
