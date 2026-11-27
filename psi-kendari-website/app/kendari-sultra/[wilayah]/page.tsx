import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PSI_CAT, psiCategoryUrl } from "@/config/psi-categories";
import { getPosts } from "@/lib/psi-api";
import { getBeritaLokal, getWilayah, getWilayahList } from "@/lib/content";
import { lokalToCard } from "@/lib/card";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { WilayahFilter } from "@/components/WilayahFilter";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { IconArrowRight } from "@/components/icons";
import { MediaFeedBlock } from "@/components/MediaFeedBlock";
import { antaraSultraFeed } from "@/config/feeds";
import { getFeedItems } from "@/lib/feeds";

export const revalidate = 900;
export const dynamicParams = false;

type Props = { params: Promise<{ wilayah: string }> };

export function generateStaticParams() {
  return getWilayahList().map((w) => ({ wilayah: w.slug }));
}

/** Kata kunci pencarian psi.id untuk wilayah (tanpa awalan "Kabupaten"/"Kota"). */
function keyword(nama: string): string {
  return nama.replace(/^(Kabupaten|Kota)\s+/i, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWilayah((await params).wilayah);
  if (!w) return {};
  return {
    title: `Kabar PSI ${w.nama}`,
    description: `Berita PSI wilayah ${w.nama}, Sulawesi Tenggara.`,
    alternates: { canonical: `/kendari-sultra/${w.slug}` },
  };
}

export default async function WilayahBeritaPage({ params }: Props) {
  const w = getWilayah((await params).wilayah);
  if (!w) notFound();
  const lokal = getBeritaLokal().filter((b) => b.wilayah === w.slug);
  const query = { categories: [PSI_CAT.LIPUTAN_DAERAH], search: keyword(w.nama), perPage: 6 };
  const [psi, media] = await Promise.all([
    getPosts(query),
    w.antara_feed ? getFeedItems(antaraSultraFeed(w.antara_feed), 8) : Promise.resolve(null),
  ]);

  return (
    <>
      <PageHeader
        title={`Kabar PSI ${w.nama}`}
        kicker="Kendari & Sultra"
        crumbs={[{ label: "Kendari & Sultra", href: "/kendari-sultra" }, { label: w.nama }]}
      >
        <WilayahFilter wilayah={getWilayahList()} active={w.slug} />
      </PageHeader>
      <Container className="space-y-14 py-10">
        <section aria-labelledby="lokal">
          <SectionHeading id="lokal" title="Berita lokal" />
          {lokal.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lokal.map((b) => (
                <NewsCard key={b.slug} item={lokalToCard(b)} />
              ))}
            </div>
          ) : (
            <EmptyState title={`Belum ada berita lokal untuk ${w.nama}`} />
          )}
        </section>
        <section aria-labelledby="psi">
          <SectionHeading id="psi" title={`Liputan Daerah psi.id yang menyebut “${keyword(w.nama)}”`} />
          <PsiPosts
            result={psi}
            query={query}
            view="grid"
            compactNotice
            sourceHref={psiCategoryUrl(PSI_CAT.LIPUTAN_DAERAH)}
            emptyText={`Belum ada Liputan Daerah psi.id yang menyebut ${keyword(w.nama)}.`}
          />
        </section>
        {media ? (
          <section aria-labelledby="media">
            <SectionHeading id="media" title={`Kabar ${w.nama} dari media`} kicker="ANTARA Sultra · Dilaporkan media" />
            <MediaFeedBlock items={media.items} ok={media.status.ok} />
          </section>
        ) : null}
        <p>
          <Link href={`/struktur/${w.slug}`} className="inline-flex items-center gap-1 font-bold text-red-ink hover:underline">
            Struktur {w.dpd} <IconArrowRight />
          </Link>
        </p>
      </Container>
    </>
  );
}
