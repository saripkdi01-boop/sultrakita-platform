import Image from "next/image";
import Link from "next/link";
import { psiToCard } from "@/lib/card";
import type { PsiPost } from "@/lib/psi-types";
import { NewsCard } from "../NewsCard";
import { Ticker } from "../Ticker";

export type PsiView = "hero" | "grid" | "list" | "compact" | "ticker" | "gallery";

/** Tampilan daftar posting psi.id — dipakai server & fallback browser. */
export function PsiPostsView({ posts, view, priority = false }: { posts: PsiPost[]; view: PsiView; priority?: boolean }) {
  if (view === "ticker") {
    return <Ticker items={posts.map((p) => ({ key: String(p.id), title: p.title, href: `/berita-psi/${p.slug}` }))} />;
  }

  if (view === "hero") {
    const [first, ...rest] = posts;
    if (!first) return null;
    return (
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <NewsCard item={psiToCard(first)} variant="feature" priority={priority} headingLevel={2} />
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-muted">Berita pilihan</p>
          {rest.slice(0, 4).map((p) => (
            <NewsCard key={p.id} item={psiToCard(p)} variant="compact" />
          ))}
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div>
        {posts.map((p) => (
          <NewsCard key={p.id} item={psiToCard(p)} variant="text" />
        ))}
      </div>
    );
  }

  if (view === "compact") {
    return (
      <div className="flex flex-col gap-5">
        {posts.map((p) => (
          <NewsCard key={p.id} item={psiToCard(p)} variant="compact" />
        ))}
      </div>
    );
  }

  if (view === "gallery") {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((p) => (
          <li key={p.id}>
            <Link href={`/berita-psi/${p.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-surface">
              <div className="relative aspect-square bg-bg-soft">
                {p.image ? (
                  <Image src={p.image.cardSrc} alt={p.image.alt} fill unoptimized sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                ) : null}
              </div>
              <p className="line-clamp-2 p-2.5 text-sm font-semibold group-hover:text-red-ink">{p.title}</p>
              <p className="px-2.5 pb-2.5 text-[0.7rem] text-muted">Foto: psi.id</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <NewsCard key={p.id} item={psiToCard(p)} priority={priority && i < 3} />
      ))}
    </div>
  );
}
