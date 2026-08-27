-- Section 3: additive admin-system schema for SultraKita.
-- Existing users, listings, reports, and auth/session tables are not replaced or altered destructively.
-- Marketplace foreign keys intentionally use BIGINT because the existing production schema uses bigint IDs.

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  role_key VARCHAR(50) UNIQUE NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES admin_roles(id),
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_factor_secret TEXT,
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listing_moderation (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  reviewer_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  review_notes TEXT,
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_content (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('banner', 'announcement', 'popup', 'promo', 'featured_section')),
  title VARCHAR(255) NOT NULL,
  body TEXT,
  image_url TEXT,
  link_url TEXT,
  position VARCHAR(50),
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
  target_region VARCHAR(100),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  recipient_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_management (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  reporter_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  reported_content_type VARCHAR(50) NOT NULL CHECK (reported_content_type IN ('listing', 'user', 'comment', 'review')),
  reported_content_id BIGINT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_status (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  status_type VARCHAR(50) NOT NULL CHECK (status_type IN ('maintenance', 'degraded', 'operational', 'announcement')),
  message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_auth_user_uidx ON admin_users(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_user ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_resource ON admin_audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_listing_moderation_status ON listing_moderation(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_moderation_listing ON listing_moderation(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_management_status ON report_management(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_content_type ON admin_content(content_type, is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_recipient ON admin_notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_status_active ON platform_status(is_active, scheduled_start);

-- Seed defaults only; existing customized rows are never overwritten.
INSERT INTO admin_roles (role_key, role_name, level, description, permissions, is_system) VALUES
  ('super_admin', 'Super Administrator', 5, 'Full system control including admin management', '["*"]'::jsonb, TRUE),
  ('admin', 'Administrator', 4, 'Full content and user management except admin/role/settings/payment configuration', '["view_dashboard","manage_users","manage_listings","approve_listings","feature_listings","delete_any_listing","manage_categories","moderate_reports","verify_sellers","manage_donations","manage_content","view_analytics","export_data","view_audit_log","send_notifications","ban_users","view_user_pii"]'::jsonb, TRUE),
  ('moderator', 'Content Moderator', 3, 'Content moderation, reports, and seller verification', '["view_dashboard","manage_listings","approve_listings","moderate_reports","verify_sellers","send_notifications","view_user_pii"]'::jsonb, TRUE),
  ('support', 'Support Agent', 3, 'Customer support with limited operational access', '["view_dashboard","send_notifications"]'::jsonb, TRUE),
  ('analyst', 'Data Analyst', 3, 'Read-only analytics and reporting', '["view_dashboard","view_analytics","export_data"]'::jsonb, TRUE),
  ('seller', 'Seller', 2, 'Can create and manage own listings', '["manage_listings_own"]'::jsonb, TRUE),
  ('user', 'User/Buyer', 1, 'Can browse, favorite, and purchase', '[]'::jsonb, TRUE)
ON CONFLICT (role_key) DO NOTHING;

INSERT INTO platform_settings (setting_key, setting_value, setting_group, description, is_public) VALUES
  ('site_name', '"SultraKita"'::jsonb, 'general', 'Platform display name', TRUE),
  ('site_tagline', '"Temukan yang dekat"'::jsonb, 'general', 'Platform tagline', TRUE),
  ('maintenance_mode', 'false'::jsonb, 'system', 'Enable maintenance mode', FALSE),
  ('allow_new_registrations', 'true'::jsonb, 'system', 'Allow new user registration', FALSE),
  ('listing_auto_approve', 'false'::jsonb, 'moderation', 'Auto-approve new listings', FALSE),
  ('max_listing_images', '10'::jsonb, 'listing', 'Maximum images per listing', TRUE),
  ('max_listing_price', '10000000000'::jsonb, 'listing', 'Maximum listing price in IDR', FALSE),
  ('featured_listing_price', '50000'::jsonb, 'monetization', 'Price to feature a listing in IDR', FALSE),
  ('commission_rate', '0.025'::jsonb, 'monetization', 'Platform commission rate', FALSE),
  ('donation_enabled', 'true'::jsonb, 'donation', 'Enable donation feature', FALSE),
  ('whatsapp_notifications', 'true'::jsonb, 'notification', 'Enable WhatsApp notifications', FALSE),
  ('otp_expiry_minutes', '5'::jsonb, 'auth', 'OTP expiry time in minutes', FALSE),
  ('admin_session_hours', '8'::jsonb, 'auth', 'Admin session duration in hours', FALSE),
  ('max_login_attempts', '5'::jsonb, 'auth', 'Max login attempts before lockout', FALSE),
  ('lockout_duration_minutes', '30'::jsonb, 'auth', 'Account lockout duration', FALSE),
  ('default_region', '"Kendari"'::jsonb, 'location', 'Default region for new users', TRUE),
  ('supported_regions', '["Kendari","Baubau","Kolaka","Konawe","Muna","Bombana","Buton","Wakatobi"]'::jsonb, 'location', 'Supported regions', TRUE),
  ('currency', '"IDR"'::jsonb, 'general', 'Platform currency', TRUE),
  ('language', '"id"'::jsonb, 'general', 'Default language', TRUE),
  ('terms_url', '"/terms"'::jsonb, 'legal', 'Terms of service URL', TRUE),
  ('privacy_url', '"/privacy"'::jsonb, 'legal', 'Privacy policy URL', TRUE)
ON CONFLICT (setting_key) DO NOTHING;

-- RLS is enabled on every admin table. The server connects with a privileged DB role;
-- browser clients receive no direct table access through anon/authenticated roles.
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  table_name TEXT;
  policy_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['admin_roles','admin_users','admin_sessions','admin_audit_logs','listing_moderation','platform_settings','admin_content','admin_notifications','report_management','platform_status','admin_role_assignments','audit_logs'] LOOP
    policy_name := table_name || '_no_client_access';
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = table_name AND policyname = policy_name) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL USING (FALSE) WITH CHECK (FALSE)', policy_name, table_name);
    END IF;
  END LOOP;
END $$;
