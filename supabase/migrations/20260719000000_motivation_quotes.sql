-- Migration: Motivation Quotes System
-- Users can submit quotes, admins approve them, and one random approved quote is shown daily on POTD page.

-- 1. Create motivation_quotes table
CREATE TABLE IF NOT EXISTS public.motivation_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- 2. Enable RLS
ALTER TABLE public.motivation_quotes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone authenticated can read approved quotes
CREATE POLICY "Anyone can read approved quotes"
  ON public.motivation_quotes FOR SELECT
  USING (status = 'approved');

-- Authenticated users can read their own quotes (any status)
CREATE POLICY "Users can read own quotes"
  ON public.motivation_quotes FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own quotes
CREATE POLICY "Users can submit quotes"
  ON public.motivation_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all quotes (for moderation)
CREATE POLICY "Admins can read all quotes"
  ON public.motivation_quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update quote status (approve/reject)
CREATE POLICY "Admins can update quotes"
  ON public.motivation_quotes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_motivation_quotes_status ON public.motivation_quotes(status);
CREATE INDEX IF NOT EXISTS idx_motivation_quotes_user_id ON public.motivation_quotes(user_id);

-- 5. Seed a few default quotes so the page isn't empty on first load
INSERT INTO public.motivation_quotes (user_id, quote, author_name, status, approved_at)
SELECT 
  (SELECT id FROM public.profiles LIMIT 1),
  q.quote,
  q.author_name,
  'approved',
  NOW()
FROM (VALUES
  ('The best way to master algorithms is to solve them consistently.', 'Console Club'),
  ('First, solve the problem. Then, write the code.', 'John Johnson'),
  ('Code is like humor. When you have to explain it, it''s bad.', 'Cory House'),
  ('Simplicity is the soul of efficiency.', 'Austin Freeman'),
  ('Talk is cheap. Show me the code.', 'Linus Torvalds'),
  ('Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', 'Martin Fowler'),
  ('The only way to learn a new programming language is by writing programs in it.', 'Dennis Ritchie'),
  ('Programs must be written for people to read, and only incidentally for machines to execute.', 'Harold Abelson')
) AS q(quote, author_name)
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1);
