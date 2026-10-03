'use client';

// Tombol "Simpan pencarian" di /properti — menyimpan snapshot filter aktif
// sebagai pencarian tersimpan (alert NON-AKTIF secara default).
// Implementasi orisinal, selaras komponen SavedSearches milik marketplace.

import { useState } from 'react';
import { BellPlus, Check, Loader2 } from 'lucide-react';
import { savePropertySearchAlert } from '@/lib/property-saved-search';
import { shortPriceIdr } from '@/lib/geo';

export type PropertySearchSnapshot = {
  q?: string;
  category?: string;
  categoryLabel?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  canKpr?: boolean;
  isLelang?: boolean;
};

function buildName(snapshot: PropertySearchSnapshot): string {
  const parts: string[] = [];
  if (snapshot.categoryLabel) parts.push(snapshot.categoryLabel);
  else if (snapshot.category) parts.push(snapshot.category.replaceAll('_', ' '));
  if (snapshot.district) parts.push(snapshot.district);
  if (snapshot.q) parts.push(`"${snapshot.q}"`);
  const min = snapshot.minPrice;
  const max = snapshot.maxPrice;
  if (min != null && min > 0 && max != null && max > 0) parts.push(`${shortPriceIdr(min)}–${shortPriceIdr(max)}`);
  else if (min != null && min > 0) parts.push(`≥ ${shortPriceIdr(min)}`);
  else if (max != null && max > 0) parts.push(`≤ ${shortPriceIdr(max)}`);
  if (snapshot.canKpr) parts.push('Bisa KPR');
  if (snapshot.isLelang) parts.push('Lelang');
  return parts.length > 0 ? parts.join(' · ') : 'Semua properti';
}

function hasFilter(snapshot: PropertySearchSnapshot): boolean {
  return Boolean(
    snapshot.q?.trim() || snapshot.category || snapshot.district?.trim()
    || (snapshot.minPrice != null && snapshot.minPrice > 0)
    || (snapshot.maxPrice != null && snapshot.maxPrice > 0)
    || snapshot.canKpr || snapshot.isLelang,
  );
}

export default function PropertySavedSearchButton({ snapshot }: { snapshot: PropertySearchSnapshot }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const meaningful = hasFilter(snapshot);

  async function handleSave() {
    if (!meaningful || state === 'saving' || state === 'saved') return;
    setState('saving');
    setMessage('');
    const result = await savePropertySearchAlert({
      name: buildName(snapshot),
      filters: {
        target: 'properti' as const,
        ...(snapshot.q?.trim() ? { q: snapshot.q.trim() } : {}),
        ...(snapshot.category ? { category: snapshot.category } : {}),
        ...(snapshot.district?.trim() ? { district: snapshot.district.trim() } : {}),
        ...(snapshot.minPrice != null && snapshot.minPrice > 0 ? { minPrice: snapshot.minPrice } : {}),
        ...(snapshot.maxPrice != null && snapshot.maxPrice > 0 ? { maxPrice: snapshot.maxPrice } : {}),
        ...(snapshot.canKpr ? { canKpr: true } : {}),
        ...(snapshot.isLelang ? { isLelang: true } : {}),
      },
      // Default nonaktif — pengaktifan alert butuh persetujuan pemilik.
      alertEnabled: false,
    });
    if (result.ok) {
      setState('saved');
      setMessage('Pencarian tersimpan. Notifikasi alert saat ini nonaktif.');
    } else {
      setState('error');
      setMessage(result.error);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={!meaningful || state === 'saving' || state === 'saved'}
        title={meaningful ? 'Simpan filter saat ini sebagai pencarian tersimpan' : 'Terapkan filter dulu untuk menyimpan pencarian'}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-sultra-teal hover:text-sultra-teal disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {state === 'saving' ? <Loader2 size={14} className="animate-spin" /> : state === 'saved' ? <Check size={14} className="text-emerald-600" /> : <BellPlus size={14} />}
        {state === 'saved' ? 'Tersimpan' : 'Simpan pencarian'}
      </button>
      {message && (
        <p className={`max-w-52 text-right text-[11px] leading-4 ${state === 'error' ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
