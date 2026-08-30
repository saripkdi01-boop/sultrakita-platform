-- The app uses its own bearer sessions and a server-side PostgreSQL adapter;
-- client access is intentionally denied, while API authorization is enforced by requireAuth.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['user_settings','privacy_settings','notification_settings','device_sessions','account_deletion_requests','data_exports','security_events','time_management_limits','data_usage_logs','link_history','ad_activity_logs','privacy_processing_requests'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', table_name || '_no_client_access', table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO public USING (false) WITH CHECK (false)', table_name || '_no_client_access', table_name);
  END LOOP;
END $$;
