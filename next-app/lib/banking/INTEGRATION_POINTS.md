# Titik Integrasi Perbankan Indonesia — SUKI Apps

> Status: **arsitektur siap, integrasi nyata BELUM dilakukan.**
> Tidak ada koneksi ke bank sungguhan. Tidak ada kredensial nyata.

## 1. Lapisan yang sudah disiapkan

| Lapisan | File | Status |
|---|---|---|
| Interface `BankingProvider` | `lib/banking/types.ts` | ✅ Siap |
| Implementasi mock/stub | `lib/banking/mock-provider.ts` | ✅ Siap (in-memory, deterministik) |
| Factory `getBankingProvider()` | `lib/banking/index.ts` | ✅ Siap (env `BANKING_PROVIDER`) |
| Server actions (submit/status, audit) | `lib/banking/actions.ts` | ✅ Siap (wajib login) |
| Webhook fail-closed (HMAC-SHA256) | `app/api/banking/webhook/route.ts` | ✅ Siap (butuh `BANKING_WEBHOOK_SECRET`) |
| Audit trail aksi sensitif | `lib/security/audit.ts` (`BANKING_*`) | ✅ Siap |
| Skema DB `banking_kpr_applications` | `supabase/migrations/20261009140000_*` | ⏳ File siap, BELUM dijalankan |

## 2. Di mana OAuth2/OIDC bank dipasang nanti

Alur yang dirancang (belum diimplementasi):

```
1. User klik "Ajukan KPR via Bank X" di halaman properti
   → server action submitKprApplication() (sudah ada, pakai mock)

2. NANTI: sebelum submit ke bank nyata, redirect ke authorization endpoint bank:
   → app/api/banking/oauth/[bank]/route.ts          (BELUM DIBUAT)
     - GET: bangun authorization URL (client_id, redirect_uri, scope=openid+kpr)
     - state + PKCE (wajib untuk public client)

3. Bank redirect kembali:
   → app/api/banking/oauth/[bank]/callback/route.ts  (BELUM DIBUAT)
     - Tukarkan code → token di token endpoint bank (server-side saja)
     - Simpan access/refresh token TERENKRIPSI (bukan plain) —
       kandidat: kolom terenkripsi via pgcrypto atau secret manager
     - JANGAN simpan token di localStorage / cookie non-httpOnly

4. Pengajuan KPR memakai access token bank:
   → provider nyata (kelas baru implements BankingProvider)
     - Authorization: Bearer <token> ke API bank
     - Refresh otomatis bila 401 (dengan lock agar tidak race)
```

**Titik pasang:** buat `lib/banking/providers/<bank>.ts` yang mengimplementasikan
`BankingProvider`, daftarkan di `getBankingProvider()`. Kode pemanggil
(server actions, webhook) tidak berubah.

## 3. Session handling (bank-grade)

Yang sudah berlaku di repo dan dipakai alur banking:

- `requireServerUser()` — session diambil server-side via Supabase Auth;
  tidak ada token di client JS.
- Server actions banking wajib login; guest ditolak dengan pesan jelas.
- Audit trail append-only untuk setiap aksi finansial sensitif
  (`banking.kpr.submit`, `banking.kpr.status`, `banking.identity.verify`).
- NIK tidak disimpan plain — hanya SHA-256 hash referensi. Dokumen KTP
  (bila ada) hanya diteruskan ke bank saat verifikasi, tidak diarsip SUKI.

Yang masih dibutuhkan saat bank nyata dipasang:

- Enkripsi token OAuth bank saat disimpan (jangan plain di DB).
- Kebijakan retensi: hapus jejak NIK/hash setelah pengajuan final + masa retensi.
- Rate limit khusus endpoint banking (pakai preset `auth` di lib/rate-limit.ts).

## 4. Yang masih dibutuhkan dari pihak bank

Untuk setiap bank yang ingin diintegrasikan, minta ke PIC bank:

1. **Kredensial sandbox**: client_id, client_secret, endpoint sandbox.
2. **Spesifikasi OAuth2/OIDC**: authorization endpoint, token endpoint,
   scope yang tersedia, apakah PKCE didukung.
3. **Spesifikasi API KPR**: endpoint pengajuan, format payload, kode bank,
   daftar status & transisinya.
4. **Spesifikasi webhook**: URL yang didaftarkan, format payload,
   algoritma signature (disarankan HMAC-SHA256 raw body — sudah didukung),
   kebijakan retry.
5. **Spesifikasi e-KYC**: endpoint verifikasi, field yang dibutuhkan
   (NIK saja / NIK+selfie), SLA, dan kebijakan data (apa yang boleh disimpan).
6. **Kontak teknis + SLA** untuk error/eskalasi.

## 5. Batasan yang tetap berlaku

- DILARANG menghubungi API bank sungguhan tanpa kontrak kerja sama resmi.
- DILARANG memakai kredensial nyata di development/testing.
- DILARANG menyimpan NIK plain, foto KTP, atau token bank tanpa enkripsi.
- Migrasi DB banking butuh approval suki (file migrasi sudah disiapkan,
  belum dijalankan).

<!-- rebuild trigger 2026-10-11 -->
