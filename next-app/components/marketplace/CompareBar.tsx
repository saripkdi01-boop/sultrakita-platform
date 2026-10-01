'use client';

import { ArrowRight, X } from 'lucide-react';
import type { MarketplaceListing } from './MarketplaceCard';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }
export function CompareBar({ items, onRemove, onClear, onOpen }: { items: MarketplaceListing[]; onRemove: (id: string) => void; onClear: () => void; onOpen: () => void }) {
  if (!items.length) return null;
  return (
    <aside className="fbm-compare-bar" aria-label="Listing yang dipilih untuk dibandingkan">
      <div><b>Bandingkan listing</b><small>Pilih hingga 3 produk</small></div>
      <div className="fbm-compare-items">
        {items.map(item => (
          <span key={item.id}>{item.title}<strong>{rupiah(Number(item.price))}</strong><button type="button" onClick={() => onRemove(String(item.id))} aria-label={`Hapus ${item.title} dari perbandingan`}><X size={12} aria-hidden="true" /></button></span>
        ))}
      </div>
      <button type="button" className="fbm-compare-cta" onClick={onOpen}>Bandingkan <ArrowRight size={14} aria-hidden="true" /></button>
      <button type="button" className="fbm-compare-clear" onClick={onClear}>Reset</button>
    </aside>
  );
}
