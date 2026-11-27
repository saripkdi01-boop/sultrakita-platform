import type { Metadata } from "next";
import { FEEDS } from "@/config/feeds";
import { feedToCard, getPolitikTerbaru } from "@/lib/feeds";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { FeedList } from "@/components/FeedList";
import { EmptyState } from "@/components/EmptyState";
import { VerificationBadge } from "@/components/Badges";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Politik Terbaru",
  description: "Agregasi berita politik nasional, pemilu (Bawaslu), dan Sulawesi Tenggara dari RSS resmi media — judul, ringkasan, dan tautan ke sumber asli.",
  alternates: { canonical: "/politik-terbaru" },
};

export default async function PolitikTerbaruPage() {
  const { items, status } = await getPolitikTerbaru({ limit: 60 });
  const cards = items.map((it) => ({ ...feedToCard(it), sourceId: it.sourceId }));
  const sources = FEEDS.filter((f) => items.some((i) => i.sourceId === f.id)).map((f) => ({ id: f.id, nama: f.nama }));

  return (
    <>
      <PageHeader
        title="Politik Terbaru"
        kicker="Agregasi media"
        crumbs={[{ label: "Politik Terbaru" }]}
        lead={
          <>
            Berita politik nasional, kepemiluan, dan Sulawesi Tenggara dari RSS resmi media. Kami hanya menampilkan
            judul, ringkasan singkat, satu foto dari feed sumber, nama media, dan tanggal — baca isi lengkapnya di
            situs sumber. Semua item berlabel{" "}
            <VerificationBadge label="DILAPORKAN_MEDIA" /> sampai diverifikasi admin.
          </>
        }
      />
      <Container className="space-y-12 py-10">
        <section aria-labelledby="daftar">
          <h2 id="daftar" className="sr-only">Daftar berita</h2>
          {cards.length ? (
            <FeedList items={cards} sources={sources} />
          ) : (
            <EmptyState title="Berita media sementara tidak dapat dimuat">Coba lagi beberapa saat lagi.</EmptyState>
          )}
        </section>

        <section aria-labelledby="sumber" className="rounded-2xl border border-border bg-bg-soft p-6">
          <SectionHeading id="sumber" title="Sumber & status feed" />
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {status.map((s) => {
              const f = FEEDS.find((x) => x.id === s.id)!;
              return (
                <li key={s.id} className="flex items-start justify-between gap-3 rounded-xl bg-surface px-4 py-3">
                  <span>
                    <strong>{s.nama}</strong>{" "}
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-muted underline">
                      {f.url.replace(/^https:\/\//, "")}
                    </a>
                  </span>
                  <span className={`shrink-0 text-xs font-bold ${s.ok ? "text-fg" : "text-red-ink"}`}>
                    {s.ok ? `${s.count} item` : "gagal dimuat"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Hak cipta berita dan foto ada pada masing-masing media. Situs ini tidak menyalin isi artikel media lain;
            foto dimuat langsung dari server media sumber dan setiap item menautkan ke artikel aslinya. Feed umum disaring dengan kata kunci politik/pemilu.
          </p>
        </section>
      </Container>
    </>
  );
}
