-- 1. Make the date column nullable in public.problems to allow pre-loading a pool of unscheduled questions
ALTER TABLE public.problems ALTER COLUMN date DROP NOT NULL;

-- 2. Create the assign_today_potd RPC function
-- This automatically selects the oldest unassigned problem at midnight and links it to today's date
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
    SET date = today_date 
    WHERE id = selected_id;
    
    RETURN QUERY SELECT * FROM public.problems WHERE id = selected_id;
  ELSE
    -- No unassigned problems left in the database pool
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
