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
