# Checklist Verifikasi Gemini Production dan AI Listing Feedback

**Project:** SultraKita / SUKI Platform  
**Tanggal:** 7 September 2026  
**Scope:** Perubahan `GEMINI_MODEL` ke `gemini-3.6-flash`, deployment Vercel, successful generation, dan feedback seller.

## 1. Perubahan source code

| Checklist | Status | Bukti / Catatan |
|---|---:|---|
| Default model server action menggunakan `gemini-3.6-flash` | ✅ | `next-app/lib/actions/ai-listing.ts` menggunakan fallback default `gemini-3.6-flash`. |
| `GEMINI_API_KEY` tetap server-only | ✅ | Tidak memakai prefix `NEXT_PUBLIC_`; tidak ditampilkan ke browser atau telemetry. |
| Validasi MIME foto tetap aktif | ✅ | JPG, PNG, dan WebP saja. |
| Batas ukuran foto 8 MB tetap aktif | ✅ | Divalidasi di client dan server. |
| Listing palsu tidak dibuat ketika Gemini gagal | ✅ | Semua error masuk ke fallback manual. |
| Quota/rate-limit dibedakan dari provider error | ✅ | Telemetry dan pesan error memiliki klasifikasi terpisah. |
| Response JSON Gemini divalidasi | ✅ | Field, kategori, harga, dan tags dibersihkan sebelum dipakai. |
| `generationId` dibuat hanya setelah generation sukses | ✅ | UUID dikembalikan bersama hasil draft AI. |
| Feedback tidak menyimpan foto, prompt, atau response AI | ✅ | Action hanya menyimpan metadata feedback dan generation UUID. |

## 2. Environment configuration

| Checklist | Status | Bukti / Catatan |
|---|---:|---|
| `.env.example` root diperbarui | ✅ | Menggunakan `GEMINI_MODEL=gemini-3.6-flash`. |
| `next-app/.env.example` diperbarui | ✅ | Menggunakan `GEMINI_MODEL=gemini-3.6-flash`. |
| Dokumentasi AI Listing Assistant diperbarui | ✅ | Model rekomendasi sudah `gemini-3.6-flash`. |
| Dokumentasi Vercel environment diperbarui | ✅ | Nilai yang direkomendasikan sudah `gemini-3.6-flash`. |
| Soft-launch readiness diperbarui | ✅ | Model terverifikasi ditulis sebagai `gemini-3.6-flash`. |
| `GEMINI_API_KEY` Production tersedia | ◐ | Server production sebelumnya berhasil mencapai provider Gemini, tetapi nilai secret tidak dapat dibaca melalui MCP dan tidak boleh ditampilkan. |
| `GEMINI_MODEL=gemini-3.6-flash` tersimpan di Vercel Production | ◐ | User menyatakan perubahan sudah dilakukan; MCP tidak mengekspos nilai environment, sehingga perlu dibuktikan melalui telemetry request baru. |
| `GEMINI_API_BASE` Production benar | ◐ | Nilai yang diharapkan: `https://generativelanguage.googleapis.com/v1beta`; belum dapat dibaca langsung dari Vercel. |

## 3. Diagnosis sebelum perubahan

| Checklist | Status | Bukti / Catatan |
|---|---:|---|
| Production sebelumnya menggunakan `gemini-2.5-flash` | ✅ | Runtime telemetry mencatat `model: gemini-2.5-flash`. |
| Error sebelumnya diklasifikasikan sebagai provider fallback | ✅ | Telemetry mencatat `reason: provider`. |
| Model lama diuji ke provider Gemini | ✅ | Provider mengembalikan HTTP 404 `NOT_FOUND`. |
| Error dipastikan bukan quota/rate-limit | ✅ | Request gagal pada model availability sebelum mencapai tahap quota. |
| Model `gemini-3.6-flash` tersedia | ✅ | Metadata model berhasil diakses dan mendukung `generateContent`. |
| Model `gemini-3.6-flash` berhasil melakukan generation lokal | ✅ | Probe lokal mengembalikan HTTP 200 dan satu candidate. |

## 4. Local E2E dan regression

