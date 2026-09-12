-- Atomic referral mutations for the Supabase Auth-native runtime.
-- Bare PostgreSQL CI does not provide auth.users, so this migration is a no-op there.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL AND to_regclass('public.referral_accounts') IS NOT NULL THEN
    EXECUTE $sql$
      CREATE OR REPLACE FUNCTION public.increment_referral_account_points(
        p_referrer_id UUID,
        p_points INTEGER
      )
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      BEGIN
        IF p_points IS NULL OR p_points <= 0 THEN
          RAISE EXCEPTION 'points must be positive';
        END IF;
        UPDATE public.referral_accounts
        SET total_points = total_points + p_points,
            lifetime_points = lifetime_points + p_points,
            updated_at = now()
        WHERE auth_user_id = p_referrer_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'referral account not found';
        END IF;
      END;
      $fn$;

      CREATE UNIQUE INDEX IF NOT EXISTS referral_account_one_pending_redemption_idx
        ON public.referral_account_redemptions(auth_user_id)
        WHERE status = 'pending';

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
        IF p_points IS NULL OR p_points <= 0 OR p_rupiah_amount IS NULL OR p_rupiah_amount <= 0 THEN
          RAISE EXCEPTION 'redemption values must be positive';
        END IF;
        PERFORM 1 FROM public.referral_accounts
          WHERE auth_user_id = p_auth_user_id
          FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'referral account not found';
        END IF;
        IF EXISTS (
          SELECT 1 FROM public.referral_account_redemptions
          WHERE auth_user_id = p_auth_user_id AND status = 'pending'
        ) THEN
          RAISE EXCEPTION 'pending redemption already exists';
        END IF;
        UPDATE public.referral_accounts
        SET total_points = total_points - p_points,
            updated_at = now()
        WHERE auth_user_id = p_auth_user_id AND total_points >= p_points;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'insufficient referral balance';
        END IF;
        INSERT INTO public.referral_account_redemptions(
          auth_user_id, points, rupiah_amount, payout_method, payout_account_masked
        ) VALUES (
          p_auth_user_id, p_points, p_rupiah_amount, p_payout_method, p_payout_account_masked
        ) RETURNING referral_account_redemptions.id INTO v_id;
        RETURN QUERY SELECT v_id, 'pending'::TEXT, p_rupiah_amount;
      END;
      $fn$;

      REVOKE ALL ON FUNCTION public.increment_referral_account_points(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.increment_referral_account_points(UUID, INTEGER) TO service_role;
      GRANT EXECUTE ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) TO service_role;
    $sql$;
  END IF;
END
$migration$;
