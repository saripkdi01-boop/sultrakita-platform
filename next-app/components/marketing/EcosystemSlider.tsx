'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getActiveEcosystemBanners, recordEcosystemBannerEvent, type BannerAppSlug, type EcosystemBanner, type BannerEventType } from '@/lib/actions/ecosystem-banners';

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
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(initialBanners.length > 0);
  const restartTimer = useRef<number | null>(null);
  const tone = toneClasses[appSlug];

  useEffect(() => {
    let cancelled = false;
    if (initialBanners.length) return;
    void getActiveEcosystemBanners(appSlug).then((result) => {
      if (!cancelled) { setBanners(result.banners); setLoaded(true); }
    });
    return () => { cancelled = true; };
  }, [appSlug, initialBanners.length]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!banners.length || !playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % banners.length);
      void recordEcosystemBannerEvent({ bannerId: banners[(active + 1) % banners.length].id, appSlug, eventType: 'banner_next' });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [active, appSlug, banners, playing, reducedMotion]);

  useEffect(() => {
    if (banners[active]) void recordEcosystemBannerEvent({ bannerId: banners[active].id, appSlug, eventType: 'banner_view' });
  }, [active, appSlug, banners]);

  function selectSlide(index: number, eventType: BannerEventType = 'banner_next') {
    setActive(index); setPlaying(false);
    if (banners[index]) void recordEcosystemBannerEvent({ bannerId: banners[index].id, appSlug, eventType });
    if (restartTimer.current) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => setPlaying(true), 9000);
  }
  function move(direction: number) { if (banners.length) selectSlide((active + direction + banners.length) % banners.length); }
  function togglePlaying() { setPlaying((value) => !value); if (banners[active]) void recordEcosystemBannerEvent({ bannerId: banners[active].id, appSlug, eventType: 'banner_pause' }); }

  if (!loaded) return <section aria-label={`${appLabels[appSlug]} sedang memuat banner`} className="mb-6 min-h-[23rem] animate-pulse rounded-[2rem] bg-slate-200 sm:min-h-[25rem]" />;
  if (!banners.length) return null;

  return (
    <section className="relative isolate mb-6 overflow-hidden rounded-[2rem] bg-slate-950 shadow-xl" aria-label={`Promosi ${appLabels[appSlug]}`} aria-roledescription="carousel" onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)} onFocusCapture={() => setPlaying(false)}>
      <div className="relative min-h-[23rem] overflow-hidden sm:min-h-[25rem]">
        {banners.map((banner, index) => <div key={banner.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} dari ${banners.length}: ${banner.title}`} aria-hidden={index !== active} className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${index === active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
          <Image src={banner.image_url} alt={banner.title} fill priority={index === 0} sizes="(max-width: 768px) calc(100vw - 28px), 1200px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/15" />
          <div className="relative z-10 flex min-h-[23rem] max-w-2xl flex-col justify-center p-6 text-white sm:min-h-[25rem] sm:p-10">
            <span className={`mb-4 inline-flex w-fit rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] ${tone.badge}`}>{banner.eyebrow}</span>
            <h2 className="max-w-xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{banner.title}</h2>
            {banner.description && <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">{banner.description}</p>}
            <Link href={banner.cta_href} onClick={() => void recordEcosystemBannerEvent({ bannerId: banner.id, appSlug, eventType: 'banner_cta_click' })} className={`mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-5 text-sm font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${tone.button}`}>{banner.cta_label}<ArrowRight size={16} /></Link>
          </div>
        </div>)}
      </div>
      <div className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between gap-3 sm:left-10 sm:right-10">
        <div className="flex items-center gap-2" role="group" aria-label="Pilih slide">{banners.map((banner, index) => <button key={banner.id} type="button" onClick={() => selectSlide(index)} aria-label={`Tampilkan slide ${index + 1}`} aria-current={index === active} className={`h-2 rounded-full transition-all motion-reduce:transition-none ${index === active ? `w-8 ${tone.dot}` : 'w-2 bg-white/60 hover:bg-white'}`} />)}</div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => move(-1)} aria-label="Slide sebelumnya" className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><ArrowLeft size={16} /></button><button type="button" onClick={() => move(1)} aria-label="Slide berikutnya" className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><ArrowRight size={16} /></button><button type="button" onClick={togglePlaying} aria-label={playing ? 'Jeda rotasi banner' : 'Mulai rotasi banner'} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{playing ? <Pause size={15} /> : <Play size={15} />}</button></div>
      </div>
    </section>
  );
}

export default EcosystemSlider;
