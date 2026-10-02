'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BellPlus, Check, ChevronRight, Heart, LayoutGrid, MapPin, Plus, Scale, Search, SlidersHorizontal, Sparkles, Trash2, X } from 'lucide-react';
import type { PublicListing } from '@/lib/listings-query';
import type { MarketplaceFilters } from './page';
import './marketplace-fb.css';
import { FbmSearch } from '@/components/marketplace/FbmSearch';
import { FbmFilters, categories, categoryIcons, conditions } from '@/components/marketplace/FbmFilters';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { DealOfTheDay } from '@/components/marketplace/DealOfTheDay';
import { QuickViewModal } from '@/components/marketplace/QuickViewModal';
import { CompareBar } from '@/components/marketplace/CompareBar';
import { ComparePanel } from '@/components/marketplace/ComparePanel';
import { Recommendations } from '@/components/marketplace/Recommendations';
import { RecentlyViewed } from '@/components/marketplace/RecentlyViewed';
import { useRecentlyViewed, type RecentListing } from '@/components/marketplace/useRecentlyViewed';
import { LoginSheet } from '@/components/marketplace/LoginSheet';
import { AdSlot } from '@/components/ads/AdSlot';
import { useWishlist } from '@/components/marketplace/useWishlist';
import { useSessionProfile } from '@/hooks/useSessionProfile';
import { deleteSavedSearch, listSavedSearches, saveSearchAlert, setSearchAlertEnabled } from '@/lib/actions/marketplace';

// Gaya Facebook Marketplace (basis) + pola Amazon (filter checkbox +
// hitungan, rating bintang, kepadatan info) + Rakuten (identitas toko,
// strip deal). Kontrak data & perilaku dipertahankan penuh:
// - filter tersinkron URL (?q=&district=&category=&condition=&minPrice=&maxPrice=&sort= + alias)
// - wishlist optimistis + login sheet, compare maks 3, quick view ?listing=,
//   simpan pencarian + alert, DealOfTheDay (is_featured), rekomendasi,
//   trust strip, SEO tetap di page.tsx.

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'termurah', label: 'Termurah' },
  { value: 'termahal', label: 'Termahal' },
];

type SavedSearch = { id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string };

function clearFilters(): MarketplaceFilters {
  return { q: '', district: 'Semua distrik', category: '', condition: '', minPrice: '', maxPrice: '', sort: 'terbaru' };
}

