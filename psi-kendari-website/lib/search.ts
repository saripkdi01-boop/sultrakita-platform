import "server-only";
import { getBeritaLokal, getKlarifikasi, getWilayahList } from "./content";
import type { CardItem } from "./card";

/** Pencarian konten lokal (berita lokal, klarifikasi, halaman wilayah). */
export function searchLocal(q: string, limit = 20): CardItem[] {
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 8);
  if (!terms.length) return [];
  const hit = (s: string) => {
    const h = s.toLowerCase();
    return terms.every((t) => h.includes(t));
  };

  const items: CardItem[] = [];
  for (const b of getBeritaLokal()) {
    if (hit(`${b.judul} ${b.ringkasan} ${b.teks}`)) {
      items.push({
        key: `lokal-${b.slug}`,
        title: b.judul,
        href: `/kendari-sultra/berita/${b.slug}`,
        external: false,
        excerpt: b.ringkasan,
        date: b.tanggal,
        rubrik: b.rubrik,
        label: b.label,
        source: "PSI Kendari",
      });
    }
  }
  for (const k of getKlarifikasi()) {
    if (hit(`${k.judul} ${k.klaim} ${k.keputusan} ${k.fakta.map((f) => f.teks).join(" ")}`)) {
      items.push({
        key: `klar-${k.slug}`,
        title: k.judul,
        href: `/klarifikasi/${k.slug}`,
        external: false,
        excerpt: k.klaim,
        date: k.tanggal,
        rubrik: "Klarifikasi",
        label: k.label,
        source: "PSI Kendari",
      });
    }
  }
  for (const w of getWilayahList()) {
    if (hit(`${w.dpd} ${w.nama} ${w.pengurus.map((p) => p.nama ?? "").join(" ")}`)) {
      items.push({
        key: `wil-${w.slug}`,
        title: w.dpd,
        href: `/struktur/${w.slug}`,
        external: false,
        excerpt: w.catatan ?? undefined,
        rubrik: "Struktur",
        label: "TERVERIFIKASI",
        source: "PSI Kendari",
      });
    }
  }
  return items.slice(0, limit);
}
