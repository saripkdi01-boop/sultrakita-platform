'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PublicListing } from '@/lib/listings-query';

// Slice 1 (program 4-jam): "Terakhir dilihat" ala Tokopedia/Shopee.
// Murni client-side via localStorage — tanpa backend, tanpa data demo.
// Menyimpan snapshot minimal (id, judul, harga, thumbnail) agar rail tetap
// bisa dirender walau listing tidak ada di hasil pencarian saat ini.

export type RecentListing = {
  id: string;
  title: string;
  price: number;
  thumbnail: string | null;
  seenAt: number;
};

const STORAGE_KEY = 'suki-mkt-recent';
const MAX_ITEMS = 12;

function loadStored(): RecentListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is RecentListing =>
        typeof entry === 'object' && entry !== null &&
        typeof (entry as RecentListing).id === 'string' &&
        typeof (entry as RecentListing).title === 'string')
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentListing[]>([]);

  useEffect(() => {
    setRecent(loadStored());
  }, []);

  const record = useCallback((listing: PublicListing) => {
    const images = Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : listing.thumbnail_url ? [listing.thumbnail_url] : [];
    const entry: RecentListing = {
      id: String(listing.id),
      title: listing.title,
      price: Math.trunc(Number(listing.price) || 0),
      thumbnail: images[0] || null,
      seenAt: Date.now(),
    };
    setRecent((current) => {
      const next = [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Penyimpanan penuh/diblokir — riwayat sesi ini tetap jalan di memori.
      }
      return next;
    });
  }, []);

  return { recent, record };
}
