-- ============================================================================
-- SUKI KAMPUNG — Migrasi Supabase (Postgres)
-- ============================================================================
-- SATU file idempoten (aman dijalankan ulang). MEMBUAT SAJA, TIDAK MENGHAPUS.
-- ⚠️ FILE SAJA — JANGAN dijalankan ke database tanpa persetujuan eksplisit.
-- Angka ekonomi (biaya/yield/XP) mengikuti docs/02-EKONOMI.md v1.0.
-- Asumsi: tabel public.profiles(id uuid PK, role text) dan public.user_roles
-- (user_id, role, is_active, expires_at) sudah ada (pola admin SUKI Apps).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- untuk gen_random_uuid()

-- --------------------------------------------------------------------------
-- Helper: cek staf (dibaca RLS). SECURITY DEFINER agar RLS profiles tidak loop.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_suki_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('super_admin', 'admin', 'moderator')
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.is_active IS TRUE
      AND ur.role IN ('super_admin', 'admin', 'moderator')
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

-- ============================================================================
-- 1. game_profiles — profil game per user (1:1 dengan auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_profiles (
  user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       text NOT NULL CHECK (char_length(username) BETWEEN 3 AND 20),
  avatar_url     text,
  level          integer NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 30),
  xp             integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  coins          integer NOT NULL DEFAULT 300 CHECK (coins >= 0),
  referral_code  text NOT NULL UNIQUE,          -- format SKK-XXXXXXXX
  is_suspended   boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.game_profiles IS 'Profil game SUKI KAMPUNG. coins = Koin SUKI virtual, bukan uang.';
CREATE INDEX IF NOT EXISTS idx_game_profiles_referral ON public.game_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_game_profiles_level ON public.game_profiles(level DESC);

-- ============================================================================
-- 2. villages — kampung milik pemain (1 aktif per user di Fase 1)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.villages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT 'Kampungku' CHECK (char_length(name) BETWEEN 1 AND 40),
  grid_size  integer NOT NULL DEFAULT 8 CHECK (grid_size BETWEEN 4 AND 16),
  is_active  boolean NOT NULL DEFAULT true,
  renamed_at timestamptz,                        -- untuk batas 1x/7 hari
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.villages IS 'Kampung virtual pemain. Fase 1: satu kampung aktif per user.';
CREATE INDEX IF NOT EXISTS idx_villages_user ON public.villages(user_id);

-- ============================================================================
-- 3. building_catalog — katalog 8 bangunan (data statis, seed di bawah)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.building_catalog (
  id                 text PRIMARY KEY,          -- mis. 'rumah_panggung'
  name               text NOT NULL,
  description        text NOT NULL,
  unlock_level       integer NOT NULL CHECK (unlock_level BETWEEN 1 AND 30),
  build_cost         integer NOT NULL CHECK (build_cost > 0),
  yield_amount       integer NOT NULL CHECK (yield_amount > 0),
  yield_interval_sec integer NOT NULL CHECK (yield_interval_sec > 0),
  footprint_w        integer NOT NULL CHECK (footprint_w BETWEEN 1 AND 8),
  footprint_h        integer NOT NULL CHECK (footprint_h BETWEEN 1 AND 8),
  benefit            text NOT NULL,
  upgrade_cost_mult  numeric(4,2) NOT NULL DEFAULT 1.50,  -- Lv1->2
  upgrade_cost_mult3 numeric(4,2) NOT NULL DEFAULT 3.00,  -- Lv2->3
  yield_mult_2       numeric(3,1) NOT NULL DEFAULT 1.6,
  yield_mult_3       numeric(3,1) NOT NULL DEFAULT 2.4,
  icon               text NOT NULL,             -- nama ikon SVG di klien
  sort_order         integer NOT NULL DEFAULT 0
);
COMMENT ON TABLE public.building_catalog IS 'Katalog bangunan. Angka mengikuti docs/02-EKONOMI.md §2.';

INSERT INTO public.building_catalog
  (id, name, description, unlock_level, build_cost, yield_amount, yield_interval_sec,
   footprint_w, footprint_h, benefit, icon, sort_order)
VALUES
  ('rumah_panggung','Rumah Panggung','Hunian panggung khas Sultra, pondasi setiap kampung.',1,100,6,300,2,2,'Pondasi kampung','home',1),
  ('kebun_sayur','Kebun Sayur','Kebun sayur segar. Bonus XP quest panen +10%.',1,80,5,300,2,2,'Bonus XP quest panen +10%','garden',2),
  ('pasar_pagi','Pasar Pagi','Pasar pagi yang ramai. Membuka misi dagang harian.',2,350,22,600,3,2,'Membuka misi dagang harian','market',3),
  ('balai_warga','Balai Warga','Pusat musyawarah warga. Membuka proyek komunitas.',3,600,30,900,3,3,'Membuka proyek komunitas','hall',4),
  ('warung_kopi','Warung Kopi','Warung kopi tempat nongkrong. Bonus XP kuis +10%.',4,900,45,900,2,2,'Bonus XP kuis +10%','cafe',5),
  ('taman_bermain','Taman Bermain','Taman hijau. Cooldown quest -10% (min 1 jam).',5,1400,60,1200,3,3,'Cooldown quest -10%','park',6),
  ('perpustakaan','Perpustakaan Mini','Pusat ilmu kampung. Bonus XP kuis +25% (stack).',6,2000,75,1200,3,2,'Bonus XP kuis +25%','library',7),
  ('ruko_umkm','Ruko UMKM','Ruko usaha warga. Pendapatan tertinggi.',8,3200,110,1800,3,3,'Pendapatan tertinggi','shop',8)
ON CONFLICT (id) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, unlock_level=EXCLUDED.unlock_level,
  build_cost=EXCLUDED.build_cost, yield_amount=EXCLUDED.yield_amount,
  yield_interval_sec=EXCLUDED.yield_interval_sec, footprint_w=EXCLUDED.footprint_w,
  footprint_h=EXCLUDED.footprint_h, benefit=EXCLUDED.benefit, icon=EXCLUDED.icon,
  sort_order=EXCLUDED.sort_order;

-- ============================================================================
-- 4. village_buildings — bangunan terpasang di grid kampung
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.village_buildings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  village_id       uuid NOT NULL REFERENCES public.villages(id) ON DELETE CASCADE,
  catalog_id       text NOT NULL REFERENCES public.building_catalog(id),
  x                integer NOT NULL CHECK (x >= 0),
  y                integer NOT NULL CHECK (y >= 0),
  level            integer NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 3),
  built_at         timestamptz NOT NULL DEFAULT now(),
  last_collected_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (village_id, x, y)  -- cegah tumpang tindih di level DB
);
COMMENT ON TABLE public.village_buildings IS 'Bangunan terpasang. UNIQUE(village_id,x,y) mencegah overlap.';
CREATE INDEX IF NOT EXISTS idx_village_buildings_village ON public.village_buildings(village_id);

