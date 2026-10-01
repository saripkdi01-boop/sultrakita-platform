# SLICE-B LOG — Admin control plane

## 2026-10-01 ~13:00 WITA — Implementasi modul admin (overview, users, moderation, settings)

### File yang dibuat/diubah
| File | Status |
|---|---|
| `supabase/migrations/20261001140002_admin_site_settings.sql` | baru — tabel `site_settings` + seed 3 flag + RLS admin-only + kolom `profiles.is_suspended`/`admin_notes` + policy baca `profile_contacts` untuk admin + helper `suki_is_admin()` |
| `next-app/lib/settings/flags.ts` | baru — `getFlag(key, fallback)`, cache 30 dtk in-memory, gagal-buka → fallback (kontrak bersama, slice ini pemilik) |
| `next-app/lib/admin/guards.ts` | baru — `requireRole(...roles)`, `requireSuperAdmin()`, `maskPII(email/phone)`, matriks peran least-privilege |
| `next-app/lib/admin/actions.ts` | baru — server actions: suspend/restore user, ubah role, catatan internal, moderasi laporan, CRUD settings; semua dengan otorisasi server-side + `logAuditEvent` |
| `next-app/app/admin/overview/page.tsx` | baru — KPI jujur dari query nyata + tren 7 hari + aktivitas audit (try/catch) |
| `next-app/app/admin/users/page.tsx` | baru — daftar + search (nama/username/email) + filter role/status + pagination 50/halaman, PII di-mask |
| `next-app/app/admin/users/[id]/page.tsx` + `UserActions.tsx` | baru — detail profil (PII di-mask), roles, suspend/restore, ubah peran (super_admin saja), catatan internal |
| `next-app/app/admin/moderation/page.tsx` + `ModerationActions.tsx` | baru — antrean `marketplace_reports`, aksi: tandai ditinjau / selesaikan / tolak / takedown listing; alasan wajib + audit log |
| `next-app/app/admin/settings/page.tsx` + `SettingForms.tsx` | baru — CRUD `site_settings` (validasi JSON), toggle `maintenance_mode`, catatan "berlaku ≤60 detik (cache)" |
| `next-app/app/admin/dashboard/page.tsx` | edit — tambah 4 modul baru (overview, users, moderation, settings) dengan deskripsi Indonesia; 4 modul lama dipertahankan |

### Hasil verifikasi
- `npx tsc --noEmit`: SEMUA file SLICE-B lolos. Satu-satunya error terkait file saya adalah `TS2307: Cannot find module '@/lib/security/audit'` — modul itu milik SLICE-A (kontrak bersama) dan saat commit ini BELUM dibuat di worktree; sesuai kontrak, import tetap dipertahankan (lihat Blocker).
- `npx next lint` (file-file SLICE-B): No ESLint warnings or errors.
- `npm run lint` penuh tidak dijalankan (cukup next lint pada file milik slice).
- `next build` tidak dijalankan (terlalu lama; dicatat untuk koordinator).

### Keputusan
1. **RLS `site_settings`**: spesifikasi menyebut "tanpa INSERT/DELETE publik" — diartikan sebagai tanpa akses non-admin. Karena tugas menuntut CRUD, INSERT/DELETE dibuka KHUSUS admin (`suki_is_admin()`), sama seperti SELECT/UPDATE. Semua mutasi juga dicatat di audit trail di layer aplikasi.
2. **Kolom baru `profiles`**: `is_suspended boolean default false` dan `admin_notes text` ditambahkan via migration sendiri (additive, `if not exists`) karena belum ada kolom yang cocok.
3. **Policy `profile_contacts`**: tabel ini tidak punya SELECT policy sama sekali (RLS aktif → tak terbaca siapa pun via anon key). Ditambahkan policy baca khusus admin agar modul users bisa menampilkan/mencari email.
4. **`super_admin` di `user_roles`**: check constraint `user_roles.role` hanya mengizinkan buyer/seller/admin/creator/community/moderator — `super_admin` HANYA diakui lewat `profiles.role`. Ubah peran ke `super_admin` hanya mengubah `profiles.role` (tidak menyentuh `user_roles`).
5. **Overview "orders"**: memakai tabel `orders` yang ada, dilabeli jujur "Orders (sandbox)" — belum ada pembayaran nyata.
6. **Suspend juga memblokir guard**: `resolveRoles` melempar bila `profiles.is_suspended = true` (akun ditangguhkan tidak bisa memakai guard admin).

### Blocker / dependensi
- **`next-app/lib/security/audit.ts` BELUM ADA** (milik SLICE-A, dibuat paralel). File `lib/admin/actions.ts` mengimpor `logAuditEvent` dari path kontrak tersebut sesuai instruksi — saat SLICE-A selesai, integrasi otomatis. tsc akan hijau penuh setelah file itu ada.
- **Migrasi belum dijalankan ke database mana pun** — SQL ditulis idempotent; koordinator/parent yang menjalankan ke Supabase.
- **Playwright smoke belum** — halaman belum di-render; serahkan ke koordinator.
