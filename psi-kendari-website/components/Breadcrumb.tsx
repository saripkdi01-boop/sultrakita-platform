import Link from "next/link";
import { SITE } from "@/config/site";
import { JsonLd } from "./JsonLd";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Beranda", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {c.href && !last ? (
                  <Link href={c.href} className="hover:text-red-ink hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className="line-clamp-1 font-semibold text-fg">
                    {c.label}
                  </span>
                )}
                {!last ? <span aria-hidden="true">›</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${SITE.url}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
