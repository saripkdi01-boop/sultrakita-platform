'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getActiveEcosystemBanners, recordEcosystemBannerEvent, type BannerAppSlug, type EcosystemBanner, type BannerEventType } from '@/lib/actions/ecosystem-banners';
import { supabase } from '@/lib/supabase/client';

type Props = { appSlug: BannerAppSlug; banners?: EcosystemBanner[] };
const toneClasses: Record<BannerAppSlug, { badge: string; button: string; dot: string }> = {
  marketplace: { badge: 'bg-emerald-100/90 text-emerald-900', button: 'bg-emerald-950 text-white hover:bg-emerald-800', dot: 'bg-emerald-950' },
  jobs: { badge: 'bg-amber-100/90 text-amber-950', button: 'bg-amber-500 text-amber-950 hover:bg-amber-400', dot: 'bg-amber-500' },
  suits: { badge: 'bg-sky-100/90 text-sky-950', button: 'bg-sky-950 text-white hover:bg-sky-800', dot: 'bg-sky-950' },
};
const appLabels: Record<BannerAppSlug, string> = { marketplace: 'SUKI Marketplace', jobs: 'SUKI Jobs', suits: 'SUKI Suits' };

export function EcosystemSlider({ appSlug, banners: initialBanners = [] }: Props) {
  const [banners, setBanners] = useState<EcosystemBanner[]>(initialBanners);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(initialBanners.length > 0);
  const dragStart = useRef<number | null>(null);
  const tone = toneClasses[appSlug];

  useEffect(() => {
    let cancelled = false;
    if (initialBanners.length) return;
    void getActiveEcosystemBanners(appSlug).then((result) => { if (!cancelled) { setBanners(result.banners); setLoaded(true); } });
    return () => { cancelled = true; };
  }, [appSlug, initialBanners.length]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const refresh = async () => { const result = await getActiveEcosystemBanners(appSlug); if (result.ok) { setBanners(result.banners); setActive((current) => Math.min(current, Math.max(result.banners.length - 1, 0))); setLoaded(true); } };
    const channel = client.channel(`ecosystem-banners:${appSlug}`).on('postgres_changes', { event: '*', schema: 'public', table: 'ecosystem_banners', filter: `app_slug=eq.${appSlug}` }, () => { void refresh(); }).subscribe();
    return () => { void client.removeChannel(channel); };
  }, [appSlug]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!banners.length || reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % banners.length), 5000);
    return () => window.clearInterval(timer);
  }, [banners.length, reducedMotion]);

  useEffect(() => {
    if (banners[active]) void recordEcosystemBannerEvent({ bannerId: banners[active].id, appSlug, eventType: 'banner_view' });
  }, [active, appSlug, banners]);

  function selectSlide(index: number, eventType: BannerEventType = 'banner_next') {
    setActive(index);
    if (banners[index]) void recordEcosystemBannerEvent({ bannerId: banners[index].id, appSlug, eventType });
  }
  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (dragStart.current === null || banners.length < 2) return;
    const distance = event.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(distance) < 42) return;
    const direction = distance < 0 ? 1 : -1;
    selectSlide((active + direction + banners.length) % banners.length);
  }

  if (!loaded) return <section aria-label={`${appLabels[appSlug]} sedang memuat banner`} className={`ecosystem-slider ecosystem-slider-loading ecosystem-slider-${appSlug} mb-4 min-h-[11rem] rounded-2xl sm:min-h-[14rem]`} />;
  if (!banners.length) return null;

  return <section className={`ecosystem-slider ecosystem-slider-${appSlug} relative isolate mb-4 overflow-hidden rounded-2xl shadow-lg`} aria-label={`Promosi ${appLabels[appSlug]}`} aria-roledescription="carousel" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { dragStart.current = null; }}>
    <div className="relative min-h-[11rem] cursor-grab overflow-hidden active:cursor-grabbing sm:min-h-[14rem]">
      {banners.map((banner, index) => <div key={banner.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} dari ${banners.length}: ${banner.title}`} aria-hidden={index !== active} className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${index === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <Image src={banner.image_url} alt={banner.title} fill priority={index === 0} sizes="(max-width: 768px) calc(100vw - 28px), 1200px" className="object-cover" />
        <div className="ecosystem-slider-overlay absolute inset-0" />
        <div className="ecosystem-slider-copy relative z-10 flex min-h-[11rem] max-w-2xl flex-col justify-center p-4 sm:min-h-[14rem] sm:p-6">
          <span className={`ecosystem-slider-badge mb-1.5 inline-flex w-fit rounded-full px-2 py-1 text-[8px] font-extrabold uppercase tracking-[.14em] ${tone.badge}`}>{banner.eyebrow}</span>
          <h2 className="ecosystem-slider-title max-w-xl text-xl font-extrabold leading-[1.08] tracking-tight sm:text-3xl">{banner.title}</h2>
          {banner.description && <p className="ecosystem-slider-description mt-1.5 max-w-lg text-[11px] leading-4 sm:text-xs">{banner.description}</p>}
          <Link href={banner.cta_href} onClick={() => void recordEcosystemBannerEvent({ bannerId: banner.id, appSlug, eventType: 'banner_cta_click' })} className={`ecosystem-slider-cta mt-3 inline-flex min-h-8 w-fit items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none` + ` ${tone.button}`}>{banner.cta_label}<ArrowRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>)}
    </div>
    {banners.length > 1 && <div className="ecosystem-slider-dots absolute bottom-3 left-4 right-4 z-20 flex items-center justify-center gap-1.5" role="group" aria-label="Pilih slide">{banners.map((banner, index) => <button key={banner.id} type="button" onClick={() => selectSlide(index)} aria-label={`Tampilkan slide ${index + 1}`} aria-current={index === active} className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${index === active ? `w-6 ${tone.dot}` : 'w-1.5 bg-white/70 hover:bg-white'}`} />)}</div>}
  </section>;
}

export default EcosystemSlider;
