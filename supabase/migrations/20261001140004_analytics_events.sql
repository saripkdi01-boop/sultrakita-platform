-- SLICE-D: tabel event analytics platform (privacy-friendly).
-- Dipakai oleh `trackEvent` di next-app/lib/analytics/events.ts.
--
-- KEBIJAKAN PRIVASI (ditegakkan secara konvensi + dokumentasi, bukan constraint DB):
--   1. Kolom `props` (jsonb) TIDAK BOLEH berisi PII: tanpa email, nomor telepon/WhatsApp,
--      nama lengkap, alamat persis, NIK, atau data lokasi presisi tinggi.
--      Yang boleh: id internal (listing_id, job_id), kategori, label umum, nominal,
--      flag boolean, dan nilai agregat.
--   2. `user_id` adalah id internal auth (pseudonim), bukan identitas langsung.
--   3. `session_id` harus token acak anonim per sesi browser (mis. crypto.randomUUID()
--      di cookie httpOnly), BUKAN fingerprint perangkat atau id yang bisa dilacak lintas situs.
--   4. `path` hanya pathname (tanpa query string) — query bisa mengandung PII
--      (mis. ?q=email@... atau token). `trackEvent` memotong query string otomatis.
--   5. Retensi: hapus baris > 180 hari via cron/pg_cron (lihat komentar di bawah).
--      Implementasi job retensi di luar cakupan migrasi ini.
--
-- RLS:
--   - INSERT: publik (anon + authenticated) boleh mencatat event. Ini disengaja agar
--     event anonim (tanpa login) tetap tercatat; keamanan dijaga oleh larangan PII
--     di atas + tidak ada kolom sensitif di tabel ini.
--   - SELECT/UPDATE/DELETE: hanya admin (role 'admin' / 'super_admin' di public.profiles).
--     UPDATE/DELETE praktis tidak dipakai aplikasi; hanya dibuka untuk admin agar
--     retensi/pembersihan bisa berjalan dengan kredensial admin bila diperlukan.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid null references auth.users(id) on delete set null,
  session_id text null,
  event_name text not null,
  props jsonb not null default '{}'::jsonb,
  path text null,
  constraint analytics_events_event_name_not_blank check (char_length(btrim(event_name)) > 0),
  constraint analytics_events_props_is_object check (jsonb_typeof(props) = 'object')
);

create index if not exists analytics_events_event_created_idx
  on public.analytics_events (event_name, created_at desc);

create index if not exists analytics_events_created_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id, created_at desc)
  where session_id is not null;

alter table public.analytics_events enable row level security;

-- INSERT publik: event analytics boleh dicatat siapa pun (anonim ok).
drop policy if exists analytics_events_insert_public on public.analytics_events;
create policy analytics_events_insert_public
  on public.analytics_events for insert to anon, authenticated
  with check (true);

-- SELECT hanya admin.
drop policy if exists analytics_events_select_admin on public.analytics_events;
create policy analytics_events_select_admin
  on public.analytics_events for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- UPDATE/DELETE hanya admin (untuk retensi/pembersihan manual).
drop policy if exists analytics_events_modify_admin on public.analytics_events;
create policy analytics_events_modify_admin
  on public.analytics_events for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

-- Catatan retensi (manual/cron, bukan bagian migrasi otomatis):
--   delete from public.analytics_events where created_at < now() - interval '180 days';
