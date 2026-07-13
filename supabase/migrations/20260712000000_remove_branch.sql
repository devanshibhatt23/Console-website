ALTER TABLE public.profiles DROP COLUMN IF EXISTS branch;

-- Fix any user whose college_id was incorrectly set to their full email
UPDATE public.profiles
SET college_id = SUBSTRING(email FROM 1 FOR 11)
WHERE email IS NOT NULL AND (college_id IS NULL OR length(college_id) > 11 OR college_id LIKE '%@%');

-- Update storage RLS policies to allow all authenticated users to read resumes
-- (Necessary so that other members can view/download a developer's resume)
DROP POLICY IF EXISTS "Allow owners to read their resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated users to read resumes" ON storage.objects;

CREATE POLICY "Allow all authenticated users to read resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
);
