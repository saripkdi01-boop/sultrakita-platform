-- Canonical seller verification state. Additive and safe to run repeatedly.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS verification_status text;
UPDATE public.users SET verification_status = CASE
  WHEN verification_status IN ('unverified','pending','approved','rejected','suspended') THEN verification_status
  WHEN COALESCE(is_verified, 0) <> 0 THEN 'approved'
  ELSE 'unverified'
END WHERE verification_status IS NULL OR verification_status NOT IN ('unverified','pending','approved','rejected','suspended');
ALTER TABLE public.users ALTER COLUMN verification_status SET DEFAULT 'unverified';
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE public.users ADD CONSTRAINT users_verification_status_check CHECK (verification_status IN ('unverified','pending','approved','rejected','suspended'));
CREATE INDEX IF NOT EXISTS users_verification_status_idx ON public.users(verification_status);
COMMENT ON COLUMN public.users.verification_status IS 'Canonical seller verification state; is_verified is retained only for backward compatibility.';
