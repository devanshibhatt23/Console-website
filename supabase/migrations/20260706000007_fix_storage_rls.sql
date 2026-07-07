-- Update storage RLS policies to use native owner column instead of string matching

-- 1. Drop the old flaky policies
DROP POLICY IF EXISTS "Allow owners to upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to read their resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to delete their resumes" ON storage.objects;

-- 2. Create foolproof policies using the native owner UUID
CREATE POLICY "Allow owners to upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid() = owner
);

CREATE POLICY "Allow owners to read their resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND auth.uid() = owner
);

CREATE POLICY "Allow owners to delete their resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND auth.uid() = owner
);

-- Notify postgrest to reload the schema cache so changes take effect immediately
NOTIFY pgrst, 'reload schema';
