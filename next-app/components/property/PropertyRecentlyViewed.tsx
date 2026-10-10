'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, X } from 'lucide-react';
import { getRecentlyViewed, addRecentlyViewed, clearRecentlyViewed, type RecentProperty } from '@/lib/property-recently-viewed';
import { rupiah } from '@/lib/property-format';

function rupiahFmt(v: number) {
  try {
    return rupiah(v);
  } catch {
    return `Rp ${Number(v || 0).toLocaleString('id-ID')}`;
  }
}

// Mencatat kunjungan halaman detail — dipasang sekali di /properti/[id].
export function PropertyViewTracker({ property }: { property: { id: string; title: string; price: number; priceType?: string; district?: string; images?: string[] } }) {
  const { id, title, price, priceType, district, images } = property;
  useEffect(() => {
    addRecentlyViewed({
      id: String(id),
      title,
      price: Number(price) || 0,
      priceType,
      district,
      image: Array.isArray(images) ? images[0] : undefined,
    });
  }, [id, title, price, priceType, district, images]);
  return null;
}

// Strip "Terakhir dilihat" di halaman listing.
export function PropertyRecentlyViewedStrip({ excludeIds = [] }: { excludeIds?: string[] }) {
  const [items, setItems] = useState<RecentProperty[]>([]);
  const excludeKey = excludeIds.join(',');
  useEffect(() => {
    const excluded = new Set(excludeKey ? excludeKey.split(',') : []);
    setItems(getRecentlyViewed().filter((x) => !excluded.has(String(x.id))).slice(0, 6));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeKey]);
  if (items.length === 0) return null;
  return (
    <section className="mt-6" aria-labelledby="recently-viewed-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recently-viewed-title" className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
          <Clock size={17} className="text-sultra-teal" aria-hidden="true" />
          Terakhir dilihat
        </h2>
        <button
          type="button"
          onClick={() => { clearRecentlyViewed(); setItems([]); }}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X size={12} aria-hidden="true" /> Hapus
        </button>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/properti/${item.id}`}
            className="w-44 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
              {item.image ? (
                <Image src={item.image} alt={item.title} fill sizes="176px" loading="lazy" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-xs text-slate-400">Tanpa foto</div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-extrabold text-sultra-forest dark:text-teal-300">{rupiahFmt(item.price)}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">{item.title}</p>
              {item.district && <p className="line-clamp-1 text-[10px] text-slate-400">{item.district}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
