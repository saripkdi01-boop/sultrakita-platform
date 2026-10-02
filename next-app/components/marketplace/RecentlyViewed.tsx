import { ArrowRight, History } from 'lucide-react';
import type { RecentListing } from './useRecentlyViewed';

function rupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

// Rail "Terakhir dilihat" ala Tokopedia/Shopee — dari riwayat lokal pengguna,
// hanya dirender bila ada isinya. Klik membuka quick view listing itu lagi.
export function RecentlyViewed({ items, onOpen }: { items: RecentListing[]; onOpen: (item: RecentListing) => void }) {
  if (items.length === 0) return null;
  return (
    <section className="fbm-recent" aria-labelledby="recent-heading">
      <div className="fbm-deals-head">
        <h2 id="recent-heading"><History size={16} aria-hidden="true" /> Terakhir dilihat</h2>
        <span className="fbm-recent-hint" aria-hidden="true"><ArrowRight size={14} /> geser</span>
      </div>
      <div className="fbm-deal-rail" role="list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className="fbm-deal-card"
            onClick={() => onOpen(item)}
            aria-label={`Lihat lagi ${item.title}`}
          >
            <span className="fbm-deal-art">
              {item.thumbnail ? <img src={item.thumbnail} alt="" loading="lazy" /> : <span aria-hidden="true">📦</span>}
            </span>
            <b>{item.title}</b>
            <strong>{item.price > 0 ? rupiah(item.price) : 'Hubungi penjual'}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
