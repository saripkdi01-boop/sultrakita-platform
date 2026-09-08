-- P0 security hardening: keep trigger/server functions callable only by trusted roles.
-- This migration does not change table RLS policies or application data.

REVOKE EXECUTE ON FUNCTION public.award_sultrakita_points(bigint, integer, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.award_sultrakita_points(bigint, integer, text, text, text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_seller_publication_bypass() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_property_stats() FROM PUBLIC, anon, authenticated;

-- This helper is referenced by authenticated RLS policies, so authenticated remains allowed.
REVOKE EXECUTE ON FUNCTION public.is_suki_jobs_manager() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_suki_jobs_manager() TO authenticated;

ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_seller_verification_fields() SET search_path = public, pg_temp;
