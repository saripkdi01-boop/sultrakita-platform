/**
 * Peta kategori WordPress psi.id -> rubrik situs ini.
 * ID kategori sesuai hasil pemetaan psi.id (27 Nov 2026) di masterprompt.
 */

export type RubrikKey = "berita-psi" | "siaran-pers" | "kolom-opini" | "blog-ketum" | "galeri";

export const PSI_CAT = {
  LIPUTAN: 49,
  LIPUTAN_DAERAH: 72,
  LIPUTAN_NASIONAL: 71,
  SIARAN_PERS: 57,
  SIKAP_PSI: 133,
  PERNYATAAN_SIKAP_DPP: 70,
  KOLOM: 69,
  OPINI: 50,
  DISKURSUS: 59,
  INSPIRASI: 4,
  DIARY_PSI: 100,
  KULTWIT: 58,
  BLOG_KETUM: 369,
  BLOG_SOLIDARITAS: 127,
  GALERI: 3,
  PIDATO_KETUM: 68,
  KANDIDAT: 289,
  PUBLIKASI: 290,
} as const;

/** Label per kategori psi.id (nama asli psi.id, kecuali label gabungan yang diminta). */
export const CATEGORY_INFO: Record<number, { rubrik: RubrikKey; label: string; slug: string }> = {
  [PSI_CAT.SIARAN_PERS]: { rubrik: "siaran-pers", label: "Siaran Pers", slug: "siaran-pers" },
  [PSI_CAT.PERNYATAAN_SIKAP_DPP]: { rubrik: "siaran-pers", label: "Sikap DPP", slug: "pernyataan-sikap-dpp-psi" },
  [PSI_CAT.SIKAP_PSI]: { rubrik: "siaran-pers", label: "Sikap PSI", slug: "sikap-psi" },
  [PSI_CAT.LIPUTAN_NASIONAL]: { rubrik: "berita-psi", label: "Liputan Nasional", slug: "liputan-nasional" },
  [PSI_CAT.LIPUTAN_DAERAH]: { rubrik: "berita-psi", label: "Liputan Daerah", slug: "liputan-daerah" },
  [PSI_CAT.LIPUTAN]: { rubrik: "berita-psi", label: "Liputan", slug: "liputan" },
  [PSI_CAT.KOLOM]: { rubrik: "kolom-opini", label: "Kolom", slug: "kolom" },
  [PSI_CAT.OPINI]: { rubrik: "kolom-opini", label: "Opini", slug: "opini" },
  [PSI_CAT.DISKURSUS]: { rubrik: "kolom-opini", label: "Diskursus", slug: "diskursus" },
  [PSI_CAT.INSPIRASI]: { rubrik: "kolom-opini", label: "Inspirasi", slug: "inspirasi" },
  [PSI_CAT.DIARY_PSI]: { rubrik: "kolom-opini", label: "Diary PSI", slug: "diary-psi" },
  [PSI_CAT.BLOG_SOLIDARITAS]: { rubrik: "kolom-opini", label: "Blog Solidaritas", slug: "blog-solidaritas" },
  [PSI_CAT.PIDATO_KETUM]: { rubrik: "kolom-opini", label: "Pidato Ketum", slug: "pidato-ketua-umum" },
  [PSI_CAT.BLOG_KETUM]: { rubrik: "blog-ketum", label: "Blog Ketum", slug: "blog-ketum" },
  [PSI_CAT.GALERI]: { rubrik: "galeri", label: "Galeri PSI", slug: "galeri-psi" },
};

export const RUBRIK: Record<RubrikKey, { label: string; categories: number[] }> = {
  "berita-psi": { label: "Berita PSI", categories: [PSI_CAT.LIPUTAN_NASIONAL, PSI_CAT.LIPUTAN_DAERAH] },
  "siaran-pers": {
    label: "Siaran Pers",
    categories: [PSI_CAT.SIARAN_PERS, PSI_CAT.PERNYATAAN_SIKAP_DPP, PSI_CAT.SIKAP_PSI],
  },
  "kolom-opini": {
    label: "Kolom & Opini",
    categories: [
      PSI_CAT.KOLOM,
      PSI_CAT.OPINI,
      PSI_CAT.DISKURSUS,
      PSI_CAT.INSPIRASI,
      PSI_CAT.DIARY_PSI,
      PSI_CAT.PIDATO_KETUM,
    ],
  },
  "blog-ketum": { label: "Blog Ketum", categories: [PSI_CAT.BLOG_KETUM] },
  galeri: { label: "Galeri", categories: [PSI_CAT.GALERI] },
};

/** Urutan prioritas penentuan rubrik bila satu artikel punya beberapa kategori. */
const PRIORITY: number[] = [
  PSI_CAT.BLOG_KETUM,
  PSI_CAT.PIDATO_KETUM,
  PSI_CAT.PERNYATAAN_SIKAP_DPP,
  PSI_CAT.SIKAP_PSI,
  PSI_CAT.SIARAN_PERS,
  PSI_CAT.OPINI,
  PSI_CAT.DISKURSUS,
  PSI_CAT.INSPIRASI,
  PSI_CAT.DIARY_PSI,
  PSI_CAT.BLOG_SOLIDARITAS,
  PSI_CAT.KOLOM,
  PSI_CAT.LIPUTAN_DAERAH,
  PSI_CAT.LIPUTAN_NASIONAL,
  PSI_CAT.LIPUTAN,
  PSI_CAT.GALERI,
];

export function resolveRubrik(categoryIds: number[]): { rubrik: RubrikKey; label: string } {
  for (const id of PRIORITY) {
    if (categoryIds.includes(id)) {
      const info = CATEGORY_INFO[id];
      return { rubrik: info.rubrik, label: info.label };
    }
  }
  return { rubrik: "berita-psi", label: "Berita PSI" };
}

/** Filter rubrik di /berita-psi. */
export const BERITA_FILTERS: { key: string; label: string; categories: number[] }[] = [
  { key: "semua", label: "Semua", categories: [PSI_CAT.LIPUTAN_NASIONAL, PSI_CAT.LIPUTAN_DAERAH, PSI_CAT.SIARAN_PERS, PSI_CAT.PERNYATAAN_SIKAP_DPP, PSI_CAT.SIKAP_PSI, PSI_CAT.KOLOM, PSI_CAT.OPINI, PSI_CAT.DISKURSUS, PSI_CAT.INSPIRASI, PSI_CAT.DIARY_PSI, PSI_CAT.PIDATO_KETUM, PSI_CAT.BLOG_KETUM] },
  { key: "liputan-nasional", label: "Liputan Nasional", categories: [PSI_CAT.LIPUTAN_NASIONAL] },
  { key: "liputan-daerah", label: "Liputan Daerah", categories: [PSI_CAT.LIPUTAN_DAERAH] },
  { key: "siaran-pers", label: "Siaran Pers & Sikap", categories: RUBRIK["siaran-pers"].categories },
  { key: "kolom", label: "Kolom & Opini", categories: RUBRIK["kolom-opini"].categories },
  { key: "blog-ketum", label: "Blog Ketum", categories: [PSI_CAT.BLOG_KETUM] },
];

/** Kata kunci penyaring Liputan Daerah untuk rubrik "Kendari & Sultra". */
export const KENDARI_KEYWORDS = ["Kendari", "Sulawesi Tenggara", "Sultra"];

/** Halaman kategori di psi.id (untuk tautan "lihat di psi.id"). */
export function psiCategoryUrl(id: number): string {
  const info = CATEGORY_INFO[id];
  return info ? `https://psi.id/category/${info.slug}/` : "https://psi.id/";
}
