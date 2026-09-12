-- Corrective migration: qualify redemption status references in the output-parameter RPC.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL
     AND to_regclass('public.referral_accounts') IS NOT NULL
     AND to_regclass('public.referral_account_redemptions') IS NOT NULL
     AND to_regclass('public.referral_reward_ledger') IS NOT NULL THEN
    EXECUTE $sql$
      CREATE OR REPLACE FUNCTION public.create_referral_redemption(
        p_auth_user_id UUID,
        p_points INTEGER,
        p_rupiah_amount INTEGER,
        p_payout_method TEXT,
        p_payout_account_masked TEXT
      )
      RETURNS TABLE(id BIGINT, status TEXT, rupiah_amount INTEGER)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE
        v_id BIGINT;
      BEGIN
        IF p_auth_user_id IS NULL OR p_points IS NULL OR p_points < 1000
           OR p_rupiah_amount IS NULL OR p_rupiah_amount <= 0
           OR p_payout_method IS NULL OR length(trim(p_payout_method)) < 2
           OR p_payout_account_masked IS NULL OR length(trim(p_payout_account_masked)) < 4 THEN
          RAISE EXCEPTION 'redemption values must be valid';
        END IF;
        PERFORM 1 FROM public.referral_accounts a WHERE a.auth_user_id = p_auth_user_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral account not found'; END IF;
        IF EXISTS (
          SELECT 1 FROM public.referral_account_redemptions r
          WHERE r.auth_user_id = p_auth_user_id AND r.status = 'pending'
        ) THEN RAISE EXCEPTION 'pending redemption already exists'; END IF;
        UPDATE public.referral_accounts a
        SET total_points = a.total_points - p_points, updated_at = now()
        WHERE a.auth_user_id = p_auth_user_id AND a.total_points >= p_points;
        IF NOT FOUND THEN RAISE EXCEPTION 'insufficient referral balance'; END IF;
        INSERT INTO public.referral_account_redemptions(
          auth_user_id, points, rupiah_amount, payout_method, payout_account_masked
        ) VALUES (
          p_auth_user_id, p_points, p_rupiah_amount, left(trim(p_payout_method), 30), left(trim(p_payout_account_masked), 80)
        ) RETURNING referral_account_redemptions.id INTO v_id;
        INSERT INTO public.referral_reward_ledger(
          auth_user_id, entry_type, balance_bucket, points, idempotency_key, source_ref, metadata
        ) VALUES (
          p_auth_user_id, 'reserve', 'available', -p_points,
          'redemption-reserve:' || v_id::TEXT, 'redemption:' || v_id::TEXT,
          jsonb_build_object('redemption_id', v_id, 'rupiah_amount', p_rupiah_amount)
        );
        RETURN QUERY SELECT v_id, 'pending'::TEXT, p_rupiah_amount;
      END;
      $fn$;
      REVOKE ALL ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) TO service_role;
    $sql$;
  END IF;
END
$migration$;
