-- Immutable reward ledger and atomic qualification for the Supabase Auth-native referral runtime.
-- Bare PostgreSQL CI without auth.users intentionally skips this migration.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL
     AND to_regclass('public.referral_accounts') IS NOT NULL
     AND to_regclass('public.referral_account_events') IS NOT NULL
     AND to_regclass('public.referral_account_redemptions') IS NOT NULL THEN
    EXECUTE $sql$
      CREATE TABLE IF NOT EXISTS public.referral_reward_ledger (
        id BIGSERIAL PRIMARY KEY,
        auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        referral_event_id BIGINT REFERENCES public.referral_account_events(id) ON DELETE SET NULL,
        entry_type TEXT NOT NULL CHECK (entry_type IN ('award','reserve','release','reversal')),
        balance_bucket TEXT NOT NULL CHECK (balance_bucket IN ('available','pending','promotional')),
        points INTEGER NOT NULL CHECK (points <> 0),
        idempotency_key TEXT NOT NULL UNIQUE,
        source_ref TEXT,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS referral_reward_ledger_user_created_idx
        ON public.referral_reward_ledger(auth_user_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS referral_reward_ledger_event_idx
        ON public.referral_reward_ledger(referral_event_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS referral_reward_ledger_source_idx
        ON public.referral_reward_ledger(source_ref)
        WHERE source_ref IS NOT NULL;

      ALTER TABLE public.referral_reward_ledger ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS referral_reward_ledger_no_client_access ON public.referral_reward_ledger;
      CREATE POLICY referral_reward_ledger_no_client_access
        ON public.referral_reward_ledger FOR ALL USING (false) WITH CHECK (false);

      CREATE OR REPLACE FUNCTION public.qualify_referral(
        p_referred_user_id UUID,
        p_points INTEGER DEFAULT 100
      )
      RETURNS TABLE(qualified BOOLEAN, points_awarded INTEGER, duplicate BOOLEAN)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE
        v_signup public.referral_account_events%ROWTYPE;
        v_qualified_id BIGINT;
        v_event_key TEXT;
        v_ledger_key TEXT;
      BEGIN
        IF p_referred_user_id IS NULL OR p_points IS NULL OR p_points <= 0 THEN
          RAISE EXCEPTION 'invalid qualification values';
        END IF;

        SELECT * INTO v_signup
        FROM public.referral_account_events
        WHERE referred_user_id = p_referred_user_id
          AND event_type = 'signup'
        ORDER BY created_at ASC
        LIMIT 1;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral signup belum ditemukan'; END IF;
        IF v_signup.referrer_id = p_referred_user_id THEN RAISE EXCEPTION 'self referral is not eligible'; END IF;

        v_event_key := 'qualified:' || p_referred_user_id::TEXT || ':' || v_signup.referrer_id::TEXT;
        INSERT INTO public.referral_account_events(
          referrer_id, referred_user_id, referral_code, event_type, source_channel, event_key, metadata
        ) VALUES (
          v_signup.referrer_id, p_referred_user_id, v_signup.referral_code, 'qualified', 'verified_activity', v_event_key,
          jsonb_build_object('qualification_source', 'atomic_rpc')
        )
        ON CONFLICT (event_key) DO NOTHING
        RETURNING id INTO v_qualified_id;

        IF v_qualified_id IS NULL THEN
          RETURN QUERY SELECT true, 0, true;
          RETURN;
        END IF;

        v_ledger_key := 'qualified-award:' || p_referred_user_id::TEXT || ':' || v_signup.referrer_id::TEXT;
        INSERT INTO public.referral_reward_ledger(
          auth_user_id, referral_event_id, entry_type, balance_bucket, points, idempotency_key, source_ref, metadata
        ) VALUES (
          v_signup.referrer_id, v_qualified_id, 'award', 'available', p_points, v_ledger_key,
          'referral:' || p_referred_user_id::TEXT,
          jsonb_build_object('referred_user_id', p_referred_user_id, 'referral_code', v_signup.referral_code)
        );

        UPDATE public.referral_accounts
        SET total_points = total_points + p_points,
            lifetime_points = lifetime_points + p_points,
            updated_at = now()
        WHERE auth_user_id = v_signup.referrer_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral account not found'; END IF;

        RETURN QUERY SELECT true, p_points, false;
      END;
      $fn$;

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
        PERFORM 1 FROM public.referral_accounts WHERE auth_user_id = p_auth_user_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral account not found'; END IF;
        IF EXISTS (
          SELECT 1 FROM public.referral_account_redemptions
          WHERE auth_user_id = p_auth_user_id AND status = 'pending'
        ) THEN RAISE EXCEPTION 'pending redemption already exists'; END IF;
        UPDATE public.referral_accounts
        SET total_points = total_points - p_points, updated_at = now()
        WHERE auth_user_id = p_auth_user_id AND total_points >= p_points;
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

      REVOKE ALL ON FUNCTION public.qualify_referral(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.qualify_referral(UUID, INTEGER) TO service_role;
      GRANT EXECUTE ON FUNCTION public.create_referral_redemption(UUID, INTEGER, INTEGER, TEXT, TEXT) TO service_role;
    $sql$;
  END IF;
END
$migration$;
