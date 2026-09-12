-- Affiliate payout status notifications for the existing in-app notification center.
-- Uses profile_id (Supabase Auth UUID); legacy user_id remains nullable for older notifications.
DO $migration$
BEGIN
  IF to_regclass('public.notifications') IS NOT NULL AND to_regclass('public.referral_account_redemptions') IS NOT NULL THEN
    EXECUTE $sql$
      ALTER TABLE public.notifications ALTER COLUMN user_id DROP NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_notifications_profile_unread
        ON public.notifications(profile_id, created_at DESC)
        WHERE is_read = false;

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
        v_title TEXT;
        v_body TEXT;
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

        v_title := CASE p_to_status
          WHEN 'approved' THEN 'Pengajuan reward disetujui'
          WHEN 'paid' THEN 'Reward telah dibayarkan'
          WHEN 'rejected' THEN 'Pengajuan reward ditolak'
        END;
        v_body := CASE p_to_status
          WHEN 'approved' THEN 'Pengajuan reward kamu lolos review dan menunggu proses pembayaran.'
          WHEN 'paid' THEN 'Reward kamu telah ditandai dibayarkan oleh tim SUKI.'
          WHEN 'rejected' THEN 'Pengajuan reward kamu ditolak. Buka Campaign Hub untuk melihat alasan review.'
        END;
        INSERT INTO public.notifications(user_id, profile_id, type, title, body, link, data, is_read)
        VALUES (NULL, v_current.auth_user_id, 'payout_status', v_title, v_body, '/ajak-teman?tab=redeem', jsonb_build_object('status', p_to_status), false);

        RETURN QUERY SELECT r.id, r.status, r.reviewed_at, r.paid_at
          FROM public.referral_account_redemptions r WHERE r.id = p_redemption_id;
      END;
      $fn$;
    $sql$;
  END IF;
END
$migration$;
