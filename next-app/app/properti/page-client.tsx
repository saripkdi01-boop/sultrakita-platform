'use client';

import './properti-wc.css';
import { Bed, Building2, BriefcaseBusiness, Gavel, Home, Landmark, List, Map, Plus, Search, Store, Warehouse, SlidersHorizontal, Sparkles, ArrowUpDown, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilter, { type PropertyFilterValues } from '@/components/property/PropertyFilter';
import PropertyMapLazy from '@/components/property/PropertyMapLazy';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';
import { getProperties, getUserFavoriteProperties, togglePropertyFavorite } from '@/lib/actions/property';
import { searchPropertiesInBounds, searchPropertiesInRadius } from '@/lib/actions/property-geo';
import { parseMapView, isValidCoord, type MapView, type MapBounds } from '@/lib/geo';
import type { PropertyPin, RadiusCircle } from '@/components/property/PropertyMap';
import PropertySavedSearchButton, { type PropertySearchSnapshot } from '@/components/property/PropertySavedSearchButton';
import { EcosystemProperti } from '@/components/illustrations';
import { usePreferences } from '@/lib/preferences';
import { tpj } from '@/lib/i18n/dict-propertijobs';

function propertyCategories(language: string) {
  const c = (key: string) => tpj(language, key);
  return [
    { key: undefined as string | undefined, label: tpj(language, 'pjAll'), Icon: Building2, color: 'bg-sultra-teal' },
    { key: 'rumah_second', label: c('pjCatRumahSecond'), Icon: Home, color: 'bg-blue-500' },
    { key: 'rumah_mewah', label: c('pjCatRumahMewah'), Icon: Home, color: 'bg-amber-600' },
    { key: 'rumah_subsidi', label: c('pjCatRumahSubsidi'), Icon: Landmark, color: 'bg-green-600' },
    { key: 'kos_kosan', label: c('pjCatKos'), Icon: Bed, color: 'bg-purple-500' },
    { key: 'kontrakan', label: c('pjCatKontrakan'), Icon: Home, color: 'bg-cyan-600' },
    { key: 'tanah_kavling', label: c('pjCatTanahKavling'), Icon: Map, color: 'bg-lime-600' },
    { key: 'tanah_kosong', label: c('pjCatTanahKosong'), Icon: Map, color: 'bg-emerald-700' },
    { key: 'ruko', label: c('pjCatRuko'), Icon: Store, color: 'bg-orange-600' },
    { key: 'gudang', label: c('pjCatGudang'), Icon: Warehouse, color: 'bg-slate-600' },
    { key: 'kantor', label: c('pjCatKantor'), Icon: BriefcaseBusiness, color: 'bg-indigo-600' },
    { key: 'ruang_usaha', label: c('pjCatRuangUsaha'), Icon: Store, color: 'bg-rose-600' },
    { key: 'properti_lelang', label: c('pjCatLelang'), Icon: Gavel, color: 'bg-red-600' },
    { key: 'takeover_kpr', label: c('pjCatTakeover'), Icon: Landmark, color: 'bg-orange-500' },
    { key: 'properti_developer', label: c('pjCatDeveloper'), Icon: Building2, color: 'bg-teal-700' },
    { key: 'apartemen', label: c('pjCatApartemen'), Icon: Building2, color: 'bg-violet-600' },
    { key: 'villa_resort', label: c('pjCatVilla'), Icon: Home, color: 'bg-pink-600' },
  ];
}

type CategoryKey =
  | 'rumah_second' | 'rumah_mewah' | 'rumah_subsidi' | 'kos_kosan' | 'kontrakan'
  | 'tanah_kavling' | 'tanah_kosong' | 'ruko' | 'gudang' | 'kantor' | 'ruang_usaha'
  | 'properti_lelang' | 'takeover_kpr' | 'properti_developer' | 'apartemen' | 'villa_resort'
  | undefined;

// Fase 1.1: initialProperties di-render di server (SEO + LCP). Client melewati load pertama
// bila data awal sudah tersedia.
export default function PropertiPage({ initialProperties = [] }: { initialProperties?: any[] }) {
  const { language } = usePreferences();
  const p = (key: string, vars?: Record<string, string | number>) => tpj(language, key, vars ?? {});
  const categories = useMemo(() => propertyCategories(language), [language]);
  const [category, setCategory] = useState<CategoryKey>();
  const [district, setDistrict] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilterValues>({ certificateTypes: [], canKpr: false, isLelang: false, takeover: false });
  const [properties, setProperties] = useState<any[]>(initialProperties);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(initialProperties.length === 0); const skipInitialLoad = useRef(initialProperties.length > 0);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Fase 3: state map-first.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [mapView, setMapView] = useState<MapView>(() => (typeof window === 'undefined'
    ? { lat: -3.99, lng: 122.52, zoom: 11 }
    : parseMapView({
      lat: new URLSearchParams(window.location.search).get('lat'),
      lng: new URLSearchParams(window.location.search).get('lng'),
      zoom: new URLSearchParams(window.location.search).get('zoom'),
    })));
  const mapViewRef = useRef(mapView);
  mapViewRef.current = mapView;
  const [mapPins, setMapPins] = useState<PropertyPin[]>([]);
  // Program 4-jam (Properti): filter radius di sekitar titik tengah peta.
  // null = semua area (perilaku lama); angka = radius km aktif.
  const [radiusKm, setRadiusKm] = useState<number | null>(null);
  const radiusOptions = [1, 3, 5, 10, 25];
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const viewportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load(overrides?: { district?: string; minPrice?: string; maxPrice?: string }) {
    setLoading(true);
    setLoadError('');
    const nextDistrict = overrides?.district ?? district;
    const nextMin = overrides?.minPrice ?? minPrice;
    const nextMax = overrides?.maxPrice ?? maxPrice;
    const result = await getProperties({ category, district: advancedFilters.district || nextDistrict || undefined, regency: advancedFilters.regency || undefined, subdistrict: advancedFilters.subdistrict || undefined, minPrice: advancedFilters.minPrice ?? (nextMin ? Number(nextMin) : undefined), maxPrice: advancedFilters.maxPrice ?? (nextMax ? Number(nextMax) : undefined), certificateTypes: advancedFilters.certificateTypes, canKpr: advancedFilters.canKpr, isLelang: advancedFilters.isLelang, takeover: advancedFilters.takeover });
    if (result.ok) setProperties(result.data);
    else { setProperties([]); setLoadError(p('pjLoadError')); }
    const saved = await getUserFavoriteProperties();
    if (saved.ok) setFavorites(saved.data);
    setLoading(false);
  }

  useEffect(() => { const initialCategory = new URLSearchParams(window.location.search).get('category'); if (initialCategory && categories.some(item => item.key === initialCategory)) setCategory(initialCategory as CategoryKey); }, []);
  useEffect(() => { if (skipInitialLoad.current) { skipInitialLoad.current = false; setLoading(false); void (async () => { const saved = await getUserFavoriteProperties(); if (saved.ok) setFavorites(saved.data); })(); return; } void load(); }, [category]);
  const visibleProperties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = normalized ? properties.filter(property => `${property.title} ${property.district || ''} ${property.city || ''}`.toLowerCase().includes(normalized)) : properties;
    return [...filtered].sort((a, b) => sort === 'price-low' ? Number(a.price) - Number(b.price) : sort === 'price-high' ? Number(b.price) - Number(a.price) : 0);
  }, [properties, query, sort]);
  const counts = useMemo(() => categories.map(item => ({ ...item, count: item.key ? properties.filter(property => property.category === item.key).length : properties.length })), [properties, categories]);
  const hasSearch = Boolean(query || district || minPrice || maxPrice || category || advancedFilters.regency || advancedFilters.district || advancedFilters.subdistrict);
  async function favorite(id: string) { const result = await togglePropertyFavorite(id); if (result.ok) setFavorites(current => result.isFavorite ? [...current, id] : current.filter(item => item !== id)); }
  function resetSearch() { setQuery(''); setDistrict(''); setMinPrice(''); setMaxPrice(''); setCategory(undefined); setAdvancedFilters({ certificateTypes: [], canKpr: false, isLelang: false, takeover: false }); }
  function submitSearch(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); void load(); }

  // ---------- Fase 3: logika map-first ----------
  function toPin(property: any): PropertyPin | null {
    const lat = Number(property.latitude);
    const lng = Number(property.longitude);
    if (!isValidCoord(lat, lng)) return null;
    return {
      id: String(property.id),
      title: property.title ?? p('pjPropertyFallback'),
      price: Number(property.price) || 0,
      lat, lng,
      detailUrl: `/properti/${property.id}`,
      // Jarak dari titik radius (bila hasil pencarian radius) + kecamatan
      // untuk info area yang jujur — keduanya dari data listing nyata.
      ...(typeof property._distanceKm === 'number' && Number.isFinite(property._distanceKm) ? { distanceKm: property._distanceKm } : {}),
      ...(property.district ? { district: String(property.district) } : {}),
    };
  }

  // Pin mengikuti daftar yang terlihat (filter) agar list dan peta selalu konsisten.
  // Dalam mode radius, pin dikelola pencarian radius (lihat efek radiusKm di bawah).
  useEffect(() => {
    if (radiusKm != null) return;
    setMapPins(visibleProperties.map(toPin).filter((pin): pin is PropertyPin => pin !== null));
  }, [visibleProperties, radiusKm]);

  // Viewport berubah (geser/zoom peta): perbarui pin via query geo + deep link URL (debounce 600 mdtk).
  const fetchMapPins = useCallback(async (bounds: MapBounds) => {
    const minPriceNum = Number(minPrice);
    const maxPriceNum = Number(maxPrice);
    const result = await searchPropertiesInBounds({
      minLat: bounds.minLat, minLng: bounds.minLng, maxLat: bounds.maxLat, maxLng: bounds.maxLng,
      category: category ?? undefined,
      minPrice: minPrice && minPriceNum > 0 ? minPriceNum : undefined,
      maxPrice: maxPrice && maxPriceNum > 0 ? maxPriceNum : undefined,
      limit: 200,
    });
    if (result.ok) {
      setMapPins(result.data.map(toPin).filter((pin): pin is PropertyPin => pin !== null));
    }
  }, [category, minPrice, maxPrice]);

  // Mode radius: pin = properti berkoordinat nyata dalam lingkaran radiusKm
  // dari titik tengah peta, diurutkan dari terdekat (server action
  // searchPropertiesInRadius — tanpa migrasi).
  const fetchRadiusPins = useCallback(async (view: MapView) => {
    if (radiusKm == null) return;
    const minPriceNum = Number(minPrice);
    const maxPriceNum = Number(maxPrice);
    const result = await searchPropertiesInRadius({
      lat: view.lat,
      lng: view.lng,
      radiusKm,
      category: category ?? undefined,
      minPrice: minPrice && minPriceNum > 0 ? minPriceNum : undefined,
      maxPrice: maxPrice && maxPriceNum > 0 ? maxPriceNum : undefined,
      limit: 200,
    });
    if (result.ok) {
      setMapPins(result.data.map(toPin).filter((pin): pin is PropertyPin => pin !== null));
    }
  }, [radiusKm, category, minPrice, maxPrice]);

  const handleViewportChange = useCallback((view: MapView, bounds: MapBounds) => {
    setMapView(view);
    if (viewportTimer.current) clearTimeout(viewportTimer.current);
    viewportTimer.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set('lat', view.lat.toFixed(5));
      params.set('lng', view.lng.toFixed(5));
      params.set('zoom', String(view.zoom));
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
      if (radiusKm != null) void fetchRadiusPins(view);
      else void fetchMapPins(bounds);
    }, 600);
  }, [fetchMapPins, fetchRadiusPins, radiusKm]);

  // Radius diubah: segarkan pin dari titik tengah peta saat ini (tanpa
  // menunggu geseran peta). Kembali ke pin daftar bila radius dimatikan.
  useEffect(() => {
    if (radiusKm == null) {
      setMapPins(visibleProperties.map(toPin).filter((pin): pin is PropertyPin => pin !== null));
    } else {
      void fetchRadiusPins(mapViewRef.current);
    }
    // Hanya bereaksi pada perubahan radiusKm — mapView dibaca via ref agar
    // tidak memicu refetch ganda bersama debounce viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusKm]);

  // Info area jujur dari data pin nyata: jumlah listing + sebaran kecamatan.
  // (Pakai object biasa — nama `Map` di file ini milik ikon lucide-react.)
  const areaInfo = useMemo(() => {
    if (radiusKm == null || mapPins.length === 0) return '';
    const counts: Record<string, number> = {};
    for (const pin of mapPins) {
      const key = pin.district || p('pjOtherLocation');
      counts[key] = (counts[key] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return p('pjAreaInfo', { n: mapPins.length, km: radiusKm, areas: top.map(([name, count]) => `${name} (${count})`).join(', ') });
  }, [mapPins, radiusKm, language]);

  const radiusCircle: RadiusCircle | null = radiusKm != null
    ? { lat: mapView.lat, lng: mapView.lng, km: radiusKm }
    : null;

  // Snapshot filter aktif untuk tombol "Simpan pencarian".
  const searchSnapshot: PropertySearchSnapshot = {
    q: query.trim() || undefined,
    category: category ?? undefined,
    categoryLabel: category ? categories.find(item => item.key === category)?.label : undefined,
    district: advancedFilters.district || district || undefined,
    minPrice: minPrice && Number(minPrice) > 0 ? Number(minPrice) : undefined,
    maxPrice: maxPrice && Number(maxPrice) > 0 ? Number(maxPrice) : undefined,
    canKpr: advancedFilters.canKpr || undefined,
    isLelang: advancedFilters.isLelang || undefined,
  };

  // Klik pin → scroll ke kartu listing bila kartunya ada di daftar.
  function handlePinClick(id: string) {
    setHoveredId(id);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    cardRefs.current[id]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  return <AppLayout><main className="platform-shell mx-auto max-w-[1440px] px-3 pb-24 pt-3 sm:px-5 lg:px-8 lg:pt-5">
    <EcosystemSlider appSlug="suits" />
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,23,42,.35)] dark:border-slate-700 dark:bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(20,184,166,.12),transparent_32%),linear-gradient(115deg,rgba(15,118,110,.06),transparent_55%)]" />
      <div className="relative px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between"><div><span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-sultra-teal"><Building2 size={15}/> SUKI PROPERTI</span><h1 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">{p('pjPropHeroTitle')}</h1><p className="mt-0.5 max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">{p('pjPropHeroDesc')}</p></div><div className="hidden items-center gap-2 text-[11px] font-semibold text-slate-500 sm:flex dark:text-slate-400"><Sparkles size={15} className="text-amber-500"/> {p('pjPropHeroNote')}</div></div>
        <form onSubmit={submitSearch} className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 sm:flex sm:gap-2 shadow-inner sm:flex-row dark:border-slate-700 dark:bg-slate-800/80"><label className="col-span-2 flex min-h-11 flex-1 items-center gap-2 rounded-lg bg-white px-3 sm:col-span-1 sm:gap-3 sm:rounded-xl sm:px-4 dark:bg-slate-900"><Search size={19} className="shrink-0 text-slate-400"/><input value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" placeholder={p('pjPropSearchPh')} aria-label={p('pjPropSearchAria')} /></label><div className="col-span-1 grid grid-cols-2 gap-1.5 sm:flex sm:gap-2"><input type="number" value={minPrice} onChange={event => setMinPrice(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sultra-teal sm:w-28 dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder={p('pjMinPricePh')} aria-label={p('pjMinPrice')}/><input type="number" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sultra-teal sm:w-28 dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder={p('pjMaxPricePh')} aria-label={p('pjMaxPrice')}/></div><button type="submit" className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-sultra-forest px-3 text-xs sm:rounded-xl sm:px-5 sm:text-sm font-extrabold text-white transition hover:bg-sultra-teal"><Search size={16}/> {p('pjSearchProperty')}</button></form>
      </div>
    </section>

    <div className="mt-4 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">{p('pjExplore')}</p><h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">{p('pjExploreByCategory')}</h2></div><Link href="/properti/create" className="hidden items-center gap-2 rounded-xl bg-sultra-gold px-4 py-2.5 text-xs font-extrabold text-sultra-forest transition hover:-translate-y-0.5 sm:inline-flex"><Plus size={16}/> {p('pjPostProperty')}</Link></div>
    <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">{counts.map(({ key, label, Icon, color, count }) => <button key={label} onClick={() => setCategory(key as CategoryKey)} className={`flex min-w-[104px] shrink-0 flex-col items-center gap-2 rounded-2xl px-3 py-3.5 text-center text-white shadow-sm transition hover:-translate-y-0.5 ${category === key ? 'ring-2 ring-sultra-gold ring-offset-2 dark:ring-offset-slate-950' : ''} ${color}`} aria-pressed={category === key}><Icon size={21}/><span className="text-[11px] font-bold leading-tight">{label}</span><span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">{p('pjListingCount', { n: count })}</span></button>)}</div>

    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start"><div className="min-w-0"><div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900"><div className="flex min-w-0 items-center gap-2"><SlidersHorizontal size={17} className="shrink-0 text-sultra-teal"/><span className="truncate text-sm font-bold text-slate-900 dark:text-white">{hasSearch ? p('pjFilterActive') : p('pjNarrowSearch')}</span>{hasSearch && <button type="button" onClick={resetSearch} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"><X size={12}/> {p('pjReset')}</button>}</div><div className="flex items-center gap-2"><PropertySavedSearchButton snapshot={searchSnapshot} /><label className="sr-only" htmlFor="property-sort">{p('pjSortLabel')}</label><div className="flex items-center gap-1 text-slate-400"><ArrowUpDown size={14}/><select id="property-sort" value={sort} onChange={event => setSort(event.target.value as typeof sort)} className="rounded-lg border-0 bg-slate-50 px-2 py-2 text-xs font-bold text-slate-700 outline-none dark:bg-slate-800 dark:text-slate-200"><option value="newest">{p('pjSortNewest')}</option><option value="price-low">{p('pjSortPriceLow')}</option><option value="price-high">{p('pjSortPriceHigh')}</option></select></div></div></div><div className="mt-3 md:hidden"><PropertyFilter categories={categories.map(({ key, label }) => ({ key, label }))} selectedCategory={category} onCategoryChange={value => setCategory(value as CategoryKey)} onApply={values => { setAdvancedFilters(values); setDistrict(values.district || ''); setMinPrice(values.minPrice?.toString() || ''); setMaxPrice(values.maxPrice?.toString() || ''); }} /></div>
      <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{loading ? p('pjLoadingListings') : p('pjListingsAvailable', { n: visibleProperties.length })}</p><h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">{p('pjFeaturedHomes')}</h2></div><Link href="/properti/create" className="inline-flex items-center gap-1.5 rounded-xl bg-sultra-gold px-3 py-2 text-xs font-extrabold text-sultra-forest sm:hidden"><Plus size={15}/> {p('pjPostShort')}</Link></div>
      {/* Fase 3: tab Daftar/Peta khusus mobile — desktop selalu tampil split */}
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 lg:hidden dark:bg-slate-800" role="tablist" aria-label={p('pjViewLabel')}>
        <button type="button" role="tab" aria-selected={mobileView === 'list'} onClick={() => setMobileView('list')} className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-extrabold transition ${mobileView === 'list' ? 'bg-white text-sultra-forest shadow dark:bg-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}><List size={15}/> {p('pjListTab')}</button>
        <button type="button" role="tab" aria-selected={mobileView === 'map'} onClick={() => setMobileView('map')} className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-extrabold transition ${mobileView === 'map' ? 'bg-white text-sultra-forest shadow dark:bg-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}><Map size={15}/> {p('pjMapTab')}</button>
      </div>
      <div className="mt-4 lg:grid lg:grid-cols-[57%_43%] lg:items-start lg:gap-5">
      <div className={`min-w-0 ${mobileView === 'map' ? 'hidden lg:block' : ''}`} aria-live="polite">
      {loading ? <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="wc-skeleton h-80 rounded-3xl"/>)}</div> : loadError ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-800"><p className="font-bold">{loadError}</p><button type="button" onClick={() => void load()} className="mt-3 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white">{p('pjTryAgain')}</button></div> : visibleProperties.length === 0 ? <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900"><span className="dn-empty-art" aria-hidden="true"><EcosystemProperti /></span><Building2 className="mx-auto text-sultra-teal" size={36}/><h3 className="mt-3 font-bold text-slate-900 dark:text-white">{p('pjNoMatch')}</h3><p className="mt-1 text-sm text-slate-500">{p('pjNoMatchHint')}</p><button type="button" onClick={resetSearch} className="mt-4 rounded-xl bg-sultra-forest px-4 py-2 text-sm font-bold text-white">{p('pjClearFilters')}</button></div> : <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">{visibleProperties.map(property => <div key={property.id} ref={element => { cardRefs.current[property.id] = element; }} onMouseEnter={() => setHoveredId(property.id)} onMouseLeave={() => setHoveredId(current => (current === property.id ? null : current))} className={`rounded-3xl transition ${hoveredId === property.id ? 'ring-2 ring-sultra-teal ring-offset-2 dark:ring-offset-slate-950' : ''}`}><PropertyCard property={property} isFavorite={favorites.includes(property.id)} onFavoriteToggle={() => void favorite(property.id)}/></div>)}</div>}
      </div>
      {/* Fase 3: peta sticky 43% di desktop, tab Peta di mobile */}
      <div className={`mt-4 lg:mt-0 ${mobileView === 'map' ? '' : 'hidden lg:block'}`}>
        <div className="relative h-[68vh] overflow-hidden rounded-3xl border border-slate-200 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)] dark:border-slate-700">
          <PropertyMapLazy pins={mapPins} initialView={mapView} hoveredId={hoveredId} radiusCircle={radiusCircle} onViewportChange={handleViewportChange} onPinClick={handlePinClick} />
          {/* Program 4-jam (Properti): kontrol filter radius di sekitar titik tengah peta */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 py-1.5 pl-3 pr-1.5 shadow-md ring-1 ring-slate-900/10 backdrop-blur dark:bg-slate-900/95">
            <label htmlFor="radius-select" className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{p('pjRadius')}</label>
            <select
              id="radius-select"
              value={radiusKm ?? ''}
              onChange={event => setRadiusKm(event.target.value === '' ? null : Number(event.target.value))}
              className="rounded-full bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sultra-teal dark:bg-slate-800 dark:text-slate-100"
              aria-describedby="radius-hint"
            >
              <option value="">{p('pjAllAreas')}</option>
              {radiusOptions.map(km => <option key={km} value={km}>{p('pjKm', { n: km })}</option>)}
            </select>
          </div>
          <p id="radius-hint" className="sr-only">{p('pjRadiusHint')}</p>
        </div>
        {radiusKm != null ? (
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
            {mapPins.length === 0 && !loading
              ? p('pjNoRadiusResult', { km: radiusKm })
              : areaInfo}
          </p>
        ) : (
          mapPins.length === 0 && !loading && <p className="mt-2 text-center text-xs text-slate-500">{p('pjNoMapResult')}</p>
        )}
      </div>
      </div></div><aside className="hidden lg:block"><PropertyFilter categories={categories.map(({ key, label }) => ({ key, label }))} selectedCategory={category} onCategoryChange={value => setCategory(value as CategoryKey)} onApply={values => { setAdvancedFilters(values); setDistrict(values.district || ''); setMinPrice(values.minPrice?.toString() || ''); setMaxPrice(values.maxPrice?.toString() || ''); }} /></aside></div>
    <Link href="/properti/create" className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-sultra-gold px-5 py-3.5 text-sm font-extrabold text-sultra-forest shadow-[0_12px_30px_-10px_rgba(234,179,8,.8)] transition hover:-translate-y-0.5 sm:bottom-8"><Plus size={21}/> <span className="hidden sm:inline">{p('pjPostProperty')}</span><span className="sm:hidden">{p('pjPostShort')}</span></Link>
  </main></AppLayout>;
}
