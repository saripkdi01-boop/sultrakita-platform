import Link from "next/link";

export type TickerItem = { key: string; title: string; href: string };

/** Ticker headline berjalan; berhenti saat hover/fokus, statis bila reduced-motion. */
export function Ticker({ items, label = "Terbaru" }: { items: TickerItem[]; label?: string }) {
  if (!items.length) return null;
  const row = (hidden: boolean) =>
    items.map((it) => (
      <li key={`${hidden ? "b" : "a"}-${it.key}`} className="flex items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
        <Link
          href={it.href}
          tabIndex={hidden ? -1 : undefined}
          className="whitespace-nowrap text-sm font-semibold hover:underline"
        >
          {it.title}
        </Link>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/70" />
      </li>
    ));
  return (
    <section aria-label="Headline terbaru psi.id" className="ticker bg-red text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
        <span className="shrink-0 rounded bg-ink px-2 py-1 text-[0.7rem] font-extrabold uppercase tracking-widest">
          {label}
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden py-2.5">
          <ul className="ticker-track flex">
            {row(false)}
            {row(true)}
          </ul>
        </div>
      </div>
    </section>
  );
}
