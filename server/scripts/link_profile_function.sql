-- Run this in Supabase Dashboard > SQL Editor
-- This function migrates an imported profile to a new Google OAuth user ID,
-- preventing duplicate profiles when imported users log in for the first time.

CREATE OR REPLACE FUNCTION public.link_profile_by_email(new_user_id UUID, user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    old_row profiles%ROWTYPE;
BEGIN
    -- Find an existing profile with the same email but a different id
    SELECT * INTO old_row
    FROM profiles
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(user_email))
      AND id != new_user_id
    LIMIT 1;

    IF old_row.id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Copy the old profile data to the new user id
    INSERT INTO profiles (
        id, name, email, college_id, branch,
        codeforces_handle, leetcode_handle, codechef_handle,
        linkedin_url, github_url, skills, resume_url,
        role, is_public, profile_completed, created_at
    ) VALUES (
        new_user_id, old_row.name, old_row.email, old_row.college_id, old_row.branch,
        old_row.codeforces_handle, old_row.leetcode_handle, old_row.codechef_handle,
        old_row.linkedin_url, old_row.github_url, old_row.skills, old_row.resume_url,
        old_row.role, old_row.is_public, old_row.profile_completed, old_row.created_at
    )
    ON CONFLICT (id) DO UPDATE SET
        name              = COALESCE(EXCLUDED.name, profiles.name),
        college_id        = COALESCE(EXCLUDED.college_id, profiles.college_id),
        branch            = COALESCE(EXCLUDED.branch, profiles.branch),
        codeforces_handle = COALESCE(EXCLUDED.codeforces_handle, profiles.codeforces_handle),
        leetcode_handle   = COALESCE(EXCLUDED.leetcode_handle, profiles.leetcode_handle),
        codechef_handle   = COALESCE(EXCLUDED.codechef_handle, profiles.codechef_handle),
        linkedin_url      = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url),
        github_url        = COALESCE(EXCLUDED.github_url, profiles.github_url),
        skills            = COALESCE(EXCLUDED.skills, profiles.skills),
        resume_url        = COALESCE(EXCLUDED.resume_url, profiles.resume_url),
        role              = COALESCE(EXCLUDED.role, profiles.role),
        is_public         = EXCLUDED.is_public,
        profile_completed = EXCLUDED.profile_completed;

    -- Delete the old orphaned profile
    DELETE FROM profiles WHERE id = old_row.id;

    -- Clean up the old orphaned auth user (created by import script)
    DELETE FROM auth.users WHERE id = old_row.id;

    RETURN TRUE;
END;
$$;
