import type { Metadata } from "next";
import { searchPosts } from "@/lib/psi-api";
import { searchLocal } from "@/lib/search";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { IconSearch } from "@/components/icons";

export const metadata: Metadata = {
  title: "Cari",
  description: "Cari berita psi.id dan konten lokal PSI Kendari.",
  alternates: { canonical: "/cari" },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function CariPage({ searchParams }: Props) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 100);
  const [psi, lokal] = q ? await Promise.all([searchPosts(q, 1, 12), Promise.resolve(searchLocal(q))]) : [null, []];

  return (
    <>
      <PageHeader title={q ? `Hasil pencarian “${q}”` : "Cari"} crumbs={[{ label: "Cari" }]}>
        <form action="/cari" method="get" role="search" className="mt-6 flex max-w-2xl gap-2">
          <label htmlFor="q" className="sr-only">Kata kunci</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Mis. Kendari, siaran pers, pemilu…"
            maxLength={100}
            className="min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-3 text-fg"
          />
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-red px-5 py-3 font-extrabold text-white hover:bg-red-strong">
            <IconSearch /> Cari
          </button>
        </form>
      </PageHeader>
      <Container className="space-y-12 py-10">
        {!q ? (
          <EmptyState title="Ketik kata kunci untuk mencari">
            Pencarian mencakup artikel psi.id serta berita lokal, klarifikasi, dan struktur wilayah di situs ini.
          </EmptyState>
        ) : (
          <>
            <section aria-labelledby="hasil-lokal">
              <SectionHeading id="hasil-lokal" title="Konten lokal PSI Kendari" />
              {lokal.length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {lokal.map((it) => (
                    <NewsCard key={it.key} item={it} />
                  ))}
                </div>
              ) : (
                <EmptyState title="Tidak ada konten lokal yang cocok." />
              )}
            </section>
            <section aria-labelledby="hasil-psi">
              <SectionHeading id="hasil-psi" title="Artikel psi.id" />
              {psi ? (
                <PsiPosts
                  result={psi}
                  query={{ search: q, perPage: 12 }}
                  view="grid"
                  sourceHref={`https://psi.id/?s=${encodeURIComponent(q)}`}
                  emptyText="Tidak ada artikel psi.id yang cocok."
                />
              ) : null}
            </section>
          </>
        )}
      </Container>
    </>
  );
}
