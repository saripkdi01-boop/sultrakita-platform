-- Tarik lamaran (withdraw application) — policy UPDATE additive & idempoten.
--
-- STATUS: FILE-ONLY — BELUM DIJALANKAN ke Supabase production.
-- Cara menjalankan (butuh akses dashboard Supabase / psql):
--   1. Buka Supabase Dashboard → SQL Editor (project ibvcfdfsjpytwpnxgylm).
--   2. Tempel seluruh isi file ini, jalankan.
--   3. Verifikasi dengan query di bawah ("VERIFIKASI").
--
-- DESAIN:
--   - Satu policy UPDATE baru: pelamar hanya boleh mengubah LAMARANNYA SENDIRI
--     (auth.uid() = applicant_id), dan hanya dari status yang masih bisa
--     ditarik (submitted/viewed/screening/interview) menjadi 'withdrawn'.
--   - WITH CHECK memaksa status baru = 'withdrawn' — pelamar tidak bisa
--     mengubah status menjadi 'accepted'/'rejected'/lainnya lewat policy ini.
--   - Tidak mengubah skema, data, atau policy lain. Aman diulang (idempoten).
--   - Dipakai oleh server action withdrawApplication() di
--     next-app/lib/actions/jobs.ts (client anon-key + sesi user → RLS berlaku).

drop policy if exists applications_own_withdraw on public.job_applications;

create policy applications_own_withdraw on public.job_applications
  for update to authenticated
  using (
    auth.uid() = applicant_id
    and status in ('submitted', 'viewed', 'screening', 'interview')
  )
  with check (
    auth.uid() = applicant_id
    and status = 'withdrawn'
  );

-- VERIFIKASI (jalankan setelah migrasi, harus 1 baris):
-- select policyname, cmd, roles::text as roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename = 'job_applications'
--   and policyname = 'applications_own_withdraw';
