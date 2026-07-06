-- 1. Create a security definer function to check admin status
-- This bypasses RLS for the query to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Recreate profiles SELECT policy
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.profiles;
CREATE POLICY "Allow select for authenticated users" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    is_public = true
    OR auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- 3. Recreate profiles UPDATE policy
DROP POLICY IF EXISTS "Allow update for owners or admins" ON public.profiles;
CREATE POLICY "Allow update for owners or admins" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );

-- 4. Clean up and update other table policies to use is_admin() for maximum safety and speed
DROP POLICY IF EXISTS "Allow all for admins" ON public.problems;
CREATE POLICY "Allow all for admins" ON public.problems
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow select for owners or admins" ON public.submissions;
CREATE POLICY "Allow select for owners or admins" ON public.submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow update for owners or admins" ON public.submissions;
CREATE POLICY "Allow update for owners or admins" ON public.submissions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow delete for owners or admins" ON public.comments;
CREATE POLICY "Allow delete for owners or admins" ON public.comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow all for admins" ON public.events;
CREATE POLICY "Allow all for admins" ON public.events
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
