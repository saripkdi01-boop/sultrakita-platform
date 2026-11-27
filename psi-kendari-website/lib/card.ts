import type { VerificationLabel } from "./labels";
import type { PsiPost } from "./psi-types";

/** Bentuk kartu berita yang seragam untuk psi.id, konten lokal, dan RSS. */
export type CardItem = {
  key: string;
  title: string;
  href: string;
  external: boolean;
  excerpt?: string;
  date?: string;
  rubrik?: string;
  label: VerificationLabel;
  source?: string;
  image?: { src: string; alt: string; credit?: string } | null;
  /** Tampilkan tanggal saja (tanpa "x jam lalu") — untuk konten lokal. */
  dateOnly?: boolean;
};

export function psiToCard(p: PsiPost): CardItem {
  return {
    key: `psi-${p.id}`,
    title: p.title,
    href: `/berita-psi/${p.slug}`,
    external: false,
    excerpt: p.excerpt,
    date: p.date,
    rubrik: p.rubrikLabel,
    label: "TERVERIFIKASI",
    source: "psi.id",
    image: p.image ? { src: p.image.cardSrc, alt: p.image.alt, credit: "Foto: psi.id" } : null,
  };
}

/** Kartu untuk berita lokal (/content/berita-lokal). */
export function lokalToCard(b: {
  slug: string;
  judul: string;
  ringkasan: string;
  tanggal: string;
  rubrik: string;
  label: VerificationLabel;
  gambar: { src: string; alt: string; kredit?: string } | null;
}): CardItem {
  return {
    key: `lokal-${b.slug}`,
    title: b.judul,
    href: `/kendari-sultra/berita/${b.slug}`,
    external: false,
    excerpt: b.ringkasan,
    date: b.tanggal,
    rubrik: b.rubrik,
    label: b.label,
    source: "PSI Kendari",
    dateOnly: true,
    image: b.gambar ? { src: b.gambar.src, alt: b.gambar.alt, credit: b.gambar.kredit ? `Foto: ${b.gambar.kredit}` : undefined } : null,
  };
}
