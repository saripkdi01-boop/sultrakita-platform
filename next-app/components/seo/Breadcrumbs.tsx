import Link from 'next/link';
import { breadcrumbJsonLd, serializeJsonLd, type BreadcrumbItemInput } from '@/lib/seo/jsonld';

export interface BreadcrumbsProps {
  /** Urutan dari beranda hingga halaman aktif. Item terakhir = halaman aktif (tanpa href). */
  items: BreadcrumbItemInput[];
  /** Label aksesibilitas; default Bahasa Indonesia. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Breadcrumb aksesibel + JSON-LD BreadcrumbList untuk SEO.
 *
 * - <nav aria-label="Breadcrumb"> + <ol>/<li> (pola WAI-ARIA).
 * - Item terakhir memakai aria-current="page" dan bukan tautan.
 * - Struktur data schema.org disuntik via <script type="application/ld+json">
 *   memakai helper `breadcrumbJsonLd` (satu sumber kebenaran).
 *
 * Styling memakai inline style netral agar tidak bergantung pada globals.css
 * (komponen ini dipakai di halaman error/SEO yang harus mandiri).
 */
export default function Breadcrumbs({ items, ariaLabel = 'Breadcrumb', className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const jsonLd = serializeJsonLd(breadcrumbJsonLd(items));

  return (
    <>
      <nav aria-label={ariaLabel} className={className}>
        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 8,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            fontSize: 13,
          }}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${i}-${item.name}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: '#9aa5a1' }}>
                    /
                  </span>
                )}
                {isLast || !item.url ? (
                  <span aria-current={isLast ? 'page' : undefined} style={{ color: '#143b35', fontWeight: 700 }}>
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.url} style={{ color: '#0e6258', textDecoration: 'none' }}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
