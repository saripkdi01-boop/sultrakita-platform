# SUKI Kampung — Scaffold Fase 1 (`/kampung`)

Branch: `fitur/kampung-scaffold` · Basis: `origin/main` · Status: **scaffold terverifikasi, BELUM untuk production**

## Yang di-scaffold

| File | Isi |
|---|---|
| `app/kampung/page.tsx` | Rute `/kampung` (client component, `AppLayout`, iframe ke game) |
| `app/kampung/layout.tsx` | Metadata SEO (id-ID) |
| `app/kampung/kampung.css` | Style namespace `skk-*` |
| `public/kampung/index.html` | **Game playable Fase 1, byte-identical** dengan `~/workspace/your_files/suki-kampung/game/index.html` (sudah QA: 19/19 test) |
| `lib/kampung/catalog.ts` | Katalog bangunan **kanonis** + kurva XP + konstanta (sumber kebenaran backend; selaras `02-EKONOMI.md` & seed SQL) |
| `app/api/kampung/status/route.ts` | `GET /api/kampung/status` → `{ ok, data: { phase: 1, mode: 'demo', backend: 'not-implemented' } }` — jujur, bukan stub palsu |
| `supabase/migrations/20261003060000_suki_kampung.sql` | Skema 20 tabel + seed + 34 RLS policy — **file saja, BELUM dijalankan** |

## Yang SENGAJA tidak disentuh

- Navbar/launcher Ekosistem (butuh keputusan desain penempatan menu — follow-up)
- File production lain, migrasi database (butuh persetujuan eksplisit per kejadian), env, deploy

## Mode demo vs kanonis

Game di `public/kampung/index.html` memakai **tuning demo** (interval panen detik) agar seru
dicoba. `lib/kampung/catalog.ts` memakai **angka kanonis** (interval menit) untuk backend.
Keduanya dicatat di `~/workspace/your_files/suki-kampung/docs/09-STATUS-FITUR.md`; saat backend
Fase 2 dibangun, selaraskan SATU ARAH: demo → kanonis.

## Verifikasi

- `npm run typecheck` (tsc --noEmit)
- `npm run lint`
- `npm run build`

## Langkah berikut (butuh persetujuan Sarip per kejadian)

1. Push branch → PR → review → merge ke `main` (belum dilakukan)
2. Jalankan migrasi `20261003060000_suki_kampung.sql` via SQL editor (belum dilakukan)
3. Deploy production via Vercel (otomatis pasca-merge; verifikasi smoke test)
4. Fase 2: API server-side + port game ke React + sinkronisasi tuning
