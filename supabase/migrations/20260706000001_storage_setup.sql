-- Create Storage Buckets
-- Creates a private 'resumes' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Creates a public 'event-images' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;


-- Drop existing policies if they exist to support re-running the migration
DROP POLICY IF EXISTS "Allow owners to upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to read their resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to delete their resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete event images" ON storage.objects;

-- 2. Storage Policies for 'resumes' Bucket
-- (Assuming files are uploaded in the format: 'resumes/USER_ID/filename.pdf')

-- Allow users to upload their own resumes
CREATE POLICY "Allow owners to upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view/download their own resumes
CREATE POLICY "Allow owners to read their resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own resumes
CREATE POLICY "Allow owners to delete their resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Storage Policies for 'event-images' Bucket

-- Allow anyone to view event images (since bucket is public)
CREATE POLICY "Allow public read access to event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Only Admins/Super Admins can upload event images
CREATE POLICY "Allow admins to upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Only Admins/Super Admins can delete event images
CREATE POLICY "Allow admins to delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
