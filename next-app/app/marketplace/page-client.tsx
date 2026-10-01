'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BellPlus, Check, Heart, MapPin, Plus, Scale, Search, Sparkles, Tag, Trash2, X } from 'lucide-react';
import type { PublicListing } from '@/lib/listings-query';
import type { MarketplaceFilters } from './page';
import { MarketplaceSubNav } from '@/components/marketplace/MarketplaceSubNav';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { CategoryBrowser } from '@/components/marketplace/CategoryBrowser';
import { DealOfTheDay } from '@/components/marketplace/DealOfTheDay';
import { QuickViewModal } from '@/components/marketplace/QuickViewModal';
import { CompareBar } from '@/components/marketplace/CompareBar';
import { ComparePanel } from '@/components/marketplace/ComparePanel';
import { Recommendations } from '@/components/marketplace/Recommendations';
import { LoginSheet } from '@/components/marketplace/LoginSheet';
import { useWishlist } from '@/components/marketplace/useWishlist';
import { useSessionProfile } from '@/hooks/useSessionProfile';
import { deleteSavedSearch, listSavedSearches, saveSearchAlert, setSearchAlertEnabled } from '@/lib/actions/marketplace';

// Fase 2.1: filter tersinkron URL via router.push + useTransition.
// - URL selalu mencerminkan state filter (shareable, SEO-friendly)
// - Tombol back/forward browser benar (tidak seperti replaceState)
// - Server me-render ulang dengan searchParams baru -> data selalu sinkron
// - q dari search bar bersifat submit-based (tidak perlu debounce karena
//   hanya terkirim saat submit/saran diklik)

const categories = [
  { value: 'all', label: 'Semua', icon: '🛍️' },
  { value: 'Elektronik', label: 'Elektronik', icon: '📱' },
  { value: 'Kendaraan', label: 'Kendaraan', icon: '🚗' },
  { value: 'Properti', label: 'Properti', icon: '🏠' },
  { value: 'Fashion', label: 'Fashion', icon: '👕' },
  { value: 'Kuliner', label: 'Kuliner', icon: '🍜' },
  { value: 'Furnitur', label: 'Furnitur', icon: '🛋️' },
  { value: 'Jasa', label: 'Jasa', icon: '🔧' },
  { value: 'Pertanian', label: 'Pertanian', icon: '🌾' },
  { value: 'Perikanan', label: 'Perikanan', icon: '🐟' },
  { value: 'Kecantikan', label: 'Kecantikan', icon: '💄' },
  { value: 'Olahraga', label: 'Olahraga', icon: '⚽' },
];

const districts = ['Semua distrik', 'Kendari', 'Baubau', 'Kolaka', 'Konawe', 'Muna', 'Buton', 'Konawe Selatan', 'Bombana', 'Wakatobi'];

const conditions = [
  { value: '', label: 'Semua kondisi' },
  { value: 'new', label: 'Baru' },
  { value: 'like_new', label: 'Seperti baru' },
  { value: 'good', label: 'Bekas — baik' },
  { value: 'fair', label: 'Bekas — layak pakai' },
];

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'termurah', label: 'Termurah' },
  { value: 'termahal', label: 'Termahal' },
];

type SavedSearch = { id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string };

