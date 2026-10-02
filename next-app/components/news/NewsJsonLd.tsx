import { getNews } from '@/lib/news/rss';
import { NEWS_SOURCES } from '@/lib/news/sources';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');

function siteUrlFor(sourceId: string): string {
  return NEWS_SOURCES.find((s) => s.id === sourceId)?.siteUrl || siteUrl;
}

/**
 * T-NEWS · JSON-LD ItemList/NewsArticle untuk SEO /beranda.
 * Server component: mengambil headline teknologi yang SAMA dengan yang
 * disajikan Portal Berita (cache 20 mnt), lalu me-render structured data
 * yang JUJUR — hanya item yang benar-benar ada, `image` hanya bila URL
 * gambar benar-benar tersedia dari feed. Gagal fetch → render null
 * (tanpa structured data palsu).
 */
export async function NewsJsonLd() {
  let items: Awaited<ReturnType<typeof getNews>>['items'] = [];
  try {
    const result = await getNews('semua');
    items = result.items;
  } catch {
    return null;
  }
  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Portal Berita — SUKI Apps',
    description: 'Headline teknologi terkini dari media Indonesia yang diagregasi SUKI Apps.',
    url: `${siteUrl}/beranda`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'NewsArticle',
        headline: item.title,
        url: item.link,
        ...(item.publishedAt ? { datePublished: item.publishedAt } : {}),
        ...(item.image ? { image: item.image } : {}),
        description: item.excerpt || undefined,
        publisher: {
          '@type': 'Organization',
          name: item.sourceName,
          url: siteUrlFor(item.sourceId),
        },
        isPartOf: { '@type': 'WebSite', name: 'SUKI Apps', url: siteUrl },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}
