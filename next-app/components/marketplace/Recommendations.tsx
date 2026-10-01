import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

export function Recommendations({ items, query, onQuickView }: { items: MarketplaceListing[]; query: string; onQuickView?: (item: MarketplaceListing) => void }) {
  const recommendations = items.filter(item => !query || `${item.title} ${item.description || ''}`.toLowerCase().includes(query.toLowerCase()) || item.is_featured).slice(0, 4);
  if (!recommendations.length) return null;
  return (
    <section className="fbm-reco" aria-labelledby="recommendations-heading">
      <div className="fbm-reco-head">
        <h2 id="recommendations-heading"><Sparkles size={15} aria-hidden="true" /> Mungkin Anda suka</h2>
        <Link href="/marketplace">Jelajahi lebih banyak <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className="fbm-reco-grid">
        {recommendations.map(item => (
          <button key={item.id} type="button" className="fbm-reco-card" onClick={() => onQuickView?.(item)} aria-label={`Lihat ${item.title}`}>
            <span className="fbm-reco-art">{item.images?.[0] ? <img src={item.images[0]} alt="" loading="lazy" /> : <b aria-hidden="true">{item.title.slice(0, 1)}</b>}</span>
            <strong>{item.title}</strong>
            <span>{rupiah(Number(item.price))}</span>
            <small>{item.district || item.city || 'Sultra'}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
