import Link from "next/link";
import { BERITA_FILTERS, psiCategoryUrl } from "@/config/psi-categories";
import { getPosts } from "@/lib/psi-api";
import { PageHeader } from "../PageHeader";
import { Container } from "../Container";
import { Pagination } from "../Pagination";
import { PsiPosts } from "./PsiPosts";

export const PER_PAGE = 12;

export function filterHref(key: string, page = 1): string {
  if (key === "semua") return page > 1 ? `/berita-psi/rubrik/semua/${page}` : "/berita-psi";
  return page > 1 ? `/berita-psi/rubrik/${key}/${page}` : `/berita-psi/rubrik/${key}`;
}

export async function BeritaPsiListing({ filterKey, page }: { filterKey: string; page: number }) {
  const filter = BERITA_FILTERS.find((f) => f.key === filterKey) ?? BERITA_FILTERS[0];
  const query = { categories: filter.categories, perPage: PER_PAGE, page };
  const result = await getPosts(query);
  const title = filter.key === "semua" ? "Berita PSI" : filter.label;

  return (
    <>
      <PageHeader
        title={page > 1 ? `${title} — halaman ${page}` : title}
        kicker="Dari psi.id — situs resmi DPP PSI"
        crumbs={filter.key === "semua" ? [{ label: "Berita PSI" }] : [{ label: "Berita PSI", href: "/berita-psi" }, { label: filter.label }]}
        lead="Artikel resmi DPP PSI dari psi.id, lengkap dengan tanggal asli, rubrik, dan tautan ke artikel aslinya."
      >
        <nav aria-label="Filter rubrik" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {BERITA_FILTERS.map((f) => {
              const active = f.key === filter.key;
              return (
                <li key={f.key}>
                  <Link
                    href={filterHref(f.key)}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-2 text-sm font-bold ${
                      active ? "border-red bg-red text-white" : "border-border bg-surface hover:border-red hover:text-red-ink"
                    }`}
                  >
                    {f.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </PageHeader>
      <Container className="py-10">
        <PsiPosts
          result={result}
          query={query}
          view="grid"
          priority
          sourceHref={psiCategoryUrl(filter.categories[0])}
          emptyText="Tidak ada artikel pada halaman ini."
        />
        {result.ok ? (
          <Pagination page={page} totalPages={Math.min(result.totalPages, 50)} hrefFor={(p) => filterHref(filter.key, p)} />
        ) : null}
      </Container>
    </>
  );
}
