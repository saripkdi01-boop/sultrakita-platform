import { Check, MapPin, X } from 'lucide-react';
import { useEffect } from 'react';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }
function condition(value?: string | null) { return value === 'new' ? 'Baru' : value === 'like_new' ? 'Seperti baru' : value === 'fair' ? 'Cukup baik' : 'Terawat'; }

export function ComparePanel({ items, onClose }: { items: MarketplaceListing[]; onClose: () => void }) {
  useEffect(() => {
    if (!items.length) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [items.length, onClose]);
  if (!items.length) return null;
  return (
    <div className="fbm-compare-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="fbm-compare-panel" role="dialog" aria-modal="true" aria-labelledby="compare-title">
        <header>
          <h2 id="compare-title">Bandingkan listing</h2>
          <button type="button" onClick={onClose} aria-label="Tutup perbandingan"><X size={18} aria-hidden="true" /></button>
        </header>
        <div className="fbm-compare-table">
          <div className="fbm-compare-labels"><b>Produk</b><b>Harga</b><b>Kondisi</b><b>Lokasi</b><b>Status</b></div>
          {items.map(item => (
            <article key={item.id}>
              <div><strong>{item.title}</strong><small>{item.description || 'Produk lokal Sultra'}</small></div>
              <b>{rupiah(Number(item.price))}</b>
              <span>{condition(item.condition)}</span>
              <span><MapPin size={12} aria-hidden="true" />{item.district || item.city || 'Sultra'}</span>
              <span><Check size={12} aria-hidden="true" />Terverifikasi</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
