-- Create event_images table to store multiple photos per event
CREATE TABLE IF NOT EXISTS public.event_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to support clean migration runs)
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.event_images;
DROP POLICY IF EXISTS "Allow all for admins" ON public.event_images;

-- RLS Policies
CREATE POLICY "Allow select for all authenticated users" ON public.event_images
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow all for admins" ON public.event_images
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Notify postgrest to reload the schema
NOTIFY pgrst, 'reload schema';
