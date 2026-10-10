'use client';

// "Terakhir dilihat" ala Zillow — 100% localStorage, tanpa backend.
// Tidak mengarang: hanya menampilkan properti yang benar-benar dibuka user.
export type RecentProperty = {
  id: string;
  title: string;
  price: number;
  priceType?: string;
  district?: string;
  image?: string;
  viewedAt: number;
};

const KEY = 'suki-properti-recently-viewed';
const MAX = 12;

export function getRecentlyViewed(): RecentProperty[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => x && x.id) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentProperty, 'viewedAt'>) {
  try {
    const rest = getRecentlyViewed().filter((x) => String(x.id) !== String(item.id));
    const next = [{ ...item, viewedAt: Date.now() }, ...rest].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage penuh/diblokir — abaikan diam-diam
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // abaikan
  }
}
