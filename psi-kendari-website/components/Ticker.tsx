import Link from "next/link";

export type TickerItem = { key: string; title: string; href: string };

const BAND = "ticker bg-red text-white";
const LABEL = "shrink-0 rounded bg-ink px-2 py-1 text-[0.7rem] font-extrabold uppercase tracking-widest";

/** Pita headline dengan tinggi tetap (mencegah pergeseran tata letak). */
function Band({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section aria-label="Headline terbaru psi.id" className={BAND}>
      <div className="mx-auto flex h-11 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <span className={LABEL}>{label}</span>
        <div className="relative min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

/** Ticker headline berjalan; berhenti saat hover/fokus, statis bila reduced-motion. */
export function Ticker({ items, label = "Terbaru" }: { items: TickerItem[]; label?: string }) {
  if (!items.length) return <TickerPlaceholder label={label} />;
  const row = (hidden: boolean) =>
    items.map((it) => (
      <li key={`${hidden ? "b" : "a"}-${it.key}`} className="flex items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
        <Link href={it.href} tabIndex={hidden ? -1 : undefined} className="whitespace-nowrap text-sm font-semibold hover:underline">
          {it.title}
        </Link>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />
      </li>
    ));
  return (
    <Band label={label}>
      <ul className="ticker-track flex">
        {row(false)}
        {row(true)}
      </ul>
    </Band>
  );
}

/** Pita pengganti (memuat / psi.id tidak dapat diakses) dengan tinggi yang sama. */
export function TickerPlaceholder({ label = "Terbaru", state = "unavailable" }: { label?: string; state?: "loading" | "unavailable" }) {
  return (
    <Band label={label}>
      {state === "loading" ? (
        <span className="text-sm font-semibold">Memuat headline psi.id…</span>
      ) : (
        <a href="https://psi.id/" target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold hover:underline">
          Headline terbaru tersedia di psi.id — situs resmi DPP PSI ↗
        </a>
      )}
    </Band>
  );
}
