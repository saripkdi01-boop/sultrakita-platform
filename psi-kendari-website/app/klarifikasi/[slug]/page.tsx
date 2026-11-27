import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/config/site";
import { getKlarifikasi, getKlarifikasiBySlug } from "@/lib/content";
import { LABELS } from "@/lib/labels";
import { formatTanggal } from "@/lib/format";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VerificationBadge } from "@/components/Badges";
import { ShareButtons } from "@/components/ShareButtons";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const list = getKlarifikasi();
  return list.length ? list.map((k) => ({ slug: k.slug })) : [{ slug: "_kosong" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = getKlarifikasiBySlug((await params).slug);
  if (!k) return {};
  return {
    title: `Klarifikasi: ${k.judul}`,
    description: `${LABELS[k.label].text}. Klaim: ${k.klaim} Keputusan: ${k.keputusan}`,
    alternates: { canonical: `/klarifikasi/${k.slug}` },
  };
}

function Row({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-border py-5 sm:grid-cols-[14rem_1fr]">
      <dt className="text-sm font-extrabold">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red text-xs text-white">{n}</span>
        {title}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function KlarifikasiDetail({ params }: Props) {
  const k = getKlarifikasiBySlug((await params).slug);
  if (!k) notFound();
  const url = `${SITE.url}/klarifikasi/${k.slug}`;
  const rating: Record<string, number> = {
    HOAKS_DIBANTAH: 1,
    KLAIM_TIDAK_TERBUKTI: 2,
    DILAPORKAN_MEDIA: 3,
    TERKLARIFIKASI: 4,
    TERVERIFIKASI: 5,
  };

  return (
    <Container className="py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ClaimReview",
          url,
          datePublished: k.tanggal,
          claimReviewed: k.klaim,
          author: { "@type": "Organization", name: SITE.title, url: SITE.url },
          reviewRating: {
            "@type": "Rating",
            ratingValue: rating[k.label],
            bestRating: 5,
            worstRating: 1,
            alternateName: LABELS[k.label].text,
          },
        }}
      />
      <Breadcrumb items={[{ label: "Klarifikasi", href: "/klarifikasi" }, { label: k.judul }]} />
      <article className="mx-auto mt-6 max-w-3xl">
        <VerificationBadge label={k.label} className="text-xs" />
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{k.judul}</h1>
        <p className="mt-3 text-sm text-muted">
          Diperbarui <time dateTime={k.tanggal}>{formatTanggal(k.tanggal)}</time> · {k.penulis}
        </p>
        <div className="mt-5">
          <ShareButtons url={url} title={`Klarifikasi: ${k.judul}`} />
        </div>

        <dl className="mt-8">
          <Row n={1} title="Klaim persis">
            <blockquote className="border-l-4 border-red pl-4 text-lg font-semibold">“{k.klaim}”</blockquote>
          </Row>
          <Row n={2} title="Pertama beredar">
            <p>{k.pertama_beredar}</p>
          </Row>
          <Row n={3} title="Label">
            <VerificationBadge label={k.label} />
            <p className="mt-2 text-sm text-muted">{LABELS[k.label].desc}</p>
          </Row>
          <Row n={4} title="Fakta, sumber & tanggal">
            {k.fakta.length ? (
              <ul className="space-y-4">
                {k.fakta.map((f, i) => (
                  <li key={i} className="rounded-xl bg-bg-soft p-4">
                    <p>{f.teks}</p>
                    <p className="mt-2 text-xs text-muted">
                      Sumber:{" "}
                      {f.url ? (
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-ink underline">
                          {f.sumber}
                        </a>
                      ) : (
                        <strong className="text-fg">{f.sumber}</strong>
                      )}
                      {f.tanggal ? (
                        <>
                          {" "}· <time dateTime={f.tanggal}>{formatTanggal(f.tanggal)}</time>
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-muted">Belum ada fakta yang dapat ditautkan.</p>
            )}
          </Row>
          <Row n={5} title="Yang belum diketahui">
            {k.belum_diketahui.length ? (
              <ul className="list-disc space-y-1 pl-5">
                {k.belum_diketahui.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-muted">—</p>
            )}
          </Row>
          <Row n={6} title="Keputusan">
            <p className="text-lg font-extrabold">{k.keputusan}</p>
          </Row>
        </dl>
        {k.html ? <div className="prose-psi mt-6 border-t border-border pt-6" dangerouslySetInnerHTML={{ __html: k.html }} /> : null}
      </article>
    </Container>
  );
}