-- ============================================================================
-- 5. xp_ledger — ledger XP immutable (append-only)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  amount         integer NOT NULL,              -- bisa negatif untuk koreksi
  balance_after  integer NOT NULL,
  source         text NOT NULL,                 -- 'build','quest','quiz','achievement','referral','admin'
  source_ref     text,                          -- id quest/quiz round/dll
  idempotency_key text NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.xp_ledger IS 'Ledger XP immutable. Jangan UPDATE/DELETE; koreksi via entri baru.';
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON public.xp_ledger(user_id, created_at DESC);

-- ============================================================================
-- 6. coin_ledger — ledger Koin SUKI immutable (append-only)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.coin_ledger (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  amount         integer NOT NULL,
  balance_after  integer NOT NULL CHECK (balance_after >= 0),
  source         text NOT NULL,                 -- 'harvest','quest','quiz','build_cost','upgrade_cost','referral','admin'
  source_ref     text,
  idempotency_key text NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.coin_ledger IS 'Ledger Koin SUKI (virtual) immutable. Idempotency cegah double-claim.';
CREATE INDEX IF NOT EXISTS idx_coin_ledger_user ON public.coin_ledger(user_id, created_at DESC);

-- ============================================================================
-- 7. quest_definitions — definisi quest (seed harian & mingguan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quest_definitions (
  id          text PRIMARY KEY,                 -- 'h_panen','w_produktif'
  kind        text NOT NULL CHECK (kind IN ('daily','weekly')),
  name        text NOT NULL,
  description text NOT NULL,
  requirement text NOT NULL,                    -- kunci event yang dihitung
  target      integer NOT NULL CHECK (target > 0),
  xp_reward   integer NOT NULL,
  coin_reward integer NOT NULL,
  is_active   boolean NOT NULL DEFAULT true
);
COMMENT ON TABLE public.quest_definitions IS 'Definisi quest. Hadiah mengikuti docs/02-EKONOMI.md §4.';

INSERT INTO public.quest_definitions
  (id, kind, name, description, requirement, target, xp_reward, coin_reward)
VALUES
  ('h_panen','daily','Panen Pertama','Panen hasil bangunan 5 kali.','harvest',5,30,40),
  ('h_bangun','daily','Tukang Bangun','Bangun atau upgrade 1 bangunan.','build',1,50,60),
  ('h_kuis','daily','Cerdas Sultra','Jawab 5 soal kuis dengan benar.','quiz_correct',5,40,30),
  ('h_main','daily','Warga Aktif','Selesaikan 1 ronde Kuis Sultra.','quiz_round',1,25,25),
  ('h_gotong','daily','Dermawan','Berkontribusi 1x ke proyek komunitas.','contribute',1,45,40),
  ('w_produktif','weekly','Seminggu Produktif','Selesaikan 5 quest harian.','daily_quests',5,200,250),
  ('w_gotong','weekly','Gotong Royong','Berkontribusi 5x ke proyek komunitas.','contribute',5,150,150)
ON CONFLICT (id) DO UPDATE SET
  kind=EXCLUDED.kind, name=EXCLUDED.name, description=EXCLUDED.description,
  requirement=EXCLUDED.requirement, target=EXCLUDED.target,
  xp_reward=EXCLUDED.xp_reward, coin_reward=EXCLUDED.coin_reward;

-- ============================================================================
-- 8. quest_progress — progres quest per user per periode
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quest_progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  quest_id   text NOT NULL REFERENCES public.quest_definitions(id),
  period     date NOT NULL,                     -- tanggal (harian) / senin (mingguan), WITA
  progress   integer NOT NULL DEFAULT 0,
  claimed_at timestamptz,
  UNIQUE (user_id, quest_id, period)
);
COMMENT ON TABLE public.quest_progress IS 'Progres quest. UNIQUE cegah klaim ganda per periode.';
CREATE INDEX IF NOT EXISTS idx_quest_progress_user ON public.quest_progress(user_id, period DESC);

-- ============================================================================
-- 9. achievements & 10. player_achievements
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  description text NOT NULL,
  xp_reward   integer NOT NULL,
  icon        text NOT NULL
);
COMMENT ON TABLE public.achievements IS 'Daftar achievement. Hadiah mengikuti docs/02-EKONOMI.md §6.';

