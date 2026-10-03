'use client';

import { ArrowRight, Clock3, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceListing } from './MarketplaceCard';
import { discountPercent } from './promo';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

// Strip deal ala Rakuten/Amazon — horizontal scroll, kartu kompak.
// Label "Penawaran pilihan" dari flag is_featured nyata; badge "-X%"
// HANYA dari original_price nyata (promo.ts) — tidak ada diskon palsu.
export function DealOfTheDay({ items, onQuickView }: { items: MarketplaceListing[]; onQuickView?: (item: MarketplaceListing) => void }) {
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const mp = getMarketplaceLabels(language);
  const deals = items.filter(item => item.is_featured).slice(0, 8);
  if (!deals.length) return null;
  return (
    <section className="fbm-deals" aria-labelledby="deals-heading">
      <div className="fbm-deals-head">
        <h2 id="deals-heading"><Sparkles size={16} aria-hidden="true" /> {mp.mpDealsToday}</h2>
        <Link href="/marketplace?deal=day">{t.viewAll} <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className="fbm-deal-rail">
        {deals.map(item => {
          const discount = discountPercent(item);
          return (
            <button key={item.id} type="button" className="fbm-deal-card" onClick={() => onQuickView?.(item)} aria-label={`${mp.mpView} ${item.title}`}>
              <span className="fbm-deal-art">
                {item.images?.[0] ? <img src={item.images[0]} alt="" loading="lazy" /> : <Tag size={25} aria-hidden="true" />}
                <span className="fbm-deal-tag">{mp.mpDealTag}</span>
              </span>
              <b>{item.title}</b>
              <strong>{rupiah(Number(item.price))}{discount > 0 && <span className="fbm-badge fbm-badge-discount" aria-label={mp.mpDiscountPercent.replace('{n}', String(discount))}>-{discount}%</span>}</strong>
              <small><Clock3 size={11} aria-hidden="true" /> {mp.mpEndsToday}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
