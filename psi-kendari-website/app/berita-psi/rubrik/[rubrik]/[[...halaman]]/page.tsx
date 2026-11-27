import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BERITA_FILTERS } from "@/config/psi-categories";
import { BeritaPsiListing, filterHref } from "@/components/psi/BeritaPsiListing";

export const revalidate = 900;

type Props = { params: Promise<{ rubrik: string; halaman?: string[] }> };

export function generateStaticParams() {
  return BERITA_FILTERS.filter((f) => f.key !== "semua").map((f) => ({ rubrik: f.key, halaman: [] }));
}

function parse(rubrik: string, halaman?: string[]): { key: string; page: number } | null {
  if (!BERITA_FILTERS.some((f) => f.key === rubrik)) return null;
  if (!halaman || halaman.length === 0) return { key: rubrik, page: 1 };
  if (halaman.length > 1 || !/^\d{1,3}$/.test(halaman[0])) return null;
  const page = Number(halaman[0]);
  return page >= 1 ? { key: rubrik, page } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubrik, halaman } = await params;
  const p = parse(rubrik, halaman);
  if (!p) return {};
  const f = BERITA_FILTERS.find((x) => x.key === p.key)!;
  return {
    title: p.page > 1 ? `${f.label} — halaman ${p.page}` : f.label,
    description: `Kumpulan artikel ${f.label} dari psi.id, situs resmi DPP PSI.`,
    alternates: { canonical: filterHref(p.key, p.page) },
  };
}

export default async function RubrikPage({ params }: Props) {
  const { rubrik, halaman } = await params;
  const p = parse(rubrik, halaman);
  if (!p) notFound();
  if (p.key === "semua" && p.page === 1) redirect("/berita-psi");
  return <BeritaPsiListing filterKey={p.key} page={p.page} />;
}