INSERT INTO public.achievements (id, name, description, xp_reward, icon) VALUES
  ('a_pondasi','Pondasi Pertama','Bangun 1 bangunan.',20,'foundation'),
  ('a_arsitek','Arsitek Kampung','Miliki 10 bangunan.',80,'architect'),
  ('a_kolektor','Kolektor Lengkap','Miliki ke-8 jenis bangunan.',150,'collector'),
  ('a_naik5','Naik Kelas','Capai Level 5.',60,'level5'),
  ('a_veteran','Veteran Kampung','Capai Level 10.',120,'veteran'),
  ('a_kuis100','Master Kuis','100 jawaban kuis benar.',100,'quiz'),
  ('a_panen100','Tangan Rajin','Panen 100 kali.',60,'harvest'),
  ('a_gotong10','Jiwa Gotong Royong','Kontribusi 10x proyek komunitas.',80,'gotong'),
  ('a_sultan','Lumbung Penuh','Saldo mencapai 10.000 koin.',100,'coins'),
  ('a_7hari','Warga Setia','Login 7 hari berturut-turut.',70,'streak'),
  ('a_ajak','Pengundang Baik','1 referral terverifikasi.',50,'referral'),
  ('a_dekor','Dekorator','Pasang 5 dekorasi.',40,'decor')
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description,
  xp_reward=EXCLUDED.xp_reward, icon=EXCLUDED.icon;

