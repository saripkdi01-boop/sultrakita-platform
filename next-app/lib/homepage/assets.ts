/**
 * Peta aset visual homepage.
 *
 * Aset hasil generate (folder `aset-homepage-suki-apps/` + MANIFEST.md milik owner)
 * BELUM ada di repo saat PR ini dibuat. Cara mengaktifkan setiap aset:
 *   1. Unggah file ke `public/images/homepage/` dengan NAMA di kolom `src`
 *      (ganti nama dari `media-generation-<peran>-0-<hash>.webp`).
 *   2. Ubah `uploaded` menjadi `true`.
 * Selama `uploaded: false`, homepage memakai `fallback` — foto lokal asli yang
 * sudah ada di repo (bukan stok baru) — atau tidak merender slot sama sekali.
 * Tidak ada gambar placeholder abu-abu.
 *
 * Catatan manifest: wajah di foto hasil generate BUKAN klien nyata → jangan pernah
 * diberi caption sebagai klien. Foto hero asli tetap prioritas bila sudah ada.
 */

export type HomeAsset = {
  src: string;
  /** [ASET BELUM DIUNGGAH] selama false. */
  uploaded: boolean;
  fallback: string | null;
  alt: string;
  /** Sumber di folder aset owner (untuk pencocokan). */
  sourceFile: string;
};

export const HOME_ASSETS = {
  /* [ASET SALSA] — karakter pemandu 3D SukiOffice (hijab, apron). Belum ada file render. */
  salsa: {
    src: '/images/homepage/salsa-pemandu.webp',
    uploaded: false,
    fallback: null,
    alt: 'Salsa, pemandu Suki Apps, tersenyum menyambut pengunjung',
    sourceFile: 'render Salsa dari Ren (DSN-02) — belum diserahkan',
  },
  /* [ASET BELUM DIUNGGAH] */
  heroUmkm: {
    src: '/images/homepage/hero-umkm-kendari.webp',
    uploaded: false,
    fallback: '/images/komunitas-2.jpg',
    alt: 'Pedagang UMKM berhijab tersenyum di lapak buah dan kue di pasar',
    sourceFile: 'media-generation-hero-umkm-kendari-0-bf36575a-….webp',
  },
  /* [ASET BELUM DIUNGGAH] */
  bahteramas: {
    src: '/images/homepage/jembatan-bahteramas-golden-hour.webp',
    uploaded: false,
    fallback: '/images/jembatan-bahteramas.jpg',
    alt: 'Jembatan Bahteramas melintasi Teluk Kendari dilihat dari udara',
    sourceFile: 'media-generation-jembatan-bahteramas-golden-hou-0-c3248e00-….webp',
  },
  /* [ASET BELUM DIUNGGAH] — foto ilustrasi, BUKAN klien. */
  agenProperti: {
    src: '/images/homepage/properti-agen-keluarga.webp',
    uploaded: false,
    fallback: null,
    alt: 'Agen properti menunjukkan rumah kepada sebuah keluarga (foto ilustrasi)',
    sourceFile: 'media-generation-properti-agen-keluarga-0-9177d2f2-….webp',
  },
  /* [ASET BELUM DIUNGGAH] */
  kreatorMuda: {
    src: '/images/homepage/generasi-muda-kreator.webp',
    uploaded: false,
    fallback: '/images/komunitas-3.jpg',
    alt: 'Anak muda Kendari berkumpul sambil melihat layar HP bersama',
    sourceFile: 'media-generation-generasi-muda-kreator-0-0e6b55d4-….webp',
  },
  /* [ASET BELUM DIUNGGAH] — belum digenerate (prompt di MANIFEST bagian 4). Slot tidak dirender sampai ada. */
  pasarPagi: {
    src: '/images/homepage/pasar-pagi-kendari.webp',
    uploaded: false,
    fallback: null,
    alt: 'Suasana Pasar Pagi Kendari',
    sourceFile: 'belum digenerate — lihat MANIFEST.md bagian 4',
  },
  /* [ASET BELUM DIUNGGAH] — belum digenerate (prompt di MANIFEST bagian 4). Slot tidak dirender sampai ada. */
  bahari: {
    src: '/images/homepage/bahari-nelayan-kendari.webp',
    uploaded: false,
    fallback: null,
    alt: 'Nelayan Kendari menyiapkan perahu di pesisir',
    sourceFile: 'belum digenerate — lihat MANIFEST.md bagian 4',
  },
} satisfies Record<string, HomeAsset>;

/** Path yang dipakai: file baru bila sudah diunggah, else fallback lokal, else null. */
export function assetSrc(asset: HomeAsset): string | null {
  return asset.uploaded ? asset.src : asset.fallback;
}
