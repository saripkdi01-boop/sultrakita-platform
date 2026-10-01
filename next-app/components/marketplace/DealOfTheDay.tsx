import { ArrowRight, Clock3, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

// Strip deal ala Rakuten/Amazon — horizontal scroll, kartu kompak.
// Label "Penawaran pilihan" dari flag is_featured nyata; TANPA persen
// diskon palsu (DB tidak punya harga coret).
export function DealOfTheDay({ items, onQuickView }: { items: MarketplaceListing[]; onQuickView?: (item: MarketplaceListing) => void }) {
  const deals = items.filter(item => item.is_featured).slice(0, 8);
  if (!deals.length) return null;
  return (
    <section className="fbm-deals" aria-labelledby="deals-heading">
      <div className="fbm-deals-head">
        <h2 id="deals-heading"><Sparkles size={16} aria-hidden="true" /> Penawaran pilihan hari ini</h2>
        <Link href="/marketplace?deal=day">Lihat semua <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className="fbm-deal-rail">
        {deals.map(item => (
          <button key={item.id} type="button" className="fbm-deal-card" onClick={() => onQuickView?.(item)} aria-label={`Lihat ${item.title}`}>
            <span className="fbm-deal-art">
              {item.images?.[0] ? <img src={item.images[0]} alt="" loading="lazy" /> : <Tag size={25} aria-hidden="true" />}
              <span className="fbm-deal-tag">Penawaran pilihan</span>
            </span>
            <b>{item.title}</b>
            <strong>{rupiah(Number(item.price))}</strong>
            <small><Clock3 size={11} aria-hidden="true" /> Berakhir hari ini</small>
          </button>
        ))}
      </div>
    </section>
  );
}
