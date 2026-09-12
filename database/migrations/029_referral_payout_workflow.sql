-- Affiliate payout workflow: additive production migration.
-- Operators are authorized from auth.jwt().app_metadata.role; no client table access.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL AND to_regclass('public.referral_account_redemptions') IS NOT NULL THEN
    EXECUTE $sql$
      ALTER TABLE public.referral_account_redemptions
        ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
        ADD COLUMN IF NOT EXISTS payment_reference TEXT,
        ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

      CREATE INDEX IF NOT EXISTS referral_redemptions_status_created_idx
        ON public.referral_account_redemptions(status, created_at DESC);
      CREATE INDEX IF NOT EXISTS referral_redemptions_reviewed_by_idx
        ON public.referral_account_redemptions(reviewed_by, reviewed_at DESC);

      CREATE TABLE IF NOT EXISTS public.referral_redemption_audit_logs (
        id BIGSERIAL PRIMARY KEY,
        redemption_id BIGINT NOT NULL REFERENCES public.referral_account_redemptions(id) ON DELETE CASCADE,
        actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
        from_status TEXT NOT NULL CHECK (from_status IN ('pending','approved','paid','rejected')),
        to_status TEXT NOT NULL CHECK (to_status IN ('pending','approved','paid','rejected')),
        note TEXT,
        payment_reference TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS referral_redemption_audit_redemption_idx
        ON public.referral_redemption_audit_logs(redemption_id, created_at DESC);

      ALTER TABLE public.referral_redemption_audit_logs ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS referral_redemption_audit_no_client_access ON public.referral_redemption_audit_logs;
      CREATE POLICY referral_redemption_audit_no_client_access
        ON public.referral_redemption_audit_logs FOR ALL USING (false) WITH CHECK (false);

      CREATE OR REPLACE FUNCTION public.referral_is_payout_operator()
      RETURNS BOOLEAN
      LANGUAGE sql
      STABLE
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
        SELECT COALESCE((auth.jwt()->'app_metadata'->>'role') IN ('super_admin','admin','finance','payout_operator'), false);
      $fn$;

      CREATE OR REPLACE FUNCTION public.list_referral_payouts(p_status TEXT DEFAULT 'pending')
      RETURNS TABLE(
        id BIGINT, points INTEGER, rupiah_amount INTEGER, status TEXT,
        payout_method TEXT, payout_account_masked TEXT, created_at TIMESTAMPTZ,
        reviewed_at TIMESTAMPTZ, reviewed_by UUID, rejection_reason TEXT,
        payment_reference TEXT, paid_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      BEGIN
        IF NOT public.referral_is_payout_operator() THEN RAISE EXCEPTION 'payout operator authorization required'; END IF;
        IF p_status IS NULL OR p_status NOT IN ('pending','approved','paid','rejected','all') THEN RAISE EXCEPTION 'invalid payout status'; END IF;
        RETURN QUERY
          SELECT r.id, r.points, r.rupiah_amount, r.status,
                 r.payout_method, r.payout_account_masked, r.created_at,
                 r.reviewed_at, r.reviewed_by, r.rejection_reason,
                 r.payment_reference, r.paid_at, r.updated_at
          FROM public.referral_account_redemptions r
          WHERE p_status = 'all' OR r.status = p_status
          ORDER BY r.created_at ASC
          LIMIT 200;
      END;
      $fn$;

      CREATE OR REPLACE FUNCTION public.transition_referral_payout(
        p_redemption_id BIGINT,
        p_to_status TEXT,
        p_note TEXT DEFAULT NULL,
        p_payment_reference TEXT DEFAULT NULL
      )
      RETURNS TABLE(id BIGINT, status TEXT, reviewed_at TIMESTAMPTZ, paid_at TIMESTAMPTZ)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE
        v_current public.referral_account_redemptions%ROWTYPE;
        v_actor UUID := auth.uid();
        v_note TEXT := NULLIF(left(trim(COALESCE(p_note, '')), 500), '');
        v_reference TEXT := NULLIF(left(trim(COALESCE(p_payment_reference, '')), 160), '');
      BEGIN
        IF NOT public.referral_is_payout_operator() OR v_actor IS NULL THEN RAISE EXCEPTION 'payout operator authorization required'; END IF;
        IF p_to_status IS NULL OR p_to_status NOT IN ('approved','paid','rejected') THEN RAISE EXCEPTION 'invalid payout transition'; END IF;
        SELECT * INTO v_current FROM public.referral_account_redemptions WHERE id = p_redemption_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'payout not found'; END IF;
        IF v_current.status = 'pending' AND p_to_status NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'pending payout must be approved or rejected'; END IF;
        IF v_current.status = 'approved' AND p_to_status NOT IN ('paid','rejected') THEN RAISE EXCEPTION 'approved payout must be paid or rejected'; END IF;
        IF v_current.status IN ('paid','rejected') THEN RAISE EXCEPTION 'terminal payout status'; END IF;
        IF p_to_status = 'rejected' AND v_note IS NULL THEN RAISE EXCEPTION 'rejection reason required'; END IF;
        IF p_to_status = 'paid' AND v_reference IS NULL THEN RAISE EXCEPTION 'payment reference required'; END IF;
        IF p_to_status = 'paid' AND v_current.reviewed_by IS NOT NULL AND v_current.reviewed_by = v_actor THEN RAISE EXCEPTION 'second operator required for payment'; END IF;

        UPDATE public.referral_account_redemptions
        SET status = p_to_status,
            reviewed_by = CASE WHEN p_to_status IN ('approved','rejected') THEN v_actor ELSE reviewed_by END,
            reviewed_at = CASE WHEN p_to_status IN ('approved','rejected') THEN now() ELSE reviewed_at END,
            rejection_reason = CASE WHEN p_to_status = 'rejected' THEN v_note ELSE rejection_reason END,
            payment_reference = CASE WHEN p_to_status = 'paid' THEN v_reference ELSE payment_reference END,
            paid_at = CASE WHEN p_to_status = 'paid' THEN now() ELSE paid_at END,
            updated_at = now()
        WHERE id = p_redemption_id;

        INSERT INTO public.referral_redemption_audit_logs(redemption_id, actor_id, from_status, to_status, note, payment_reference)
        VALUES (p_redemption_id, v_actor, v_current.status, p_to_status, v_note, v_reference);
        RETURN QUERY SELECT r.id, r.status, r.reviewed_at, r.paid_at
          FROM public.referral_account_redemptions r WHERE r.id = p_redemption_id;
      END;
      $fn$;

      REVOKE ALL ON FUNCTION public.referral_is_payout_operator() FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.list_referral_payouts(TEXT) FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.transition_referral_payout(BIGINT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.referral_is_payout_operator() TO authenticated, service_role;
      GRANT EXECUTE ON FUNCTION public.list_referral_payouts(TEXT) TO authenticated, service_role;
      GRANT EXECUTE ON FUNCTION public.transition_referral_payout(BIGINT, TEXT, TEXT, TEXT) TO authenticated, service_role;
    $sql$;
  END IF;
END
$migration$;

-- In a bare PostgreSQL CI database without auth.users this migration intentionally does nothing.
-- Production/staging must verify auth.users and existing referral migration history before apply.
