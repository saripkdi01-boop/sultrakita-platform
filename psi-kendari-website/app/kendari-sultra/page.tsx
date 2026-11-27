import type { Metadata } from "next";
import { KENDARI_KEYWORDS, PSI_CAT, psiCategoryUrl } from "@/config/psi-categories";
import { getKendariPosts } from "@/lib/psi-api";
import { getBeritaLokal, getWilayahList } from "@/lib/content";
import { lokalToCard } from "@/lib/card";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { WilayahFilter } from "@/components/WilayahFilter";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { MediaFeedBlock } from "@/components/MediaFeedBlock";
import { antaraSultraFeed } from "@/config/feeds";
import { getFeedItems } from "@/lib/feeds";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Kendari & Sultra",
  description: "Berita PSI Kota Kendari dan Sulawesi Tenggara: berita lokal DPW/DPD dan Liputan Daerah psi.id, dengan filter per kabupaten/kota.",
  alternates: { canonical: "/kendari-sultra" },
};

const PSI_QUERY = { categories: [PSI_CAT.LIPUTAN_DAERAH], keywords: KENDARI_KEYWORDS, perPage: 9 };

export default async function KendariSultraPage() {
  const lokal = getBeritaLokal();
  const wilayah = getWilayahList();
  const [psi, media] = await Promise.all([
    getKendariPosts(PSI_QUERY.perPage),
    getFeedItems(antaraSultraFeed("seputar-sultra"), 8),
  ]);

  return (
    <>
      <PageHeader
        title="Kendari & Sultra"
        kicker="Kabar wilayah"
        crumbs={[{ label: "Kendari & Sultra" }]}
        lead="Berita kegiatan PSI di Kota Kendari dan Sulawesi Tenggara: tulisan redaksi lokal dan Liputan Daerah psi.id yang menyebut Kendari, Sulawesi Tenggara, atau Sultra."
      >
        <WilayahFilter wilayah={wilayah} />
      </PageHeader>
      <Container className="space-y-14 py-10">
        <section aria-labelledby="lokal">
          <SectionHeading id="lokal" title="Berita lokal PSI Kendari" kicker="Redaksi lokal" />
          {lokal.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lokal.map((b) => (
                <NewsCard key={b.slug} item={lokalToCard(b)} />
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada berita lokal">Berita kegiatan DPW/DPD akan tampil di sini setelah dipublikasikan.</EmptyState>
          )}
        </section>

        <section aria-labelledby="liputan-daerah">
          <SectionHeading id="liputan-daerah" title="Liputan Daerah psi.id" kicker="Tersaring: Kendari · Sulawesi Tenggara · Sultra" />
          <PsiPosts
            result={psi}
            query={PSI_QUERY}
            view="grid"
            sourceHref={psiCategoryUrl(PSI_CAT.LIPUTAN_DAERAH)}
            emptyText="Belum ada Liputan Daerah psi.id yang menyebut Kendari atau Sulawesi Tenggara."
          />
        </section>

        <section aria-labelledby="media-sultra">
          <SectionHeading id="media-sultra" title="Kabar Sulawesi Tenggara dari media" kicker="ANTARA Sultra · Dilaporkan media" />
          <MediaFeedBlock items={media.items} ok={media.status.ok} emptyText="Belum ada berita media Sulawesi Tenggara." />
        </section>
      </Container>
    </>
  );
}
