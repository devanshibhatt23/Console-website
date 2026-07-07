-- Restrict user creation to only @mnit.ac.in emails

CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@mnit.ac.in' THEN
    RAISE EXCEPTION 'Only @mnit.ac.in emails are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS check_email_domain_trigger ON auth.users;

CREATE TRIGGER check_email_domain_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_email_domain();
