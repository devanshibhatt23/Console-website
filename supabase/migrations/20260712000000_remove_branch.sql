ALTER TABLE public.profiles DROP COLUMN IF EXISTS branch;

-- Fix any user whose college_id was incorrectly set to their full email
UPDATE public.profiles
SET college_id = SUBSTRING(email FROM 1 FOR 11)
WHERE email IS NOT NULL AND (college_id IS NULL OR length(college_id) > 11 OR college_id LIKE '%@%');
