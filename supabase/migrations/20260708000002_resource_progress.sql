-- Resource Progress Table
-- Tracks which resources each user has completed

CREATE TABLE IF NOT EXISTS public.resource_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.resource_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can view own progress"
  ON public.resource_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.resource_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress (unchecking)
CREATE POLICY "Users can delete own progress"
  ON public.resource_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Fast lookup index
CREATE INDEX IF NOT EXISTS idx_resource_progress_user ON public.resource_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_resource_progress_user_resource ON public.resource_progress (user_id, resource_id);
