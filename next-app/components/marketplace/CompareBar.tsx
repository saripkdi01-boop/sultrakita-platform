'use client';

import { ArrowRight, X } from 'lucide-react';
import type { MarketplaceListing } from './MarketplaceCard';
import { usePreferences } from '@/lib/preferences';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }
export function CompareBar({ items, onRemove, onClear, onOpen }: { items: MarketplaceListing[]; onRemove: (id: string) => void; onClear: () => void; onOpen: () => void }) {
  const { language } = usePreferences();
  const mp = getMarketplaceLabels(language);
  if (!items.length) return null;
  return (
    <aside className="fbm-compare-bar" aria-label={mp.mpCompareBarLabel}>
      <div><b>{mp.mpCompareListings}</b><small>{mp.mpPickUpTo3}</small></div>
      <div className="fbm-compare-items">
        {items.map(item => (
          <span key={item.id}>{item.title}<strong>{rupiah(Number(item.price))}</strong><button type="button" onClick={() => onRemove(String(item.id))} aria-label={mp.mpRemoveFromCompareTitle.replace('{title}', item.title)}><X size={12} aria-hidden="true" /></button></span>
        ))}
      </div>
      <button type="button" className="fbm-compare-cta" onClick={onOpen}>{mp.mpCompare} <ArrowRight size={14} aria-hidden="true" /></button>
      <button type="button" className="fbm-compare-clear" onClick={onClear}>{mp.mpReset}</button>
    </aside>
  );
}
