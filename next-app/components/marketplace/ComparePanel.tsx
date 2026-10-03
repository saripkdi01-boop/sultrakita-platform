'use client';

import { Check, MapPin, X } from 'lucide-react';
import { useEffect } from 'react';
import type { MarketplaceListing } from './MarketplaceCard';
import { usePreferences } from '@/lib/preferences';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

function rupiah(value: number) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value); }

export function ComparePanel({ items, onClose }: { items: MarketplaceListing[]; onClose: () => void }) {
  const { language } = usePreferences();
  const mp = getMarketplaceLabels(language);
  const condition = (value?: string | null) => value === 'new' ? mp.mpCondNew : value === 'like_new' ? mp.mpCondLikeNew : value === 'fair' ? mp.mpCondFairCompare : mp.mpCondKeptCompare;
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
          <h2 id="compare-title">{mp.mpCompareTitle}</h2>
          <button type="button" onClick={onClose} aria-label={mp.mpCloseCompare}><X size={18} aria-hidden="true" /></button>
        </header>
        <div className="fbm-compare-table">
          <div className="fbm-compare-labels"><b>{mp.mpProduct}</b><b>{mp.mpPriceCol}</b><b>{mp.mpConditionCol}</b><b>{mp.mpLocationCol}</b><b>{mp.mpStatus}</b></div>
          {items.map(item => (
            <article key={item.id}>
              <div><strong>{item.title}</strong><small>{item.description || mp.mpDefaultProductDesc}</small></div>
              <b>{rupiah(Number(item.price))}</b>
              <span>{condition(item.condition)}</span>
              <span><MapPin size={12} aria-hidden="true" />{item.district || item.city || mp.mpSultraFallback}</span>
              <span><Check size={12} aria-hidden="true" />{mp.mpVerified}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
