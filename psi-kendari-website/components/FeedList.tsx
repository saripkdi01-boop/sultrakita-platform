"use client";

import { useMemo, useState } from "react";
import type { CardItem } from "@/lib/card";
import { NewsCard } from "./NewsCard";

/** Daftar agregasi dengan filter per sumber (tanpa JS: semua item tampil). */
export function FeedList({ items, sources }: { items: (CardItem & { sourceId: string })[]; sources: { id: string; nama: string }[] }) {
  const [active, setActive] = useState<string>("semua");
  const visible = useMemo(() => (active === "semua" ? items : items.filter((i) => i.sourceId === active)), [active, items]);
  const opts = [{ id: "semua", nama: "Semua sumber" }, ...sources];
  return (
    <div>
      <div role="group" aria-label="Filter sumber" className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = active === o.id;
          const n = o.id === "semua" ? items.length : items.filter((i) => i.sourceId === o.id).length;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(o.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-bold ${on ? "border-red bg-red text-white" : "border-border bg-surface hover:border-red hover:text-red-ink"}`}
            >
              {o.nama} <span className={on ? "text-white/80" : "text-muted"}>({n})</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Menampilkan {visible.length} berita
      </p>
      <div className="mt-6 grid gap-x-8 md:grid-cols-2">
        {visible.map((it) => (
          <NewsCard key={it.key} item={it} variant="text" />
        ))}
      </div>
    </div>
  );
}