export default function MarketplacePageClient({ initialItems, initialFilters, initialNotice }: { initialItems: PublicListing[]; initialFilters: MarketplaceFilters; initialNotice: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useSessionProfile();
  const wishlist = useWishlist();
  const { recent, record: recordRecent } = useRecentlyViewed();
  const [items, setItems] = useState<PublicListing[]>(initialItems);
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [notice, setNotice] = useState(initialNotice);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<PublicListing | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Sinkron dari server saat URL berubah (termasuk back/forward browser).
  useEffect(() => {
    setItems(initialItems);
    setFilters(initialFilters);
    setNotice(initialNotice);
  }, [initialItems, initialFilters, initialNotice]);

  const pushFilters = useCallback((next: MarketplaceFilters) => {
    setFilters(next);
    setShowWishlistOnly(false);
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.district && next.district !== 'Semua distrik') params.set('district', next.district);
    if (next.category) params.set('category', next.category);
    if (next.condition) params.set('condition', next.condition);
    if (next.minPrice) params.set('minPrice', next.minPrice);
    if (next.maxPrice) params.set('maxPrice', next.maxPrice);
    if (next.sort && next.sort !== 'terbaru') params.set('sort', next.sort);
    const query = params.toString();
    startTransition(() => router.push(query ? `/marketplace?${query}` : '/marketplace', { scroll: false }));
  }, [router]);

  const update = useCallback((patch: Partial<MarketplaceFilters>) => pushFilters({ ...filters, ...patch }), [filters, pushFilters]);

  // Deep link ?listing=<id> — buka quick view langsung dari URL shareable.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('listing');
    if (!target) return;
    const found = items.find((item) => String(item.id) === target);
    if (found) setQuickView(found);
  }, [items]);

  const wishlistItems = useMemo(() => items.filter((item) => wishlist.savedIds.includes(String(item.id))), [items, wishlist.savedIds]);
  const visibleItems = showWishlistOnly ? wishlistItems : items;
  const compareItems = useMemo(() => items.filter((item) => compare.includes(String(item.id))), [items, compare]);

  const toggleCompare = useCallback((id: string) => {
    setCompare((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? current : [...current, id]));
  }, []);

  const categoryLabelOf = useCallback((item: PublicListing) => {
    const label = typeof item.category_name === 'string' ? item.category_name : typeof item.category === 'string' ? item.category : '';
    return label;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const label = categoryLabelOf(item);
      if (label) counts.set(label, (counts.get(label) || 0) + 1);
    }
    return counts;
  }, [items, categoryLabelOf]);

  const districtCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const label = typeof item.district === 'string' ? item.district : '';
      if (label) counts.set(label, (counts.get(label) || 0) + 1);
    }
    return counts;
  }, [items]);

  const conditionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const label = typeof item.condition === 'string' ? item.condition : '';
      if (label) counts.set(label, (counts.get(label) || 0) + 1);
    }
    return counts;
  }, [items]);

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; clear: () => void }> = [];
    if (filters.q) chips.push({ key: 'q', label: `"${filters.q}"`, clear: () => update({ q: '' }) });
    if (filters.category) chips.push({ key: 'category', label: filters.category, clear: () => update({ category: '' }) });
    if (filters.condition) chips.push({ key: 'condition', label: conditions.find((c) => c.value === filters.condition)?.label || filters.condition, clear: () => update({ condition: '' }) });
    if (filters.district && filters.district !== 'Semua distrik') chips.push({ key: 'district', label: filters.district, clear: () => update({ district: 'Semua distrik' }) });
    if (filters.minPrice || filters.maxPrice) chips.push({ key: 'price', label: `Rp${Number(filters.minPrice || 0).toLocaleString('id-ID')} – Rp${filters.maxPrice ? Number(filters.maxPrice).toLocaleString('id-ID') : '∞'}`, clear: () => update({ minPrice: '', maxPrice: '' }) });
    return chips;
  }, [filters, update]);

  const resultsCount = visibleItems.length;
  // Slice 1: catat setiap listing yang dibuka ke "Terakhir dilihat" (lokal).
  const openQuickView = useCallback((item: PublicListing) => { recordRecent(item); setQuickView(item); }, [recordRecent]);
  const openSaveSearch = useCallback(() => { if (!user) { wishlist.setLoginSheetOpen(true); return; } setSaveOpen(true); }, [user, wishlist]);
  const openWishlistTab = useCallback(() => { if (!user) { wishlist.setLoginSheetOpen(true); return; } setShowWishlistOnly(true); }, [user, wishlist]);

  // Slice 1: "Produk serupa" ala Shopee/Amazon untuk quick view — skor dari
  // data yang sudah dimuat (tanpa fetch tambahan): kategori sama (+3),
  // distrik sama (+2), rentang harga dekat (+1), penjual sama (+1).
  const similarItems = useMemo(() => {
    if (!quickView) return [];
    const currentCat = categoryLabelOf(quickView);
    const currentDistrict = typeof quickView.district === 'string' ? quickView.district : '';
    const currentPrice = Math.trunc(Number(quickView.price) || 0);
    const currentSeller = quickView.seller?.id != null ? String(quickView.seller.id) : '';
    return items
      .filter((item) => String(item.id) !== String(quickView.id))
      .map((item) => {
        let score = 0;
        const cat = categoryLabelOf(item);
        if (cat && currentCat && cat === currentCat) score += 3;
        const district = typeof item.district === 'string' ? item.district : '';
        if (district && currentDistrict && district === currentDistrict) score += 2;
        const price = Math.trunc(Number(item.price) || 0);
        if (currentPrice > 0 && price > 0 && Math.min(price, currentPrice) / Math.max(price, currentPrice) >= 0.7) score += 1;
        const seller = item.seller?.id != null ? String(item.seller.id) : '';
        if (seller && currentSeller && seller === currentSeller) score += 1;
        return { item, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((row) => row.item);
  }, [quickView, items, categoryLabelOf]);

  // Rail "Terakhir dilihat": sembunyikan yang sudah tampil di grid saat ini.
  const recentRailItems = useMemo(() => {
    const inGrid = new Set(items.map((item) => String(item.id)));
    return recent.filter((entry) => !inGrid.has(entry.id)).slice(0, 8);
  }, [recent, items]);

  const openRecentItem = useCallback((entry: RecentListing) => {
    const full = items.find((item) => String(item.id) === entry.id);
    if (full) { openQuickView(full); return; }
    // Fallback: snapshot minimal dari riwayat lokal (tanpa klaim data baru).
    openQuickView({ id: entry.id, title: entry.title, price: entry.price, images: entry.thumbnail ? [entry.thumbnail] : [] });
  }, [items, openQuickView]);

  const breadcrumbCategory = filters.category || '';
  const filterProps = { filters, update, categoryCounts, districtCounts, conditionCounts, onClearAll: () => pushFilters(clearFilters()) };

  return (
    <main className="fbm-page">
      {/* Mobile: search pill sticky di bawah navbar global */}
      <div className="fbm-msearch">
        <FbmSearch id="fbm-search-mobile" value={filters.q} onSearch={(value) => update({ q: value })} />
        <div className="fbm-chiprail" role="group" aria-label="Kategori">
          {categories.map((category) => {
            const Icon = categoryIcons[category.value] || LayoutGrid;
            const active = (filters.category || 'all') === category.value;
            return (
              <button
                key={category.value}
                type="button"
                className="fbm-chip-cat"
                aria-pressed={active}
                onClick={() => update({ category: category.value === 'all' ? '' : active ? '' : category.value })}
              >
                <span className="fbm-cat-icon"><Icon size={14} aria-hidden="true" /></span>
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fbm-layout">
        {/* Desktop: sidebar kiri sticky ala FB */}
        <aside className="fbm-sidebar" aria-label="Pencarian dan filter marketplace">
          <h1 className="fbm-side-title">Marketplace</h1>
          <FbmSearch id="fbm-search-desktop" value={filters.q} onSearch={(value) => update({ q: value })} />
          <button type="button" className="fbm-browse-all" onClick={() => pushFilters({ ...clearFilters(), q: filters.q })}>
            <span className="fbm-cat-icon"><LayoutGrid size={15} aria-hidden="true" /></span>
            Telusuri semua
          </button>
          <FbmFilters {...filterProps} />
        </aside>

        <div className="fbm-main">
          {/* T-ADS: mobile banner (hanya ≤780px via CSS, dismissible, tidak sticky) */}
          {!showWishlistOnly && <AdSlot placementId="mobile-banner" />}
          {/* Tab Telusuri | Pembelian | Penjualan ala FB */}
          <nav className="fbm-tabs" aria-label="Navigasi marketplace">
            <button type="button" className="fbm-tab" aria-selected={!showWishlistOnly} onClick={() => setShowWishlistOnly(false)}>
              Telusuri
            </button>
            <button type="button" className="fbm-tab" aria-selected={showWishlistOnly} onClick={openWishlistTab}>
              <Heart size={15} aria-hidden="true" /> Pembelian
              {wishlist.savedIds.length > 0 && <span className="fbm-tab-badge">{wishlist.savedIds.length}</span>}
            </button>
            <Link href="/marketplace/seller-tools" className="fbm-tab" aria-selected={false}>
              Penjualan
            </Link>
          </nav>

          {/* Breadcrumb kecil ala Amazon saat filter aktif */}
          {(breadcrumbCategory || (filters.district && filters.district !== 'Semua distrik')) && !showWishlistOnly && (
            <p className="fbm-breadcrumb" aria-label="Lokasi Anda">
              <button type="button" onClick={() => pushFilters(clearFilters())}>Marketplace</button>
              <ChevronRight size={12} aria-hidden="true" />
              {breadcrumbCategory ? (
                <span aria-current="page">{breadcrumbCategory}</span>
              ) : (
                <span aria-current="page">{filters.district}</span>
              )}
            </p>
          )}

          {/* T-ADS: leaderboard desktop (hanya ≥1024px via CSS) di atas hasil pencarian */}
          {!showWishlistOnly && <AdSlot placementId="marketplace-leaderboard" eager />}

          {/* Toolbar: jumlah hasil + sort + aksi */}
          <div className="fbm-toolbar">
            <p className="fbm-results-count" role="status">
              {isPending ? 'Memuat hasil…' : showWishlistOnly
                ? (<><strong>{resultsCount}</strong> tersimpan di wishlist</>)
                : (<><strong>{resultsCount}</strong> hasil</>)}
            </p>
            <label className="fbm-sort">
              <span className="fbm-sort-label">Urutkan</span>
              <select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} aria-label="Urutkan hasil">
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <button type="button" className="fbm-action-btn" onClick={openSaveSearch}>
              <BellPlus size={15} aria-hidden="true" /> Simpan pencarian
            </button>
            <button type="button" className="fbm-action-btn fbm-filter-open-btn" onClick={() => setSheetOpen(true)} aria-haspopup="dialog">
              <SlidersHorizontal size={15} aria-hidden="true" /> Filter
            </button>
          </div>

          {/* Tablet: chip kategori horizontal */}
          <div className="fbm-chiprail fbm-chiprail-tablet" role="group" aria-label="Kategori">
            {categories.map((category) => {
              const Icon = categoryIcons[category.value] || LayoutGrid;
              const active = (filters.category || 'all') === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  className="fbm-chip-cat"
                  aria-pressed={active}
                  onClick={() => update({ category: category.value === 'all' ? '' : active ? '' : category.value })}
                >
                  <span className="fbm-cat-icon"><Icon size={14} aria-hidden="true" /></span>
                  {category.label}
                </button>
              );
            })}
          </div>

          {activeChips.length > 0 && !showWishlistOnly && (
            <div className="fbm-chips" aria-label="Filter aktif">
              {activeChips.map((chip) => (
                <button key={chip.key} type="button" className="fbm-chip" onClick={chip.clear} aria-label={`Hapus filter ${chip.label}`}>
                  {chip.label} <X size={13} aria-hidden="true" />
                </button>
              ))}
              <button type="button" className="fbm-chip-clear" onClick={() => pushFilters(clearFilters())}>Hapus semua</button>
            </div>
          )}

          {notice && <p className="fbm-notice" role="status">{notice}</p>}

          {!showWishlistOnly && <DealOfTheDay items={items} onQuickView={openQuickView} />}

          {!showWishlistOnly && <RecentlyViewed items={recentRailItems} onOpen={openRecentItem} />}

          <section aria-live="polite" aria-busy={isPending} aria-label={showWishlistOnly ? 'Wishlist saya' : 'Hasil pencarian'}>
            {isPending ? (
              <div className="fbm-grid" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="fbm-skeleton">
                    <div className="fbm-skeleton-thumb skeleton-shimmer" />
                    <div className="fbm-skeleton-line skeleton-shimmer" />
                    <div className="fbm-skeleton-line short skeleton-shimmer" />
                  </div>
                ))}
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="fbm-empty">
                <Search size={28} aria-hidden="true" />
                <h3>{showWishlistOnly ? 'Wishlist masih kosong' : 'Tidak ada listing yang cocok'}</h3>
                <p>{showWishlistOnly ? 'Ketuk ikon hati pada listing untuk menyimpannya di sini.' : 'Coba ubah kata kunci atau longgarkan filter pencarianmu.'}</p>
                {!showWishlistOnly && (
                  <button type="button" className="fbm-action-btn primary" onClick={() => pushFilters(clearFilters())}>
                    Atur ulang filter
                  </button>
                )}
              </div>
            ) : (
              <div className="fbm-grid">
                {visibleItems.flatMap((item, index) => {
                  const card = (
                    <MarketplaceCard
                      key={String(item.id)}
                      listing={item}
                      index={index}
                      saved={wishlist.savedIds.includes(String(item.id))}
                      onToggleWishlist={() => { void wishlist.toggle(String(item.id)); }}
                      onQuickView={() => openQuickView(item)}
                    />
                  );
                  // T-ADS: interstitial native setelah kartu ke-9
                  if (index === 8) {
                    return [card, <div key={`skad-grid-${index}`}><AdSlot placementId="marketplace-grid" /></div>];
                  }
                  return [card];
                })}
              </div>
            )}
          </section>

          {!showWishlistOnly && visibleItems.length > 0 && <Recommendations items={visibleItems} query={filters.q} onQuickView={openQuickView} />}

          <div className="fbm-trust" aria-label="Kepercayaan marketplace">
            <span><MapPin size={14} aria-hidden="true" /> Penjual dari Sulawesi Tenggara</span>
            <span><Sparkles size={14} aria-hidden="true" /> Badge toko dihitung dari verifikasi &amp; ulasan nyata</span>
            <span><Scale size={14} aria-hidden="true" /> Bandingkan hingga 3 listing sebelum membeli</span>
          </div>
        </div>
      </div>

      {/* Bottom sheet filter untuk tablet/mobile */}
      {sheetOpen && (
        <div className="fbm-sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSheetOpen(false); }}>
          <section className="fbm-sheet" role="dialog" aria-modal="true" aria-labelledby="fbm-filter-title">
            <div className="fbm-sheet-head">
              <h2 id="fbm-filter-title">Filter</h2>
              <button type="button" className="fbm-sheet-close" onClick={() => setSheetOpen(false)} aria-label="Tutup filter"><X size={18} aria-hidden="true" /></button>
            </div>
            <FbmSearch id="fbm-search-sheet" value={filters.q} onSearch={(value) => update({ q: value })} />
            <FbmFilters {...filterProps} />
            <button type="button" className="fbm-sheet-apply" onClick={() => setSheetOpen(false)}>
              Tampilkan {resultsCount} hasil
            </button>
          </section>
        </div>
      )}

      <CompareBar items={compareItems} onRemove={(id) => setCompare((current) => current.filter((item) => item !== id))} onClear={() => setCompare([])} onOpen={() => setCompareOpen(true)} />
      {compareOpen && <ComparePanel items={compareItems} onClose={() => setCompareOpen(false)} />}

      <QuickViewModal
        listing={quickView}
        saved={quickView ? wishlist.savedIds.includes(String(quickView.id)) : false}
        inCompare={quickView ? compare.includes(String(quickView.id)) : false}
        onToggleWishlist={quickView ? () => { void wishlist.toggle(String(quickView.id)); } : undefined}
        onToggleCompare={quickView ? () => toggleCompare(String(quickView.id)) : undefined}
        onClose={() => setQuickView(null)}
        similar={similarItems}
        onSelectSimilar={openQuickView}
      />

      <SaveSearchDialog open={saveOpen} onClose={() => setSaveOpen(false)} filters={filters} />

      <LoginSheet open={wishlist.loginSheetOpen} onClose={() => wishlist.setLoginSheetOpen(false)} />
      {wishlist.lastError && <p className="fbm-wishlist-error" role="alert">{wishlist.lastError}</p>}
    </main>
  );
}

function SaveSearchDialog({ open, onClose, filters }: { open: boolean; onClose: () => void; filters: MarketplaceFilters }) {
  const [name, setName] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus('');
    setLoading(true);
    listSavedSearches()
      .then((result) => { if (result.ok) setSaved(result.searches); else setStatus(result.error || 'Gagal memuat.'); })
      .finally(() => setLoading(false));
  }, [open ]);

  if (!open) return null;

  const filtersPayload: Record<string, unknown> = {
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.district && filters.district !== 'Semua distrik' ? { district: filters.district } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.condition ? { condition: filters.condition } : {}),
    ...(filters.minPrice ? { minPrice: Number(filters.minPrice) } : {}),
    ...(filters.maxPrice ? { maxPrice: Number(filters.maxPrice) } : {}),
  };

  async function handleSave() {
    if (!name.trim()) { setStatus('Beri nama untuk pencarian ini.'); return; }
    setStatus('Menyimpan…');
    const result = await saveSearchAlert({ name: name.trim(), filters: filtersPayload, alertEnabled });
    if (!result.ok) { setStatus(result.error || 'Gagal menyimpan.'); return; }
    setName('');
    const refreshed = await listSavedSearches();
    if (refreshed.ok) setSaved(refreshed.searches);
    setStatus('Pencarian tersimpan. Kamu akan diberi tahu saat ada listing baru yang cocok.');
  }

  async function handleDelete(id: string) {
    const result = await deleteSavedSearch(id);
    if (result.ok) setSaved((current) => current.filter((item) => item.id !== id));
    else setStatus(result.error || 'Gagal menghapus.');
  }

  async function handleToggleAlert(item: SavedSearch) {
    const result = await setSearchAlertEnabled({ id: item.id, enabled: !item.alert_enabled });
    if (result.ok) setSaved((current) => current.map((row) => (row.id === item.id ? { ...row, alert_enabled: !row.alert_enabled } : row)));
    else setStatus(result.error || 'Gagal mengubah alert.');
  }

  return (
    <div className="fbm-qv-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="fbm-save-dialog" role="dialog" aria-modal="true" aria-labelledby="save-search-title">
        <button type="button" className="fbm-sheet-close" onClick={onClose} aria-label="Tutup"><X size={18} aria-hidden="true" /></button>
        <h2 id="save-search-title"><BellPlus size={18} aria-hidden="true" /> Simpan pencarian</h2>
        <p className="fbm-save-summary">Dapatkan notifikasi saat ada listing baru yang cocok dengan filter saat ini.</p>
        <label className="fbm-save-field">
          <span>Nama pencarian</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="mis. Laptop bekas Kendari" maxLength={120} />
        </label>
        <label className="fbm-save-check">
          <input type="checkbox" checked={alertEnabled} onChange={(event) => setAlertEnabled(event.target.checked)} />
          Beri tahu saya saat ada listing baru yang cocok
        </label>
        <button type="button" className="fbm-save-submit" onClick={() => { void handleSave(); }}><Plus size={15} aria-hidden="true" /> Simpan</button>
        {status && <p className="fbm-save-status" role="status">{status}</p>}

        <h3>Pencarian tersimpan</h3>
        {loading ? <p>Memuat…</p> : saved.length === 0 ? (
          <p className="fbm-save-empty">Belum ada pencarian tersimpan.</p>
        ) : (
          <ul className="fbm-save-list">
            {saved.map((item) => (
              <li key={item.id}>
                <div><strong>{item.name}</strong><small>{new Date(item.created_at).toLocaleDateString('id-ID')}</small></div>
                <button type="button" onClick={() => { void handleToggleAlert(item); }} aria-pressed={item.alert_enabled} aria-label={item.alert_enabled ? 'Nonaktifkan alert' : 'Aktifkan alert'}>
                  {item.alert_enabled ? <span className="fbm-save-alert-on"><Check size={13} aria-hidden="true" /> Alert aktif</span> : 'Aktifkan alert'}
                </button>
                <button type="button" onClick={() => { void handleDelete(item.id); }} aria-label={`Hapus ${item.name}`}><Trash2 size={15} aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
