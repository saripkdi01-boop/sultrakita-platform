import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin, Megaphone, ShieldCheck } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { KENDARI_KATEGORI, getKendariKategori, type KendariKategori } from '@/lib/seo/lokal-kendari';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';
import '../kendari.css';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return KENDARI_KATEGORI.map((kategori) => ({ slug: kategori.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kategori = getKendariKategori(slug);
  if (!kategori) return {};
  const url = `${siteUrl}/kendari/${kategori.slug}`;
  return {
    title: kategori.title,
    description: kategori.description,
    keywords: [`${kategori.label} Kendari`, `jual beli ${kategori.label} Sulawesi Tenggara`, 'SUKI Apps'],
    alternates: { canonical: url },
    openGraph: {
      title: kategori.title,
      description: kategori.description,
      type: 'website',
      url,
      siteName: 'SUKI Apps',
      locale: 'id_ID',
      images: [{ url: ogImage, alt: 'SUKI Apps' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: kategori.title,
      description: kategori.description,
      images: [ogImage],
    },
  };
}

interface ItemRingkas {
  id: string;
  title: string;
  price: number | null;
  district: string | null;
  href: string;
}

function formatHarga(price: number | null): string | null {
  if (price === null || Number.isNaN(price) || price <= 0) return null;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Ambil listing NYATA dari database (read-only). Selalu gagal dengan anggun:
 * tanpa env Supabase atau saat query error → kembalikan array kosong sehingga
 * halaman menampilkan empty state jujur, bukan data karangan.
 */
async function fetchItemNyata(kategori: KendariKategori): Promise<ItemRingkas[]> {
  try {
    const supabase = await getServerSupabase();
    if (kategori.sumber === 'listings') {
      const orKatakunci = kategori.katakunci
        .map((kw) => `title.ilike.%${kw}%,description.ilike.%${kw}%`)
        .join(',');
      const { data, error } = await supabase
        .from('listings')
        .select('id,title,price,district,created_at')
        .in('status', ['published', 'active'])
        .or('is_demo.is.null,is_demo.eq.false')
        .not('title', 'ilike', 'DEMO-SEED%')
        .or(orKatakunci)
        .ilike('city', '%kendari%')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error || !data) return [];
      return data.map((row) => ({
        id: String(row.id),
        title: String(row.title ?? 'Tanpa judul'),
        price: row.price === null || row.price === undefined ? null : Number(row.price),
        district: (row.district as string | null) ?? null,
        href: `/marketplace?listing=${row.id}`,
      }));
    }
    if (kategori.sumber === 'properties') {
      const { data, error } = await supabase
        .from('properties')
        .select('id,title,price,district,created_at')
        .eq('status', 'available')
        .in('category', kategori.kategoriProperti ?? [])
        .ilike('city', '%kendari%')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error || !data) return [];
      return data.map((row) => ({
        id: String(row.id),
        title: String(row.title ?? 'Tanpa judul'),
        price: row.price === null || row.price === undefined ? null : Number(row.price),
        district: (row.district as string | null) ?? null,
        href: `/properti/${row.id}`,
      }));
    }
    const { data, error } = await supabase
      .from('jobs')
      .select('id,title,city,published_at')
      .eq('status', 'published')
      .ilike('city', '%kendari%')
      .order('published_at', { ascending: false })
      .limit(8);
    if (error || !data) return [];
    return data.map((row) => ({
      id: String(row.id),
      title: String(row.title ?? 'Tanpa judul'),
      price: null,
      district: (row.city as string | null) ?? null,
      href: `/jobs/${row.id}`,
    }));
  } catch {
    return [];
  }
}

export default async function KendariKategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kategori = getKendariKategori(slug);
  if (!kategori) notFound();

  const items = await fetchItemNyata(kategori);
  const pageUrl = `${siteUrl}/kendari/${kategori.slug}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: 'SUKI Apps', url: siteUrl },
    { name: 'Kendari', url: `${siteUrl}/kendari` },
    { name: kategori.label },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: kategori.h1,
    description: kategori.description,
    url: pageUrl,
    inLanguage: 'id-ID',
    ...(items.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteUrl}${item.href}`,
              name: item.title,
            })),
          },
        }
      : {}),
  };

  return (
    <main className="kdr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }} />

      <header className="kdr-top">
        <div className="kdr-wrap kdr-top-inner">
          <Link href="/" className="kdr-brand" aria-label="SUKI Apps — beranda">
            <span className="kdr-brand-mark" aria-hidden="true">s</span>
            <span><strong>SUKI Apps</strong><small>Sulawesi Tenggara</small></span>
          </Link>
          <Link href="/beranda" className="kdr-top-cta">Buka SUKI Apps</Link>
        </div>
      </header>

      <div className="kdr-wrap">
        <nav className="kdr-crumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <Link href="/kendari">Kendari</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{kategori.label}</span>
        </nav>

        <h1 className="kdr-h1">{kategori.h1}</h1>
        <div className="kdr-intro">
          {kategori.paragraf.map((teks, i) => (
            <p key={i}>{teks}</p>
          ))}
        </div>

        <section className="kdr-list" aria-labelledby="kdr-list-title">
          <h2 id="kdr-list-title">
            {kategori.label} terbaru di Kendari
            {items.length > 0 && <span className="kdr-count">{items.length} listing</span>}
          </h2>
          {items.length > 0 ? (
            <ul className="kdr-grid">
              {items.map((item) => {
                const harga = formatHarga(item.price);
                return (
                  <li key={item.id}>
                    <Link href={item.href} className="kdr-card">
                      <strong>{item.title}</strong>
                      {harga && <span className="kdr-price">{harga}</span>}
                      {item.district && (
                        <span className="kdr-district">
                          <MapPin size={13} aria-hidden="true" /> {item.district}
                        </span>
                      )}
                      <span className="kdr-more">Lihat detail <ArrowRight size={13} aria-hidden="true" /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="kdr-empty" role="status">
              <Megaphone size={28} aria-hidden="true" />
              <h3>Belum ada listing {kategori.label.toLowerCase()} di Kendari</h3>
              <p>
                Saat ini belum ada penjual yang memasang {kategori.label.toLowerCase()} untuk
                wilayah Kendari di SUKI Apps. Jadilah yang pertama — pasang listing gratis
                dan jangkau pembeli di sekitar Anda.
              </p>
              <Link href="/marketplace/create" className="kdr-btn-primary">
                Pasang listing gratis <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}
          <Link href={kategori.ctaHref} className="kdr-cta">
            {kategori.ctaLabel} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>

        <section className="kdr-tips" aria-labelledby="kdr-tips-title">
          <h2 id="kdr-tips-title"><ShieldCheck size={18} aria-hidden="true" /> Tips transaksi aman</h2>
          <ul>
            {kategori.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <nav className="kdr-related" aria-label="Kategori lain di Kendari">
          <h2>Jelajahi kategori lain di Kendari</h2>
          <ul>
            {KENDARI_KATEGORI.filter((k) => k.slug !== kategori.slug).map((k) => (
              <li key={k.slug}>
                <Link href={`/kendari/${k.slug}`}>{k.label} Kendari</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <footer className="kdr-foot">
        <div className="kdr-wrap">
          <p>© 2026 SUKI Apps · Ekosistem digital Sulawesi Tenggara</p>
          <p><Link href="/legal/privacy">Privasi</Link> · <Link href="/legal/terms">Syarat &amp; Ketentuan</Link> · <Link href="/help-center">Pusat Bantuan</Link></p>
        </div>
      </footer>
    </main>
  );
}
