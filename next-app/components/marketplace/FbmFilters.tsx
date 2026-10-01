'use client';

import { Car, Check, Fish, Home, LayoutGrid, Shirt, Smartphone, Sofa, Sparkles, Trophy, UtensilsCrossed, Wheat, Wrench } from 'lucide-react';
import { useState } from 'react';
import type { MarketplaceFilters } from '@/app/marketplace/page';

// Grup filter ala Amazon: checkbox + hitungan, tetap sinkron ke URL.
// Kategori & kondisi & distrik: pilih-satu (klik lagi = lepas), sesuai
// kontrak filter server yang sudah ada.

export const categoryIcons: Record<string, typeof LayoutGrid> = {
  all: LayoutGrid,
  Elektronik: Smartphone,
  Kendaraan: Car,
  Properti: Home,
  Fashion: Shirt,
  Kuliner: UtensilsCrossed,
  Furnitur: Sofa,
  Jasa: Wrench,
  Pertanian: Wheat,
  Perikanan: Fish,
  Kecantikan: Sparkles,
  Olahraga: Trophy,
};

export const categories = [
  { value: 'all', label: 'Semua' },
  { value: 'Elektronik', label: 'Elektronik' },
  { value: 'Kendaraan', label: 'Kendaraan' },
  { value: 'Properti', label: 'Properti' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Kuliner', label: 'Kuliner' },
  { value: 'Furnitur', label: 'Furnitur' },
  { value: 'Jasa', label: 'Jasa' },
  { value: 'Pertanian', label: 'Pertanian' },
  { value: 'Perikanan', label: 'Perikanan' },
  { value: 'Kecantikan', label: 'Kecantikan' },
  { value: 'Olahraga', label: 'Olahraga' },
];

export const districts = ['Kendari', 'Baubau', 'Kolaka', 'Konawe', 'Muna', 'Buton', 'Konawe Selatan', 'Bombana', 'Wakatobi'];

export const conditions = [
  { value: 'new', label: 'Baru' },
  { value: 'like_new', label: 'Seperti baru' },
  { value: 'good', label: 'Bekas — baik' },
  { value: 'fair', label: 'Bekas — layak pakai' },
];

// Bucket harga ala Amazon -> dipetakan ke ?minPrice=&maxPrice= yang sudah ada.
export const priceBuckets = [
  { label: 'Semua harga', min: '', max: '' },
  { label: 'Di bawah Rp100 rb', min: '', max: '100000' },
  { label: 'Rp100–500 rb', min: '100000', max: '500000' },
  { label: 'Rp500 rb–1 jt', min: '500000', max: '1000000' },
  { label: 'Rp1–5 jt', min: '1000000', max: '5000000' },
  { label: 'Di atas Rp5 jt', min: '5000000', max: '' },
];

type Props = {
  filters: MarketplaceFilters;
  update: (patch: Partial<MarketplaceFilters>) => void;
  categoryCounts: Map<string, number>;
  districtCounts: Map<string, number>;
  conditionCounts: Map<string, number>;
  onClearAll: () => void;
};

function CheckBox() {
  return (
    <span className="fbm-checkbox" aria-hidden="true">
      <Check size={13} strokeWidth={3.5} />
    </span>
  );
}

export function FbmFilters({ filters, update, categoryCounts, districtCounts, conditionCounts, onClearAll }: Props) {
  const [minDraft, setMinDraft] = useState(filters.minPrice);
  const [maxDraft, setMaxDraft] = useState(filters.maxPrice);
  const activeCategory = filters.category || 'all';
  const activeBucket = priceBuckets.findIndex((b) => b.min === (filters.minPrice || '') && b.max === (filters.maxPrice || ''));
  const hasActiveFilter = Boolean(filters.q || filters.category || filters.condition || filters.district !== 'Semua distrik' || filters.minPrice || filters.maxPrice || filters.sort !== 'terbaru');

  return (
    <>
      <section className="fbm-section" aria-label="Kategori">
        <h3 className="fbm-section-title">Kategori</h3>
        {categories.map((category) => {
          const Icon = categoryIcons[category.value] || LayoutGrid;
          const active = activeCategory === category.value;
          const count = category.value === 'all' ? 0 : categoryCounts.get(category.value) || 0;
          return (
            <button
              key={category.value}
              type="button"
              className="fbm-filter-row"
              aria-pressed={active}
              onClick={() => update({ category: category.value === 'all' ? '' : active ? '' : category.value })}
            >
              <CheckBox />
              <span className="fbm-filter-label">
                <span className="fbm-cat-icon"><Icon size={15} aria-hidden="true" /></span>
                {category.label}
              </span>
              {count > 0 && <span className="fbm-filter-count">{count}</span>}
            </button>
          );
        })}
      </section>

      <section className="fbm-section" aria-label="Rentang harga">
        <h3 className="fbm-section-title">Harga</h3>
        {priceBuckets.map((bucket, index) => (
          <button
            key={bucket.label}
            type="button"
            className="fbm-filter-row"
            aria-pressed={activeBucket === index}
            onClick={() => update({ minPrice: bucket.min, maxPrice: bucket.max })}
          >
            <CheckBox />
            <span className="fbm-filter-label">{bucket.label}</span>
          </button>
        ))}
        <div className="fbm-price-custom">
          <label>
            Min
            <input inputMode="numeric" type="number" min={0} placeholder="Rp" value={minDraft} onChange={(event) => setMinDraft(event.target.value)} aria-label="Harga minimum" />
          </label>
          <label>
            Maks
            <input inputMode="numeric" type="number" min={0} placeholder="Rp" value={maxDraft} onChange={(event) => setMaxDraft(event.target.value)} aria-label="Harga maksimum" />
          </label>
          <button type="button" className="fbm-price-apply" onClick={() => update({ minPrice: minDraft, maxPrice: maxDraft })} aria-label="Terapkan rentang harga">
            <Check size={14} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="fbm-section" aria-label="Kondisi barang">
        <h3 className="fbm-section-title">Kondisi</h3>
        {conditions.map((condition) => {
          const active = filters.condition === condition.value;
          const count = conditionCounts.get(condition.value) || 0;
          return (
            <button
              key={condition.value}
              type="button"
              className="fbm-filter-row"
              aria-pressed={active}
              onClick={() => update({ condition: active ? '' : condition.value })}
            >
              <CheckBox />
              <span className="fbm-filter-label">{condition.label}</span>
              {count > 0 && <span className="fbm-filter-count">{count}</span>}
            </button>
          );
        })}
      </section>

      <section className="fbm-section" aria-label="Lokasi">
        <h3 className="fbm-section-title">Lokasi</h3>
        {districts.map((district) => {
          const active = filters.district === district;
          const count = districtCounts.get(district) || 0;
          return (
            <button
              key={district}
              type="button"
              className="fbm-filter-row"
              aria-pressed={active}
              onClick={() => update({ district: active ? 'Semua distrik' : district })}
            >
              <CheckBox />
              <span className="fbm-filter-label">{district}</span>
              {count > 0 && <span className="fbm-filter-count">{count}</span>}
            </button>
          );
        })}
      </section>

      {hasActiveFilter && (
        <button type="button" className="fbm-clear-filters" onClick={onClearAll}>
          Hapus semua filter
        </button>
      )}
    </>
  );
}
