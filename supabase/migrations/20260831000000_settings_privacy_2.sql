-- SultraKita Settings & Privacy 2.0
-- Additive migration. Existing bigint user_id/custom auth model is preserved.
-- Client access remains deny-by-default; API server enforces ownership.

ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS autoplay_videos boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reduce_motion boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS personalized_feed boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS personalized_ads boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_sensitive_content boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS save_link_history boolean NOT NULL DEFAULT true;

ALTER TABLE public.notification_settings
  ADD COLUMN IF NOT EXISTS comments boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS replies boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS messages boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS order_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS payment_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS seller_updates boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS security_alerts boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS promotions boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quiet_hours_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quiet_hours_start time,
  ADD COLUMN IF NOT EXISTS quiet_hours_end time;

ALTER TABLE public.privacy_settings
  ADD COLUMN IF NOT EXISTS activity_visibility varchar(20) NOT NULL DEFAULT 'friends',
  ADD COLUMN IF NOT EXISTS phone_visibility varchar(20) NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS email_visibility varchar(20) NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS searchable_by_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS searchable_by_phone boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_messages_from varchar(20) NOT NULL DEFAULT 'everyone',
  ADD COLUMN IF NOT EXISTS allow_comments_from varchar(20) NOT NULL DEFAULT 'everyone',
  ADD COLUMN IF NOT EXISTS personalized_recommendations boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS data_collection_analytics boolean NOT NULL DEFAULT true;

ALTER TABLE public.privacy_settings
  DROP CONSTRAINT IF EXISTS privacy_settings_profile_visibility_check;
ALTER TABLE public.privacy_settings
  ADD CONSTRAINT privacy_settings_profile_visibility_check CHECK (profile_visibility IN ('public','friends','private'));
ALTER TABLE public.privacy_settings
  DROP CONSTRAINT IF EXISTS privacy_settings_activity_visibility_check;
ALTER TABLE public.privacy_settings
  ADD CONSTRAINT privacy_settings_activity_visibility_check CHECK (activity_visibility IN ('public','friends','private'));
ALTER TABLE public.privacy_settings
  DROP CONSTRAINT IF EXISTS privacy_settings_contact_visibility_check;
ALTER TABLE public.privacy_settings
  ADD CONSTRAINT privacy_settings_contact_visibility_check CHECK (phone_visibility IN ('public','friends','private') AND email_visibility IN ('public','friends','private'));
ALTER TABLE public.privacy_settings
  DROP CONSTRAINT IF EXISTS privacy_settings_interaction_visibility_check;
ALTER TABLE public.privacy_settings
  ADD CONSTRAINT privacy_settings_interaction_visibility_check CHECK (allow_messages_from IN ('everyone','friends','nobody') AND allow_comments_from IN ('everyone','friends','nobody'));

ALTER TABLE public.time_management_limits
  ADD COLUMN IF NOT EXISTS reminder_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reminder_interval_minutes integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS quiet_start time,
  ADD COLUMN IF NOT EXISTS quiet_end time;
ALTER TABLE public.time_management_limits
  DROP CONSTRAINT IF EXISTS time_management_limits_reminder_interval_check;
ALTER TABLE public.time_management_limits
  ADD CONSTRAINT time_management_limits_reminder_interval_check CHECK (reminder_interval_minutes BETWEEN 5 AND 240);

CREATE TABLE IF NOT EXISTS public.promotion_preferences (
  user_id bigint PRIMARY KEY,
  personalized_ads boolean NOT NULL DEFAULT true,
  location_based_ads boolean NOT NULL DEFAULT true,
  seller_promotions boolean NOT NULL DEFAULT true,
  marketplace_recommendations boolean NOT NULL DEFAULT true,
  email_marketing boolean NOT NULL DEFAULT false,
  push_marketing boolean NOT NULL DEFAULT false,
  whatsapp_marketing boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.account_activity_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS promotion_preferences_updated_idx ON public.promotion_preferences(updated_at DESC);
CREATE INDEX IF NOT EXISTS account_activity_logs_user_idx ON public.account_activity_logs(user_id, created_at DESC);

ALTER TABLE public.promotion_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS promotion_preferences_no_client_access ON public.promotion_preferences;
CREATE POLICY promotion_preferences_no_client_access ON public.promotion_preferences FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS account_activity_logs_no_client_access ON public.account_activity_logs;
CREATE POLICY account_activity_logs_no_client_access ON public.account_activity_logs FOR ALL USING (false) WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS promotion_preferences_updated_at ON public.promotion_preferences;
CREATE TRIGGER promotion_preferences_updated_at BEFORE UPDATE ON public.promotion_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
