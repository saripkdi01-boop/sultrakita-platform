import { formatAngka, formatPersen } from "@/lib/format";

export type BarDatum = { label: string; value: number };

function niceScale(max: number): { top: number; step: number } {
  if (max <= 0) return { top: 1, step: 1 };
  const pow = 10 ** Math.floor(Math.log10(max));
  const r = max / pow;
  const step = r > 5 ? pow * 2 : r > 2 ? pow : pow / 2;
  return { top: Math.ceil(max / step) * step, step };
}

/**
 * Grafik batang horizontal tanpa pustaka (HTML/CSS).
 * - Satu seri → tanpa legenda; judul (figcaption) menamai data.
 * - Batang 20px, ujung data membulat 4px, pangkal persegi di garis dasar.
 * - Gridline hairline 1px solid; nilai di ujung batang (di dalam bila batang panjang).
 * - Tooltip saat hover & fokus keyboard; tabel data disediakan pemanggil (tableId).
 */
export function BarChart({
  data,
  title,
  unit = "suara",
  shareOf,
  shareLabel = "dari total",
  tableId,
}: {
  data: BarDatum[];
  title: string;
  unit?: string;
  shareOf?: number;
  shareLabel?: string;
  tableId?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 0);
  const { top, step } = niceScale(max);
  const ticks: number[] = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(Math.round(t));
  const pos = (v: number) => `${(v / top) * 100}%`;

  return (
    <figure className="w-full" aria-describedby={tableId}>
      <figcaption className="mb-3 text-sm font-bold text-fg">{title}</figcaption>
      <ul>
        {data.map((d) => {
          const pct = top ? (d.value / top) * 100 : 0;
          const inside = pct > 70;
          const desc = `${d.label}: ${formatAngka(d.value)} ${unit}${shareOf ? ` (${formatPersen(d.value, shareOf)} ${shareLabel})` : ""}`;
          return (
            <li
              key={d.label}
              tabIndex={0}
              aria-label={desc}
              className="group grid h-10 grid-cols-[5.5rem_1fr] items-center gap-x-3 rounded-md"
            >
              <span aria-hidden="true" className="text-right text-sm font-semibold text-fg">{d.label}</span>
              <span aria-hidden="true" className="relative flex h-full items-center">
                {ticks.map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-border" style={{ left: pos(t) }} />
                ))}
                <span
                  className={`relative flex h-5 items-center rounded-r-[4px] bg-red group-hover:bg-red-strong group-focus-visible:bg-red-strong ${inside ? "justify-end pr-2" : ""}`}
                  style={{ width: `${Math.max(pct, 0.6)}%` }}
                >
                  {inside ? <span className="text-xs font-bold tabular-nums text-white">{formatAngka(d.value)}</span> : null}
                </span>
                {!inside ? <span className="relative ml-2 text-sm font-bold tabular-nums text-fg">{formatAngka(d.value)}</span> : null}
                <span className="pointer-events-none absolute -top-7 left-0 z-10 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-visible:block dark:bg-white dark:text-ink">
                  {desc}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div aria-hidden="true" className="grid grid-cols-[5.5rem_1fr] gap-x-3">
        <span />
        <span className="relative mt-1 h-5 border-t border-border text-xs text-muted">
          {ticks.map((t, i) => (
            <span
              key={t}
              className={`absolute top-1 tabular-nums ${i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: pos(t) }}
            >
              {formatAngka(t)}
            </span>
          ))}
        </span>
      </div>
    </figure>
  );
}
