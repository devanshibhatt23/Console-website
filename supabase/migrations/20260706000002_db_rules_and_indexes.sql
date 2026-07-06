-- 1. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_problems_date ON public.problems(date);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON public.submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at);

-- 2. Domain restriction for new users
CREATE OR REPLACE FUNCTION public.check_user_email_domain()
RETURNS trigger AS $$
BEGIN
  -- Restrict registration to @mnit.ac.in email addresses
  IF NEW.email NOT LIKE '%@mnit.ac.in' THEN
    RAISE EXCEPTION 'Registration is restricted to official college emails (@mnit.ac.in) only.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_email_domain_signup ON auth.users;
CREATE TRIGGER enforce_email_domain_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.check_user_email_domain();

-- 3. Row Level Security Policies for Database Tables
-- Drop existing policies to prevent conflicts when re-running
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Allow update for owners or admins" ON public.profiles;
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.problems;
DROP POLICY IF EXISTS "Allow all for admins" ON public.problems;
DROP POLICY IF EXISTS "Allow select for owners or admins" ON public.submissions;
DROP POLICY IF EXISTS "Allow insert for owners" ON public.submissions;
DROP POLICY IF EXISTS "Allow update for owners or admins" ON public.submissions;
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.comments;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.comments;
DROP POLICY IF EXISTS "Allow delete for owners or admins" ON public.comments;
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.events;
DROP POLICY IF EXISTS "Allow all for admins" ON public.events;
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON public.resources;
DROP POLICY IF EXISTS "Allow all for admins" ON public.resources;

-- Profiles Policies
CREATE POLICY "Allow select for authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow update for owners or admins" ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Problems Policies (POTD)
CREATE POLICY "Allow select for all authenticated users" ON public.problems
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow all for admins" ON public.problems
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Submissions Policies
CREATE POLICY "Allow select for owners or admins" ON public.submissions
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Allow insert for owners" ON public.submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for owners or admins" ON public.submissions
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Comments Policies
CREATE POLICY "Allow select for all authenticated users" ON public.comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated users" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow delete for owners or admins" ON public.comments
  FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Events Policies
CREATE POLICY "Allow select for all authenticated users" ON public.events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow all for admins" ON public.events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Resources Policies
CREATE POLICY "Allow select for all authenticated users" ON public.resources
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow all for admins" ON public.resources
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 4. Enable Realtime Replication for Comments table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Ensure the table is not already in the publication
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    END IF;
  END IF;
END;
$$;
