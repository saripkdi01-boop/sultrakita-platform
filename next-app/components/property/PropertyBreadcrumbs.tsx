import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export type Crumb = { label: string; href?: string };

// Breadcrumbs ala portal properti (Zillow/Brighton) + JSON-LD BreadcrumbList untuk SEO.
export default function PropertyBreadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://sukiapps.web.id${item.href}` } : {}),
    })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 rounded hover:text-sultra-teal" aria-label="Beranda">
              <Home size={13} aria-hidden="true" />
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex min-w-0 items-center gap-1">
                <ChevronRight size={13} aria-hidden="true" className="shrink-0 text-slate-300 dark:text-slate-600" />
                {isLast || !item.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className="truncate font-bold text-slate-800 dark:text-slate-200">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="truncate rounded hover:text-sultra-teal">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
