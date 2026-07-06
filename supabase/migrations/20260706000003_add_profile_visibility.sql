-- 1. Add is_public column to public.profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- 2. Drop existing SELECT policy to recreate it
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.profiles;

-- 3. Create updated SELECT policy that respects privacy settings
CREATE POLICY "Allow select for authenticated users" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    is_public = true
    OR auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