| Checklist | Status | Bukti / Catatan |
|---|---:|---|
| Successful Gemini generation lokal | ✅ | Generation berhasil menggunakan `gemini-3.6-flash`. |
| Draft title dan description tersedia | ✅ | Struktur response valid. |
| Rentang harga valid | ✅ | `estimated_price_max >= estimated_price_min`. |
| Suggested tags berbentuk array | ✅ | Validasi lokal berhasil. |
| `generationId` UUID valid | ✅ | E2E memvalidasi format UUID. |
| Feedback dengan UUID invalid ditolak | ✅ | Validasi Zod aktif. |
| Feedback tanpa session authenticated masuk safe fallback | ✅ | Tidak ada crash dan tidak ada row dibuat. |
| Listing tidak dipublish otomatis | ✅ | E2E hanya menghasilkan draft. |
| Regression test AI listing | ✅ | `npm run test:ai-listing` berhasil. |
| Type-check | ✅ | `npx tsc --noEmit` berhasil. |
| Production build | ✅ | `npm run build` berhasil. |
| Repository bersih setelah perubahan | ✅ | `main` sinkron dengan `origin/main`; tidak ada perubahan lokal tersisa. |

## 5. Deployment Vercel

| Checklist | Status | Bukti / Catatan |
|---|---:|---|
| Commit source model baru dipush ke GitHub | ✅ | Commit `df6f85d fix: use available Gemini listing model`. |
| Deployment production dari commit model baru pernah READY | ✅ | Deployment `dpl_Go3A7Fh65nAuUXcNvMwuCDM8NYpS` berstatus READY. |
| Redeploy setelah perubahan environment dijalankan | ✅ | Deployment `dpl_5uv1DcJTc2yBKQR2SCRjDJd1aHYJ` dibuat dengan source `redeploy`. |
| Redeploy environment terbaru berstatus READY | ✅ | `dpl_5uv1DcJTc2yBKQR2SCRjDJd1aHYJ` berstatus READY dan memiliki alias production. |
| Build error pada redeploy | ✅ Tidak ada | Build selesai dengan warning webpack performa non-blocking. |
| Runtime errors 30 menit terakhir | ✅ Tidak ada | Vercel tidak menemukan runtime error. |
| Alias production aktif | ✅ | Deployment terbaru memiliki alias `sultrakita-platform.vercel.app`. |
| Deployment memakai environment Production | ✅ | Target deployment tercatat `production`. |

## 6. Bukti yang masih perlu dilengkapi

| Checklist | Status | Langkah berikutnya |
|---|---:|---|
| Memicu request Generate pada deployment terbaru | ☐ | Buka `/properti/create`, unggah foto valid, lalu klik Generate. Jangan publish listing. |
| Telemetry mencatat `model: gemini-3.6-flash` | ☐ | Periksa Vercel runtime logs setelah request Generate baru. |
| Telemetry mencatat `outcome: success` | ☐ | Pastikan tidak ada `fallback/provider` pada request terbaru. |
| Feedback UI muncul setelah successful generation | ☐ | Pastikan tombol “Ya, membantu” dan “Perlu perbaikan” tampil. |
| Submit feedback seller authenticated | ☐ | Pilih feedback, isi komentar opsional, lalu klik “Kirim feedback”. |
| Row feedback masuk ke Supabase | ☐ | Verifikasi row menggunakan query terbatas dan tanpa menampilkan data sensitif. |
| Seller dapat mengakses feedback miliknya | ☐ | Uji read-own dengan session seller. |
| Seller lain tidak dapat mengakses feedback tersebut | ☐ | Uji cross-seller access denial menggunakan akun QA kedua. |
| Duplicate submit idempotent | ☐ | Kirim generation UUID yang sama dua kali dan pastikan tidak ada duplikasi. |
| Tidak ada listing yang terbit selama QA | ☐ | Hentikan pengujian sebelum tombol submit/publish listing. |

## 7. Kesimpulan status

**Status keseluruhan: konfigurasi dan deployment sudah diperbarui, tetapi aktivasi model pada request production baru belum terbukti melalui telemetry.**

Deployment hasil redeploy sudah **READY**, tidak memiliki build error, dan tidak memiliki runtime error. Namun, log generation terakhir yang tersedia masih berasal dari request sebelum perubahan dan masih mencatat `gemini-2.5-flash`. Karena itu, acceptance criterion final adalah melakukan satu request Generate baru pada deployment terbaru dan memverifikasi telemetry `gemini-3.6-flash` dengan `outcome: success`.

Tidak ada `GEMINI_API_KEY` yang ditampilkan, disalin ke source code, atau dimasukkan ke dokumen ini.
