import Image from "next/image";
import Link from "next/link";
import type { CardItem } from "@/lib/card";
import { RubrikBadge, VerificationBadge } from "./Badges";
import { TimeAgo } from "./TimeAgo";
import { IconExternal } from "./icons";

export type CardVariant = "feature" | "default" | "compact" | "text";

function CardLink({ item, className, children }: { item: CardItem; className?: string; children: React.ReactNode }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <span className="sr-only"> (tautan keluar ke {item.source ?? "situs sumber"})</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {children}
    </Link>
  );
}

function Meta({ item }: { item: CardItem }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
      {item.source ? <span className="font-semibold text-fg">{item.source}</span> : null}
      {item.source && item.date ? <span aria-hidden="true">·</span> : null}
      <TimeAgo iso={item.date} />
      {item.external ? <IconExternal className="text-muted" /> : null}
    </div>
  );
}

function Thumb({ item, sizes, className, priority }: { item: CardItem; sizes: string; className: string; priority?: boolean }) {
  if (!item.image) return null;
  return (
    <div className={`relative overflow-hidden bg-bg-soft ${className}`}>
      <Image
        src={item.image.src}
        alt={item.image.alt || item.title}
        fill
        sizes={sizes}
        unoptimized
        priority={priority}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export function NewsCard({
  item,
  variant = "default",
  priority = false,
  headingLevel = 3,
}: {
  item: CardItem;
  variant?: CardVariant;
  priority?: boolean;
  headingLevel?: 2 | 3 | 4;
}) {
  const H = `h${headingLevel}` as "h2" | "h3" | "h4";
  const badges = (
    <div className="flex flex-wrap items-center gap-2">
      {item.rubrik ? <RubrikBadge>{item.rubrik}</RubrikBadge> : null}
      <VerificationBadge label={item.label} />
    </div>
  );

  if (variant === "feature") {
    return (
      <article className="group overflow-hidden rounded-2xl border border-border bg-surface">
        <CardLink item={item} className="block">
          <Thumb item={item} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/9]" priority={priority} />
          <div className="p-5 sm:p-6">
            {badges}
            <H className="mt-3 text-2xl font-extrabold leading-tight tracking-tight group-hover:text-red-ink sm:text-3xl">
              {item.title}
            </H>
            {item.excerpt ? <p className="mt-3 line-clamp-3 text-base text-muted">{item.excerpt}</p> : null}
            <Meta item={item} />
            {item.image?.credit ? <p className="mt-1 text-[0.7rem] text-muted">{item.image.credit}</p> : null}
          </div>
        </CardLink>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <CardLink item={item} className="flex gap-3">
          {item.image ? <Thumb item={item} sizes="112px" className="aspect-[4/3] w-28 shrink-0 rounded-lg" /> : null}
          <div className="min-w-0">
            {badges}
            <H className="mt-1.5 line-clamp-3 text-[0.95rem] font-bold leading-snug group-hover:text-red-ink">{item.title}</H>
            <Meta item={item} />
          </div>
        </CardLink>
      </article>
    );
  }

  if (variant === "text") {
    return (
      <article className="group border-b border-border py-4 last:border-b-0">
        <CardLink item={item} className="block">
          {badges}
          <H className="mt-1.5 text-base font-bold leading-snug group-hover:text-red-ink">{item.title}</H>
          {item.excerpt ? <p className="mt-1.5 line-clamp-2 text-sm text-muted">{item.excerpt}</p> : null}
          <Meta item={item} />
        </CardLink>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <CardLink item={item} className="flex h-full flex-col">
        <Thumb item={item} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="aspect-[16/10]" />
        <div className="flex flex-1 flex-col p-4">
          {badges}
          <H className="mt-2 line-clamp-3 text-lg font-bold leading-snug group-hover:text-red-ink">{item.title}</H>
          {item.excerpt ? <p className="mt-2 line-clamp-3 text-sm text-muted">{item.excerpt}</p> : null}
          <div className="mt-auto">
            <Meta item={item} />
          </div>
        </div>
      </CardLink>
    </article>
  );
}
