import Link from "next/link";
import { PSI_CAT, RUBRIK, psiCategoryUrl } from "@/config/psi-categories";
import { getKendariPosts, getPosts, getPostsByCategory } from "@/lib/psi-api";
import { KENDARI_KEYWORDS } from "@/config/psi-categories";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { PsiPosts } from "@/components/psi/PsiPosts";
import { JoinBand } from "@/components/JoinBand";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/config/site";
import { IconArrowRight } from "@/components/icons";
import { getBeritaLokal, getDataPemilu } from "@/lib/content";
import { lokalToCard } from "@/lib/card";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { BarChart } from "@/components/BarChart";
import { formatAngka } from "@/lib/format";
import { feedToCard, getPolitikTerbaru, getYoutubeVideos } from "@/lib/feeds";
import { VideoGrid } from "@/components/VideoGrid";
import { LINKS } from "@/config/site";

export const revalidate = 900;

const Q = {
  ticker: { perPage: 8 },
  hero: { categories: [PSI_CAT.LIPUTAN, PSI_CAT.LIPUTAN_NASIONAL, PSI_CAT.LIPUTAN_DAERAH], perPage: 5 },
  pers: { categories: RUBRIK["siaran-pers"].categories, perPage: 3 },
  kendari: { categories: [PSI_CAT.LIPUTAN_DAERAH], keywords: KENDARI_KEYWORDS, perPage: 4 },
  kolom: { categories: RUBRIK["kolom-opini"].categories, perPage: 3 },
  ketum: { categories: [PSI_CAT.BLOG_KETUM], perPage: 3 },
};

export default async function HomePage() {
  const [ticker, hero, pers, kendari, kolom, ketum, politik, video] = await Promise.all([
    getPosts(Q.ticker),
    getPosts(Q.hero),
    getPosts(Q.pers),
    getKendariPosts(Q.kendari.perPage),
    getPosts(Q.kolom),
    getPostsByCategory(PSI_CAT.BLOG_KETUM, 1, 3),
    getPolitikTerbaru({ limit: 10 }),
    getYoutubeVideos(4),
  ]);
  const lokal = getBeritaLokal().slice(0, 4);
  const pemilu = getDataPemilu("kendari-2024");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.title,
          url: SITE.url,
          inLanguage: "id-ID",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.url}/cari?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <PsiPosts result={ticker} query={Q.ticker} view="ticker" hideWhenUnavailable />

      <Container className="py-8">
        <h1 className="sr-only">PSI Kendari — Partai Super TBK: berita PSI, Kendari & Sulawesi Tenggara</h1>

        <section aria-labelledby="berita-utama">
          <h2 id="berita-utama" className="sr-only">Berita utama dari Liputan psi.id</h2>
          <PsiPosts result={hero} query={Q.hero} view="hero" priority sourceHref={psiCategoryUrl(PSI_CAT.LIPUTAN)} />
        </section>

        <section aria-labelledby="siaran-pers" className="mt-14">
          <SectionHeading id="siaran-pers" title="Siaran Pers & Sikap DPP" kicker="Resmi DPP PSI" href="/berita-psi/rubrik/siaran-pers" />
          <PsiPosts result={pers} query={Q.pers} view="grid" compactNotice sourceHref={psiCategoryUrl(PSI_CAT.SIARAN_PERS)} />
        </section>

        <section aria-labelledby="kendari-sultra" className="mt-14">
          <SectionHeading id="kendari-sultra" title="Kendari & Sultra" kicker="Kabar wilayah" href="/kendari-sultra" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-muted">Liputan Daerah psi.id</h3>
              <PsiPosts
                result={kendari}
                query={Q.kendari}
                view="compact"
                compactNotice
                sourceHref={psiCategoryUrl(PSI_CAT.LIPUTAN_DAERAH)}
                emptyText="Belum ada Liputan Daerah psi.id yang menyebut Kendari/Sulawesi Tenggara."
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-muted">Berita lokal PSI Kendari</h3>
              {lokal.length ? (
                <div className="flex flex-col gap-5">
                  {lokal.map((b) => (
                    <NewsCard key={b.slug} item={lokalToCard(b)} variant="compact" />
                  ))}
                </div>
              ) : (
                <EmptyState title="Belum ada berita lokal." />
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="politik" className="mt-14">
          <SectionHeading id="politik" title="Politik Terbaru" kicker="Dilaporkan media" href="/politik-terbaru" />
          {politik.items.length ? (
            <div className="grid gap-x-8 md:grid-cols-2">
              {politik.items.slice(0, 10).map((it) => (
                <NewsCard key={it.id} item={feedToCard(it)} variant="text" />
              ))}
            </div>
          ) : (
            <EmptyState title="Berita media sementara tidak dapat dimuat" />
          )}
          <p className="mt-3 text-xs text-muted">
            Ringkasan dari RSS resmi media; isi lengkap dan hak cipta ada pada media sumber.
          </p>
        </section>

        <section aria-labelledby="kolom" className="mt-14">
          <SectionHeading id="kolom" title="Kolom & Opini" kicker="Gagasan" href="/berita-psi/rubrik/kolom" />
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <PsiPosts result={kolom} query={Q.kolom} view="grid" compactNotice sourceHref={psiCategoryUrl(PSI_CAT.KOLOM)} />
            <aside aria-labelledby="blog-ketum" className="rounded-2xl bg-ink p-6 text-white">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[#ff4d57]">Blok khusus</p>
              <h3 id="blog-ketum" className="mt-1 text-2xl font-extrabold">Blog Ketum</h3>
              <p className="mt-2 text-sm text-zinc-300">Tulisan terbaru Ketua Umum PSI dari psi.id.</p>
              <div className="mt-4 rounded-xl bg-surface px-4 py-1 text-fg">
                <PsiPosts result={ketum} query={Q.ketum} view="list" compactNotice sourceHref={psiCategoryUrl(PSI_CAT.BLOG_KETUM)} />
              </div>
              <Link href="/berita-psi/rubrik/blog-ketum" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white hover:underline">
                Semua Blog Ketum <IconArrowRight />
              </Link>
            </aside>
          </div>
        </section>

        <section aria-labelledby="video" className="mt-14">
          <SectionHeading id="video" title="Video PSI" kicker="YouTube SolidaritasID" href={LINKS.youtube} hrefLabel="Kanal YouTube" />
          <VideoGrid videos={video.videos} ok={video.ok} />
        </section>

        {pemilu ? (
          <section aria-labelledby="data-pemilu" className="mt-14">
            <SectionHeading id="data-pemilu" title="Data Pemilu Kendari 2024" kicker="DPRD Kota Kendari" href="/data-pemilu" hrefLabel="Tabel & sumber lengkap" />
            <div className="grid items-center gap-8 rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[280px_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Total suara PSI</p>
                <p className="text-6xl font-extrabold tabular-nums text-red-ink">{formatAngka(pemilu.total_suara_partai)}</p>
                <p className="mt-1 text-sm text-muted">
                  dari {formatAngka(pemilu.total_suara_sah)} suara sah {pemilu.lembaga}
                </p>
                <p className="mt-4 text-xs text-muted">Sumber: {pemilu.sumber.dokumen}</p>
              </div>
              <BarChart
                title={`Suara PSI per dapil — ${pemilu.lembaga} ${pemilu.pemilu}`}
                data={pemilu.dapil.map((d) => ({ label: d.nama, value: d.suara }))}
                shareOf={pemilu.total_suara_partai}
                shareLabel="dari suara PSI"
              />
            </div>
          </section>
        ) : null}

        <div className="mt-14">
          <JoinBand />
        </div>
      </Container>
    </>
  );
}
