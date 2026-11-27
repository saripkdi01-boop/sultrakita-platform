import type { Metadata } from "next";
import Image from "next/image";
import { PSI_CAT, psiCategoryUrl } from "@/config/psi-categories";
import { getPostsByCategory } from "@/lib/psi-api";
import { getGaleriLokal } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { EmptyState } from "@/components/EmptyState";
import { VideoGrid } from "@/components/VideoGrid";
import { getYoutubeVideos } from "@/lib/feeds";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto dan video PSI: Galeri PSI dari psi.id dan dokumentasi kegiatan lokal Kendari & Sultra.",
  alternates: { canonical: "/galeri" },
};

const QUERY = { categories: [PSI_CAT.GALERI], perPage: 12 };

export default async function GaleriPage() {
  const [psi, video] = await Promise.all([getPostsByCategory(QUERY.categories, 1, QUERY.perPage), getYoutubeVideos(8)]);
  const lokal = getGaleriLokal();

  return (
    <>
      <PageHeader title="Galeri" crumbs={[{ label: "Galeri" }]} lead="Foto dan video kegiatan PSI. Setiap foto mencantumkan kredit sumbernya." />
      <Container className="space-y-14 py-10">
        <section aria-labelledby="galeri-psi">
          <SectionHeading id="galeri-psi" title="Galeri PSI (psi.id)" kicker="Nasional" />
          <PsiPosts result={psi} query={QUERY} view="gallery" sourceHref={psiCategoryUrl(PSI_CAT.GALERI)} emptyText="Belum ada galeri dari psi.id." />
        </section>

        <section aria-labelledby="video">
          <SectionHeading id="video" title="Video kanal resmi PSI" kicker="YouTube SolidaritasID" />
          <VideoGrid videos={video.videos} ok={video.ok} />
        </section>

        <section aria-labelledby="galeri-lokal">
          <SectionHeading id="galeri-lokal" title="Galeri lokal Kendari & Sultra" kicker="DPW/DPD" />
          {lokal.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {lokal.map((f) => (
                <li key={f.src}>
                  <figure className="overflow-hidden rounded-xl border border-border bg-surface">
                    <div className="relative aspect-square bg-bg-soft">
                      <Image src={f.src} alt={f.alt} fill unoptimized sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                    </div>
                    <figcaption className="p-2.5 text-xs text-muted">
                      {f.keterangan ? `${f.keterangan} · ` : ""}Foto: {f.kredit}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Galeri lokal menunggu foto resmi">
              Dokumentasi kegiatan DPW/DPD akan ditampilkan setelah tersedia, lengkap dengan kredit foto.
            </EmptyState>
          )}
        </section>
      </Container>
    </>
  );
}