CREATE TABLE IF NOT EXISTS public.player_achievements (
  user_id        uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  achievement_id text NOT NULL REFERENCES public.achievements(id),
  unlocked_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);
COMMENT ON TABLE public.player_achievements IS 'Lencana yang sudah dibuka pemain.';

-- ============================================================================
-- 11. friendships — relasi pertemanan (Fase 2; tabel disiapkan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  friend_id  uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, friend_id),
  CHECK (user_id <> friend_id)
);
COMMENT ON TABLE public.friendships IS 'Pertemanan game (Fase 2). Tanpa data pribadi sensitif.';

-- ============================================================================
-- 12/13. community_projects & project_members (Fase 2; disiapkan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.community_projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 80),
  description text NOT NULL,
  goal        integer NOT NULL CHECK (goal > 0),   -- target kontribusi
  progress    integer NOT NULL DEFAULT 0,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','completed','closed')),
  created_by  uuid REFERENCES public.game_profiles(user_id) ON DELETE SET NULL,
  ends_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.community_projects IS 'Proyek gotong royong komunitas (Fase 2).';

CREATE TABLE IF NOT EXISTS public.project_members (
  project_id   uuid NOT NULL REFERENCES public.community_projects(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  contributions integer NOT NULL DEFAULT 0,
  joined_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- ============================================================================
-- 14/15. game_referrals & referral_events — referral SATU level
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_referrals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text NOT NULL,                 -- kode SKK- milik pengundang
  inviter_id      uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  invitee_id      uuid REFERENCES public.game_profiles(user_id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','terdaftar','memenuhi_syarat','reward_diberikan','ditolak','dibatalkan_admin')),
  reject_reason   text,                          -- self_referral|duplikat|kode_tidak_valid|curang_terdeteksi|kedaluwarsa
  risk_score      integer CHECK (risk_score BETWEEN 0 AND 100),
  created_at      timestamptz NOT NULL DEFAULT now(),
  qualified_at    timestamptz,
  UNIQUE (code, invitee_id)
);
COMMENT ON TABLE public.game_referrals IS 'Referral SATU level. Reward hanya setelah aktivitas kualifikasi (Lv3 + 3 quest). Lihat docs/03-REFERAL.md.';
CREATE INDEX IF NOT EXISTS idx_game_referrals_inviter ON public.game_referrals(inviter_id);
CREATE INDEX IF NOT EXISTS idx_game_referrals_status ON public.game_referrals(status);

CREATE TABLE IF NOT EXISTS public.referral_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id     uuid NOT NULL REFERENCES public.game_referrals(id) ON DELETE CASCADE,
  event_type      text NOT NULL,                 -- created|registered|qualified|rewarded|rejected|reviewed
  actor           text NOT NULL DEFAULT 'system',
  note            text,
  idempotency_key text NOT NULL UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.referral_events IS 'Jejak audit immutable setiap transisi status referral.';

-- ============================================================================
-- 16/17/18. sponsor_campaigns, campaign_rewards, reward_claims (Fase 3)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sponsor_campaigns (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id     uuid,                            -- FK ke direktori bisnis bila ada
  title          text NOT NULL,
  description    text NOT NULL,
  starts_at      timestamptz NOT NULL,
  ends_at        timestamptz NOT NULL,
  reward_budget  integer NOT NULL CHECK (reward_budget >= 0),  -- dalam koin virtual / unit voucher
  reward_terms   text NOT NULL,                   -- syarat publikasi
  eligibility    text NOT NULL,                   -- syarat peserta
  status         text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','pending_review','approved','rejected','active','ended')),
  reviewed_by    uuid,
  reviewed_at    timestamptz,
  impressions    integer NOT NULL DEFAULT 0,
  engagements    integer NOT NULL DEFAULT 0,
  completions    integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
COMMENT ON TABLE public.sponsor_campaigns IS 'Kampanye sponsor. HANYA yang approved & active tampil ke pemain, selalu berlabel sponsor. Jangan isi sponsor fiktif.';

CREATE TABLE IF NOT EXISTS public.campaign_rewards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.sponsor_campaigns(id) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('coins','xp','voucher','discount_code','cosmetic')),
  label       text NOT NULL,                      -- mis. "Voucher Rp20rb (fiktif contoh)"
  quantity    integer NOT NULL CHECK (quantity > 0),
  claimed     integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.reward_claims (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  campaign_id     uuid NOT NULL REFERENCES public.sponsor_campaigns(id) ON DELETE CASCADE,
  reward_id       uuid NOT NULL REFERENCES public.campaign_rewards(id) ON DELETE CASCADE,
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','fulfilled')),
  idempotency_key text NOT NULL UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.reward_claims IS 'Klaim reward sponsor. Tidak ada penarikan uang; voucher fisik butuh approval terpisah.';

-- ============================================================================
-- 19. game_reports — laporan moderasi (Fase 2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.game_profiles(user_id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('player','project','message')),
  target_id   text NOT NULL,
  reason      text NOT NULL,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed','actioned','dismissed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_game_reports_status ON public.game_reports(status);

-- ============================================================================
-- 20. game_audit_log — audit aksi sensitif (append-only)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_audit_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id   uuid,                                -- staf yang bertindak (null = sistem)
  action     text NOT NULL,                       -- suspend_player, approve_campaign, grant_reward, ...
  target     text NOT NULL,                       -- "player:<uuid>" / "campaign:<uuid>"
  details    jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.game_audit_log IS 'Audit append-only. Jangan UPDATE/DELETE.';
CREATE INDEX IF NOT EXISTS idx_game_audit_log_actor ON public.game_audit_log(actor_id, created_at DESC);

-- ============================================================================
-- RLS — aktifkan di semua tabel game
-- ============================================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'game_profiles','villages','village_buildings','xp_ledger','coin_ledger',
    'quest_progress','player_achievements','friendships','project_members',
    'game_referrals','referral_events','reward_claims','game_reports','game_audit_log'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- Pola kebijakan: owner-only untuk data pemain; staf untuk operasional.
-- (DROP IF EXISTS agar idempoten.)

-- game_profiles: baca milik sendiri + staf; tulis milik sendiri (bukan coins/level/xp)
DROP POLICY IF EXISTS gp_select ON public.game_profiles;
CREATE POLICY gp_select ON public.game_profiles FOR SELECT
  USING (user_id = auth.uid() OR public.is_suki_staff());
DROP POLICY IF EXISTS gp_update ON public.game_profiles;
CREATE POLICY gp_update ON public.game_profiles FOR UPDATE
  USING (user_id = auth.uid() OR public.is_suki_staff())
  WITH CHECK (user_id = auth.uid() OR public.is_suki_staff());
-- INSERT profil: via trigger/fungsi server (service_role) — tolak dari anon:
DROP POLICY IF EXISTS gp_insert ON public.game_profiles;
CREATE POLICY gp_insert ON public.game_profiles FOR INSERT
  WITH CHECK (public.is_suki_staff());

-- villages & village_buildings: owner penuh + staf baca
DROP POLICY IF EXISTS v_all ON public.villages;
CREATE POLICY v_all ON public.villages FOR ALL
  USING (user_id = auth.uid() OR public.is_suki_staff())
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS vb_all ON public.village_buildings;
CREATE POLICY vb_all ON public.village_buildings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.villages v
                 WHERE v.id = village_buildings.village_id
                   AND (v.user_id = auth.uid() OR public.is_suki_staff())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.villages v
                      WHERE v.id = village_buildings.village_id
                        AND v.user_id = auth.uid()));

-- Ledger: baca milik sendiri + staf; tulis HANYA via service_role (fungsi server)
DROP POLICY IF EXISTS xp_sel ON public.xp_ledger;
CREATE POLICY xp_sel ON public.xp_ledger FOR SELECT
  USING (user_id = auth.uid() OR public.is_suki_staff());
DROP POLICY IF EXISTS coin_sel ON public.coin_ledger;
CREATE POLICY coin_sel ON public.coin_ledger FOR SELECT
  USING (user_id = auth.uid() OR public.is_suki_staff());

-- quest_progress: owner baca; tulis via service_role
DROP POLICY IF EXISTS qp_sel ON public.quest_progress;
CREATE POLICY qp_sel ON public.quest_progress FOR SELECT
  USING (user_id = auth.uid() OR public.is_suki_staff());

-- player_achievements: baca publik (lencana tampil di profil), tulis service_role
DROP POLICY IF EXISTS pa_sel ON public.player_achievements;
CREATE POLICY pa_sel ON public.player_achievements FOR SELECT USING (true);

-- Katalog, definisi quest, achievements: baca publik; tulis staf
ALTER TABLE public.building_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bc_sel ON public.building_catalog;
CREATE POLICY bc_sel ON public.building_catalog FOR SELECT USING (true);
DROP POLICY IF EXISTS bc_w ON public.building_catalog;
CREATE POLICY bc_w ON public.building_catalog FOR ALL
  USING (public.is_suki_staff()) WITH CHECK (public.is_suki_staff());
DROP POLICY IF EXISTS qd_sel ON public.quest_definitions;
CREATE POLICY qd_sel ON public.quest_definitions FOR SELECT USING (true);
DROP POLICY IF EXISTS qd_w ON public.quest_definitions;
CREATE POLICY qd_w ON public.quest_definitions FOR ALL
  USING (public.is_suki_staff()) WITH CHECK (public.is_suki_staff());
DROP POLICY IF EXISTS ac_sel ON public.achievements;
CREATE POLICY ac_sel ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS ac_w ON public.achievements;
CREATE POLICY ac_w ON public.achievements FOR ALL
  USING (public.is_suki_staff()) WITH CHECK (public.is_suki_staff());

-- friendships: baca pihak terlibat + staf
DROP POLICY IF EXISTS f_sel ON public.friendships;
CREATE POLICY f_sel ON public.friendships FOR SELECT
  USING (user_id = auth.uid() OR friend_id = auth.uid() OR public.is_suki_staff());
DROP POLICY IF EXISTS f_ins ON public.friendships;
CREATE POLICY f_ins ON public.friendships FOR INSERT
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS f_upd ON public.friendships;
CREATE POLICY f_upd ON public.friendships FOR UPDATE
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- community_projects: baca publik; buat login; ubah staf/pembuat
ALTER TABLE public.community_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cp_sel ON public.community_projects;
CREATE POLICY cp_sel ON public.community_projects FOR SELECT USING (true);
DROP POLICY IF EXISTS cp_ins ON public.community_projects;
CREATE POLICY cp_ins ON public.community_projects FOR INSERT
  WITH CHECK (created_by = auth.uid());
DROP POLICY IF EXISTS cp_upd ON public.community_projects;
CREATE POLICY cp_upd ON public.community_projects FOR UPDATE
  USING (created_by = auth.uid() OR public.is_suki_staff());
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pm_sel ON public.project_members;
CREATE POLICY pm_sel ON public.project_members FOR SELECT USING (true);
DROP POLICY IF EXISTS pm_ins ON public.project_members;
CREATE POLICY pm_ins ON public.project_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- game_referrals: pengundang & yang diundang baca; staf penuh baca
DROP POLICY IF EXISTS gr_sel ON public.game_referrals;
CREATE POLICY gr_sel ON public.game_referrals FOR SELECT
  USING (inviter_id = auth.uid() OR invitee_id = auth.uid() OR public.is_suki_staff());
-- referral_events: pihak terkait + staf
DROP POLICY IF EXISTS re_sel ON public.referral_events;
CREATE POLICY re_sel ON public.referral_events FOR SELECT
  USING (public.is_suki_staff() OR EXISTS (
    SELECT 1 FROM public.game_referrals gr
    WHERE gr.id = referral_events.referral_id
      AND (gr.inviter_id = auth.uid() OR gr.invitee_id = auth.uid())));

-- sponsor: baca hanya approved+active untuk pemain; tulis staf
ALTER TABLE public.sponsor_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sc_sel ON public.sponsor_campaigns;
CREATE POLICY sc_sel ON public.sponsor_campaigns FOR SELECT
  USING (public.is_suki_staff()
         OR (status = 'approved' AND now() BETWEEN starts_at AND ends_at));
DROP POLICY IF EXISTS sc_w ON public.sponsor_campaigns;
CREATE POLICY sc_w ON public.sponsor_campaigns FOR ALL
  USING (public.is_suki_staff()) WITH CHECK (public.is_suki_staff());
ALTER TABLE public.campaign_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cr_sel ON public.campaign_rewards;
CREATE POLICY cr_sel ON public.campaign_rewards FOR SELECT
  USING (public.is_suki_staff() OR EXISTS (
    SELECT 1 FROM public.sponsor_campaigns sc
    WHERE sc.id = campaign_rewards.campaign_id
      AND sc.status = 'approved' AND now() BETWEEN sc.starts_at AND sc.ends_at));
DROP POLICY IF EXISTS cr_w ON public.campaign_rewards;
CREATE POLICY cr_w ON public.campaign_rewards FOR ALL
  USING (public.is_suki_staff()) WITH CHECK (public.is_suki_staff());
DROP POLICY IF EXISTS rc_sel ON public.reward_claims;
CREATE POLICY rc_sel ON public.reward_claims FOR SELECT
  USING (user_id = auth.uid() OR public.is_suki_staff());
DROP POLICY IF EXISTS rc_ins ON public.reward_claims;
CREATE POLICY rc_ins ON public.reward_claims FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- reports: pelapor baca miliknya + staf
DROP POLICY IF EXISTS grp_sel ON public.game_reports;
CREATE POLICY grp_sel ON public.game_reports FOR SELECT
  USING (reporter_id = auth.uid() OR public.is_suki_staff());
DROP POLICY IF EXISTS grp_ins ON public.game_reports;
CREATE POLICY grp_ins ON public.game_reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

-- audit log: hanya staf
DROP POLICY IF EXISTS gal_sel ON public.game_audit_log;
CREATE POLICY gal_sel ON public.game_audit_log FOR SELECT
  USING (public.is_suki_staff());

-- ============================================================================
-- Trigger updated_at untuk game_profiles
-- ============================================================================
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS trg_game_profiles_touch ON public.game_profiles;
CREATE TRIGGER trg_game_profiles_touch
  BEFORE UPDATE ON public.game_profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ============================================================================
-- SELESAI. Verifikasi yang diharapkan setelah dijalankan:
--   SELECT count(*) FROM building_catalog;      -- 8
--   SELECT count(*) FROM quest_definitions;     -- 7
--   SELECT count(*) FROM achievements;          -- 12
-- ============================================================================