export default function MarketplacePageClient({ initialItems, initialFilters, initialNotice }: { initialItems: PublicListing[]; initialFilters: MarketplaceFilters; initialNotice: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useSessionProfile();
  const wishlist = useWishlist();
  const [items, setItems] = useState<PublicListing[]>(initialItems);
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [notice, setNotice] = useState(initialNotice);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<PublicListing | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minDraft, setMinDraft] = useState(initialFilters.minPrice);
  const [maxDraft, setMaxDraft] = useState(initialFilters.maxPrice);
  const [saveOpen, setSaveOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Sinkron dari server saat URL berubah (termasuk back/forward browser).
  useEffect(() => {
    setItems(initialItems);
    setFilters(initialFilters);
    setMinDraft(initialFilters.minPrice);
    setMaxDraft(initialFilters.maxPrice);
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

  // Deep link ?listing=<uuid> — buka quick view langsung dari URL shareable.
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
  const dealItems = useMemo(() => items.filter((item) => item.is_featured).slice(0, 8), [items]);

  const toggleCompare = useCallback((id: string) => {
    setCompare((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length >= 3 ? current : [...current, id]));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const label = typeof item.category_name === 'string' ? item.category_name : typeof item.category === 'string' ? item.category : '';
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

  const resultsLabel = isPending ? 'Memuat hasil…' : `${visibleItems.length} listing ditemukan`;

  return (
    <main className="marketplace-page">
      <MarketplaceSubNav query={filters.q} onQueryChange={(value) => update({ q: value })} />

      <div className="marketplace-content">
        <CategoryBrowser />

        <div className="marketplace-main">
          <section className="marketplace-toolbar" aria-label="Filter marketplace">
            <div className="marketplace-toolbar-row">
              <button type="button" className="marketplace-filter-toggle" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen}>
                <Tag size={15} aria-hidden="true" /> Filter
              </button>
              <div className="marketplace-sort" role="group" aria-label="Urutkan">
                {sortOptions.map((option) => (
                  <button key={option.value} type="button" className={`marketplace-sort-chip${filters.sort === option.value ? ' active' : ''}`} aria-pressed={filters.sort === option.value} onClick={() => update({ sort: option.value })}>{option.label}</button>
                ))}
              </div>
              <button type="button" className={`marketplace-wishlist-toggle${showWishlistOnly ? ' active' : ''}`} onClick={() => { if (!user) { wishlist.setLoginSheetOpen(true); return; } setShowWishlistOnly((v) => !v); }} aria-pressed={showWishlistOnly}>
                <Heart size={15} aria-hidden="true" /> Wishlist{wishlist.savedIds.length > 0 && ` (${wishlist.savedIds.length})`}
              </button>
              <button type="button" className="marketplace-save-toggle" onClick={() => { if (!user) { wishlist.setLoginSheetOpen(true); return; } setSaveOpen(true); }}>
                <BellPlus size={15} aria-hidden="true" /> Simpan pencarian
              </button>
            </div>

            {filtersOpen && (
              <div className="marketplace-filter-panel">
                <label>
                  <span>Distrik</span>
                  <select value={filters.district} onChange={(event) => update({ district: event.target.value })}>
                    {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                  </select>
                </label>
                <label>
                  <span>Kondisi</span>
                  <select value={filters.condition} onChange={(event) => update({ condition: event.target.value })}>
                    {conditions.map((condition) => <option key={condition.value} value={condition.value}>{condition.label}</option>)}
                  </select>
                </label>
                <div className="marketplace-price-range">
                  <label><span>Harga min</span><input inputMode="numeric" type="number" min={0} placeholder="Rp" value={minDraft} onChange={(event) => setMinDraft(event.target.value)} /></label>
                  <label><span>Harga maks</span><input inputMode="numeric" type="number" min={0} placeholder="Rp" value={maxDraft} onChange={(event) => setMaxDraft(event.target.value)} /></label>
                  <button type="button" onClick={() => update({ minPrice: minDraft, maxPrice: maxDraft })}><Check size={15} aria-hidden="true" /> Terapkan</button>
                </div>
              </div>
            )}

            {activeChips.length > 0 && (
              <div className="marketplace-chips" aria-label="Filter aktif">
                {activeChips.map((chip) => (
                  <button key={chip.key} type="button" className="marketplace-chip" onClick={chip.clear} aria-label={`Hapus filter ${chip.label}`}>
                    {chip.label} <X size={13} aria-hidden="true" />
                  </button>
                ))}
                <button type="button" className="marketplace-chip-clear" onClick={() => pushFilters({ q: '', district: 'Semua distrik', category: '', condition: '', minPrice: '', maxPrice: '', sort: 'terbaru' })}>Hapus semua</button>
              </div>
            )}
          </section>

          {notice && <p className="marketplace-notice" role="status">{notice}</p>}

          <div className="marketplace-districts" role="group" aria-label="Kategori">
            {categories.map((category) => (
              <button key={category.value} type="button" className={(filters.category || 'all') === category.value ? 'active' : ''} aria-pressed={(filters.category || 'all') === category.value} onClick={() => update({ category: category.value === 'all' ? '' : category.value })}>
                {category.icon} {category.label}{category.value !== 'all' && (categoryCounts.get(category.value) || 0) > 0 ? ` (${categoryCounts.get(category.value)})` : ''}
              </button>
            ))}
          </div>

          {dealItems.length > 0 && !showWishlistOnly && <DealOfTheDay items={items} />}

          <div className="marketplace-results" aria-live="polite" aria-busy={isPending}>
            <div className="marketplace-results-head">
              <h2>{showWishlistOnly ? 'Wishlist saya' : 'Jelajahi listing'}</h2>
              <span className="marketplace-results-count" role="status">{resultsLabel}</span>
            </div>

            {isPending ? (
              <div className="marketplace-grid" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => <div key={index} className="marketplace-card-skeleton" />)}
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="marketplace-empty">
                <Search size={28} aria-hidden="true" />
                <h3>{showWishlistOnly ? 'Wishlist masih kosong' : 'Tidak ada listing yang cocok'}</h3>
                <p>{showWishlistOnly ? 'Ketuk ikon hati pada listing untuk menyimpannya di sini.' : 'Coba ubah kata kunci atau longgarkan filter pencarianmu.'}</p>
                {!showWishlistOnly && (
                  <button type="button" onClick={() => pushFilters({ q: '', district: 'Semua distrik', category: '', condition: '', minPrice: '', maxPrice: '', sort: 'terbaru' })}>
                    Atur ulang filter
                  </button>
                )}
              </div>
            ) : (
              <div className="marketplace-grid">
                {visibleItems.map((item, index) => (
                  <MarketplaceCard
                    key={String(item.id)}
                    listing={item}
                    index={index}
                    saved={wishlist.savedIds.includes(String(item.id))}
                    inCompare={compare.includes(String(item.id))}
                    onToggleWishlist={() => { void wishlist.toggle(String(item.id)); }}
                    onQuickView={() => setQuickView(item)}
                    onCompare={() => toggleCompare(String(item.id))}
                  />
                ))}
              </div>
            )}
          </div>

          {!showWishlistOnly && visibleItems.length > 0 && <Recommendations items={visibleItems} query={filters.q} />}
        </div>
      </div>

      <CompareBar items={compareItems} onRemove={(id) => setCompare((current) => current.filter((item) => item !== id))} onClear={() => setCompare([])} onOpen={() => setCompareOpen(true)} />
      {compareOpen && <ComparePanel items={compareItems} onClose={() => setCompareOpen(false)} />}

      <QuickViewModal listing={quickView} saved={quickView ? wishlist.savedIds.includes(String(quickView.id)) : false} onToggleWishlist={quickView ? () => { void wishlist.toggle(String(quickView.id)); } : undefined} onClose={() => setQuickView(null)} />

      <SaveSearchDialog open={saveOpen} onClose={() => setSaveOpen(false)} filters={filters} />

      <LoginSheet open={wishlist.loginSheetOpen} onClose={() => wishlist.setLoginSheetOpen(false)} />
      {wishlist.lastError && <p className="marketplace-wishlist-error" role="alert">{wishlist.lastError}</p>}

      <div className="marketplace-trust-strip" aria-label="Kepercayaan marketplace">
        <span><MapPin size={14} aria-hidden="true" /> Penjual dari Sulawesi Tenggara</span>
        <span><Sparkles size={14} aria-hidden="true" /> Badge toko dihitung dari verifikasi & ulasan nyata</span>
        <span><Scale size={14} aria-hidden="true" /> Bandingkan hingga 3 listing sebelum membeli</span>
      </div>
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
    <div className="login-sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="save-search-dialog" role="dialog" aria-modal="true" aria-labelledby="save-search-title">
        <button type="button" className="login-sheet-close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        <h2 id="save-search-title"><BellPlus size={18} aria-hidden="true" /> Simpan pencarian</h2>
        <p className="save-search-summary">Dapatkan notifikasi saat ada listing baru yang cocok dengan filter saat ini.</p>
        <label className="save-search-field">
          <span>Nama pencarian</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="mis. Laptop bekas Kendari" maxLength={120} />
        </label>
        <label className="save-search-check">
          <input type="checkbox" checked={alertEnabled} onChange={(event) => setAlertEnabled(event.target.checked)} />
          Beri tahu saya saat ada listing baru yang cocok
        </label>
        <button type="button" className="save-search-submit" onClick={() => { void handleSave(); }}><Plus size={15} aria-hidden="true" /> Simpan</button>
        {status && <p className="save-search-status" role="status">{status}</p>}

        <h3>Pencarian tersimpan</h3>
        {loading ? <p>Memuat…</p> : saved.length === 0 ? (
          <p className="save-search-empty">Belum ada pencarian tersimpan.</p>
        ) : (
          <ul className="save-search-list">
            {saved.map((item) => (
              <li key={item.id}>
                <div><strong>{item.name}</strong><small>{new Date(item.created_at).toLocaleDateString('id-ID')}</small></div>
                <button type="button" onClick={() => { void handleToggleAlert(item); }} aria-pressed={item.alert_enabled} aria-label={item.alert_enabled ? 'Nonaktifkan alert' : 'Aktifkan alert'}>
                  {item.alert_enabled ? <span className="save-search-alert-on"><Check size={13} aria-hidden="true" /> Alert aktif</span> : 'Aktifkan alert'}
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
