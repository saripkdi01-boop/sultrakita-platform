-- Anti-fraud controls for the Auth-native referral runtime.
-- Fingerprints are pseudonymous hashes produced by the server; raw IP/user-agent values are never stored.
DO $migration$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL
     AND to_regclass('public.referral_accounts') IS NOT NULL
     AND to_regclass('public.referral_account_events') IS NOT NULL
     AND to_regclass('public.referral_reward_ledger') IS NOT NULL THEN
    EXECUTE $sql$
      CREATE TABLE IF NOT EXISTS public.referral_risk_flags (
        id BIGSERIAL PRIMARY KEY,
        auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        referral_event_id BIGINT REFERENCES public.referral_account_events(id) ON DELETE SET NULL,
        risk_type TEXT NOT NULL CHECK (risk_type IN ('self_referral','shared_fingerprint','velocity_limit','replay','manual_review')),
        severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','cleared','blocked')),
        reason TEXT NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        reviewed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS referral_risk_flags_open_idx
        ON public.referral_risk_flags(status, severity DESC, created_at DESC)
        WHERE status = 'open';
      CREATE INDEX IF NOT EXISTS referral_risk_flags_user_idx
        ON public.referral_risk_flags(auth_user_id, created_at DESC);
      ALTER TABLE public.referral_risk_flags ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS referral_risk_flags_no_client_access ON public.referral_risk_flags;
      CREATE POLICY referral_risk_flags_no_client_access
        ON public.referral_risk_flags FOR ALL USING (false) WITH CHECK (false);

      CREATE OR REPLACE FUNCTION public.claim_referral(
        p_referred_user_id UUID,
        p_referral_code TEXT,
        p_source_channel TEXT DEFAULT 'direct',
        p_event_key TEXT DEFAULT NULL,
        p_metadata JSONB DEFAULT '{}'::jsonb
      )
      RETURNS TABLE(claimed BOOLEAN, duplicate BOOLEAN, risk_flagged BOOLEAN)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE
        v_owner_id UUID;
        v_existing_referrer UUID;
        v_event_id BIGINT;
        v_code TEXT := upper(trim(coalesce(p_referral_code, '')));
        v_event_key TEXT := nullif(trim(coalesce(p_event_key, '')), '');
        v_metadata JSONB := CASE WHEN jsonb_typeof(coalesce(p_metadata, '{}'::jsonb)) = 'object' THEN p_metadata ELSE '{}'::jsonb END;
        v_risk BOOLEAN := false;
        v_recent_signups INTEGER;
        v_shared_count INTEGER;
      BEGIN
        IF p_referred_user_id IS NULL OR v_code !~ '^SULTRA-[A-F0-9]{8}$' OR v_event_key IS NULL THEN
          RAISE EXCEPTION 'invalid referral claim';
        END IF;
        SELECT a.auth_user_id INTO v_owner_id
        FROM public.referral_accounts a
        WHERE a.referral_code = v_code
        FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral code not found'; END IF;
        IF v_owner_id = p_referred_user_id THEN
          INSERT INTO public.referral_risk_flags(auth_user_id, referrer_id, risk_type, severity, reason, metadata)
          VALUES (p_referred_user_id, v_owner_id, 'self_referral', 'high', 'Referral code owner attempted to claim own code.', v_metadata);
          RETURN QUERY SELECT false, false, true;
          RETURN;
        END IF;
        INSERT INTO public.referral_accounts(auth_user_id, referral_code)
        VALUES (p_referred_user_id, 'SULTRA-' || upper(substr(md5('referral:' || p_referred_user_id::text), 1, 8)))
        ON CONFLICT (auth_user_id) DO NOTHING;
        SELECT a.referred_by INTO v_existing_referrer
        FROM public.referral_accounts a
        WHERE a.auth_user_id = p_referred_user_id
        FOR UPDATE;
        IF v_existing_referrer IS NOT NULL THEN
          IF v_existing_referrer = v_owner_id THEN RETURN QUERY SELECT true, true, false; ELSE RAISE EXCEPTION 'account already referred'; END IF;
        END IF;
        UPDATE public.referral_accounts a
        SET referred_by = v_owner_id, updated_at = now()
        WHERE a.auth_user_id = p_referred_user_id AND a.referred_by IS NULL;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral claim race'; END IF;
        INSERT INTO public.referral_account_events(referrer_id, referred_user_id, referral_code, event_type, source_channel, event_key, metadata)
        VALUES (v_owner_id, p_referred_user_id, v_code, 'signup', left(coalesce(p_source_channel, 'direct'), 30), v_event_key, v_metadata)
        ON CONFLICT (event_key) DO NOTHING
        RETURNING id INTO v_event_id;
        IF v_event_id IS NULL THEN RETURN QUERY SELECT true, true, false; RETURN; END IF;
        SELECT count(*)::INTEGER INTO v_recent_signups
        FROM public.referral_account_events e
        WHERE e.referrer_id = v_owner_id AND e.event_type = 'signup' AND e.created_at >= now() - interval '24 hours';
        IF v_recent_signups > 20 THEN
          v_risk := true;
          INSERT INTO public.referral_risk_flags(auth_user_id, referrer_id, referral_event_id, risk_type, severity, reason, metadata)
          VALUES (p_referred_user_id, v_owner_id, v_event_id, 'velocity_limit', 'high', 'More than 20 signup claims from one referrer in 24 hours.', jsonb_build_object('recent_signups', v_recent_signups));
        END IF;
        SELECT count(*)::INTEGER INTO v_shared_count
        FROM public.referral_account_events e
        WHERE e.event_type = 'signup' AND e.id <> v_event_id AND e.created_at >= now() - interval '30 days'
          AND ((v_metadata ? 'ip_hash' AND e.metadata->>'ip_hash' = v_metadata->>'ip_hash')
            OR (v_metadata ? 'ua_hash' AND e.metadata->>'ua_hash' = v_metadata->>'ua_hash'));
        IF v_shared_count > 0 THEN
          v_risk := true;
          INSERT INTO public.referral_risk_flags(auth_user_id, referrer_id, referral_event_id, risk_type, severity, reason, metadata)
          VALUES (p_referred_user_id, v_owner_id, v_event_id, 'shared_fingerprint', 'high', 'Referral signup shares a server-side fingerprint with another signup.', jsonb_build_object('matching_signups', v_shared_count));
        END IF;
        RETURN QUERY SELECT true, false, v_risk;
      END;
      $fn$;

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
        v_ledger_key TEXT;
      BEGIN
        IF p_referred_user_id IS NULL OR p_points IS NULL OR p_points <= 0 THEN RAISE EXCEPTION 'invalid qualification values'; END IF;
        SELECT e.* INTO v_signup FROM public.referral_account_events e
        WHERE e.referred_user_id = p_referred_user_id AND e.event_type = 'signup'
        ORDER BY e.created_at ASC LIMIT 1;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral signup belum ditemukan'; END IF;
        IF v_signup.referrer_id = p_referred_user_id THEN RAISE EXCEPTION 'self referral is not eligible'; END IF;
        IF EXISTS (SELECT 1 FROM public.referral_risk_flags f WHERE f.status IN ('open','blocked') AND (f.auth_user_id = p_referred_user_id OR f.referral_event_id = v_signup.id)) THEN
          RAISE EXCEPTION 'referral risk review required';
        END IF;
        INSERT INTO public.referral_account_events(referrer_id, referred_user_id, referral_code, event_type, source_channel, event_key, metadata)
        VALUES (v_signup.referrer_id, p_referred_user_id, v_signup.referral_code, 'qualified', 'verified_activity', 'qualified:' || p_referred_user_id::TEXT || ':' || v_signup.referrer_id::TEXT, jsonb_build_object('qualification_source', 'atomic_rpc'))
        ON CONFLICT (event_key) DO NOTHING RETURNING id INTO v_qualified_id;
        IF v_qualified_id IS NULL THEN RETURN QUERY SELECT true, 0, true; RETURN; END IF;
        v_ledger_key := 'qualified-award:' || p_referred_user_id::TEXT || ':' || v_signup.referrer_id::TEXT;
        INSERT INTO public.referral_reward_ledger(auth_user_id, referral_event_id, entry_type, balance_bucket, points, idempotency_key, source_ref, metadata)
        VALUES (v_signup.referrer_id, v_qualified_id, 'award', 'available', p_points, v_ledger_key, 'referral:' || p_referred_user_id::TEXT, jsonb_build_object('referred_user_id', p_referred_user_id, 'referral_code', v_signup.referral_code));
        UPDATE public.referral_accounts a SET total_points = a.total_points + p_points, lifetime_points = a.lifetime_points + p_points, updated_at = now() WHERE a.auth_user_id = v_signup.referrer_id;
        IF NOT FOUND THEN RAISE EXCEPTION 'referral account not found'; END IF;
        RETURN QUERY SELECT true, p_points, false;
      END;
      $fn$;

      CREATE OR REPLACE FUNCTION public.list_referral_risk_flags(p_limit INTEGER DEFAULT 50)
      RETURNS TABLE(id BIGINT, auth_user_id UUID, referrer_id UUID, risk_type TEXT, severity TEXT, status TEXT, reason TEXT, metadata JSONB, created_at TIMESTAMPTZ)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      BEGIN
        IF NOT public.referral_is_payout_operator() THEN RAISE EXCEPTION 'payout operator authorization required'; END IF;
        RETURN QUERY SELECT f.id, f.auth_user_id, f.referrer_id, f.risk_type, f.severity, f.status, f.reason, f.metadata, f.created_at
        FROM public.referral_risk_flags f WHERE f.status = 'open' ORDER BY f.created_at ASC LIMIT least(greatest(coalesce(p_limit, 50), 1), 100);
      END;
      $fn$;

      CREATE OR REPLACE FUNCTION public.review_referral_risk_flag(
        p_flag_id BIGINT,
        p_to_status TEXT
      )
      RETURNS TABLE(id BIGINT, status TEXT, reviewed_by UUID, reviewed_at TIMESTAMPTZ)
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      DECLARE v_actor UUID := auth.uid();
      BEGIN
        IF NOT public.referral_is_payout_operator() OR v_actor IS NULL THEN RAISE EXCEPTION 'payout operator authorization required'; END IF;
        IF p_to_status NOT IN ('cleared','blocked') THEN RAISE EXCEPTION 'invalid risk review status'; END IF;
        UPDATE public.referral_risk_flags f SET status = p_to_status, reviewed_by = v_actor, reviewed_at = now()
        WHERE f.id = p_flag_id AND f.status = 'open';
        IF NOT FOUND THEN RAISE EXCEPTION 'risk flag not found'; END IF;
        RETURN QUERY SELECT f.id, f.status, f.reviewed_by, f.reviewed_at FROM public.referral_risk_flags f WHERE f.id = p_flag_id;
      END;
      $fn$;

      REVOKE ALL ON FUNCTION public.claim_referral(UUID, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.qualify_referral(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
      REVOKE ALL ON FUNCTION public.list_referral_risk_flags(INTEGER) FROM PUBLIC, anon;
      REVOKE ALL ON FUNCTION public.review_referral_risk_flag(BIGINT, TEXT) FROM PUBLIC, anon;
      GRANT EXECUTE ON FUNCTION public.claim_referral(UUID, TEXT, TEXT, TEXT, JSONB) TO service_role;
      GRANT EXECUTE ON FUNCTION public.qualify_referral(UUID, INTEGER) TO service_role;
      GRANT EXECUTE ON FUNCTION public.list_referral_risk_flags(INTEGER) TO authenticated;
      GRANT EXECUTE ON FUNCTION public.review_referral_risk_flag(BIGINT, TEXT) TO authenticated;
    $sql$;
  END IF;
END
$migration$;
