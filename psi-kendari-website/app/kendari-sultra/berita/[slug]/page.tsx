import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SITE } from "@/config/site";
import { getBeritaLokal, getBeritaLokalBySlug } from "@/lib/content";
import { formatTanggalWaktu } from "@/lib/format";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RubrikBadge, VerificationBadge } from "@/components/Badges";
import { ShareButtons } from "@/components/ShareButtons";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const list = getBeritaLokal();
  return list.length ? list.map((b) => ({ slug: b.slug })) : [{ slug: "_kosong" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = getBeritaLokalBySlug((await params).slug);
  if (!b) return {};
  const url = `/kendari-sultra/berita/${b.slug}`;
  return {
    title: b.judul,
    description: b.ringkasan,
    alternates: { canonical: url },
    openGraph: { type: "article", title: b.judul, description: b.ringkasan, url, publishedTime: b.tanggal },
  };
}

export default async function BeritaLokalPage({ params }: Props) {
  const b = getBeritaLokalBySlug((await params).slug);
  if (!b) notFound();
  const url = `${SITE.url}/kendari-sultra/berita/${b.slug}`;

  return (
    <Container className="py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: b.judul.slice(0, 110),
          description: b.ringkasan,
          datePublished: b.tanggal,
          inLanguage: "id-ID",
          mainEntityOfPage: url,
          url,
          author: { "@type": "Organization", name: b.penulis },
          publisher: { "@type": "Organization", name: SITE.title, url: SITE.url },
        }}
      />
      <Breadcrumb items={[{ label: "Kendari & Sultra", href: "/kendari-sultra" }, { label: b.rubrik }]} />
      <article className="mx-auto mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <RubrikBadge>{b.rubrik}</RubrikBadge>
          <VerificationBadge label={b.label} />
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{b.judul}</h1>
        <p className="mt-4 text-sm text-muted">
          <time dateTime={b.tanggal}>{formatTanggalWaktu(b.tanggal)}</time> · {b.penulis}
        </p>
        <div className="mt-5">
          <ShareButtons url={url} title={b.judul} />
        </div>
        {b.gambar ? (
          <figure className="mt-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-bg-soft">
              <Image src={b.gambar.src} alt={b.gambar.alt} fill unoptimized priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
            {b.gambar.kredit ? <figcaption className="mt-2 text-xs text-muted">Foto: {b.gambar.kredit}</figcaption> : null}
          </figure>
        ) : null}
        <div className="prose-psi mt-8" dangerouslySetInnerHTML={{ __html: b.html }} />
        {b.sumber.length ? (
          <aside className="mt-10 rounded-2xl border-l-4 border-red bg-bg-soft p-5 text-sm">
            <p className="font-bold">Sumber</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {b.sumber.map((s) => (
                <li key={s.nama}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-red-ink underline">
                      {s.nama}
                    </a>
                  ) : (
                    s.nama
                  )}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </article>
    </Container>
  );
}
