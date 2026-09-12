-- Corrective migration: qualify payout id references in the output-parameter RPC.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL
     AND to_regclass('public.referral_account_redemptions') IS NOT NULL
     AND to_regclass('public.referral_redemption_audit_logs') IS NOT NULL THEN
    EXECUTE $sql$
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
        SELECT r.* INTO v_current FROM public.referral_account_redemptions r WHERE r.id = p_redemption_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'payout not found'; END IF;
        IF v_current.status = 'pending' AND p_to_status NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'pending payout must be approved or rejected'; END IF;
        IF v_current.status = 'approved' AND p_to_status NOT IN ('paid','rejected') THEN RAISE EXCEPTION 'approved payout must be paid or rejected'; END IF;
        IF v_current.status IN ('paid','rejected') THEN RAISE EXCEPTION 'terminal payout status'; END IF;
        IF p_to_status = 'rejected' AND v_note IS NULL THEN RAISE EXCEPTION 'rejection reason required'; END IF;
        IF p_to_status = 'paid' AND v_reference IS NULL THEN RAISE EXCEPTION 'payment reference required'; END IF;
        IF p_to_status = 'paid' AND v_current.reviewed_by IS NOT NULL AND v_current.reviewed_by = v_actor THEN RAISE EXCEPTION 'second operator required for payment'; END IF;
        UPDATE public.referral_account_redemptions r
        SET status = p_to_status,
            reviewed_by = CASE WHEN p_to_status IN ('approved','rejected') THEN v_actor ELSE r.reviewed_by END,
            reviewed_at = CASE WHEN p_to_status IN ('approved','rejected') THEN now() ELSE r.reviewed_at END,
            rejection_reason = CASE WHEN p_to_status = 'rejected' THEN v_note ELSE r.rejection_reason END,
            payment_reference = CASE WHEN p_to_status = 'paid' THEN v_reference ELSE r.payment_reference END,
            paid_at = CASE WHEN p_to_status = 'paid' THEN now() ELSE r.paid_at END,
            updated_at = now()
        WHERE r.id = p_redemption_id;
        INSERT INTO public.referral_redemption_audit_logs(redemption_id, actor_id, from_status, to_status, note, payment_reference)
        VALUES (p_redemption_id, v_actor, v_current.status, p_to_status, v_note, v_reference);
        RETURN QUERY SELECT r.id, r.status, r.reviewed_at, r.paid_at FROM public.referral_account_redemptions r WHERE r.id = p_redemption_id;
      END;
      $fn$;
      REVOKE ALL ON FUNCTION public.transition_referral_payout(BIGINT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.transition_referral_payout(BIGINT, TEXT, TEXT, TEXT) TO authenticated, service_role;
    $sql$;
  END IF;
END
$migration$;
