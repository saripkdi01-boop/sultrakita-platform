'use client';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const promoSlides = [
  { id: 1, title: 'Belanja lokal, rasa global', description: 'Temukan produk, jasa, dan seller terpercaya dari Sultra.', ctaText: 'Jelajahi marketplace', ctaLink: '#market', bg: 'from-sultra-forest to-sultra-teal' },
  { id: 2, title: 'Gratis ongkir se-Kendari', description: 'Nikmati promo transaksi pertama dari seller pilihan.', ctaText: 'Klaim promo', ctaLink: '#market', bg: 'from-sultra-gold to-sultra-coral' },
  { id: 3, title: 'Pasang iklan gratis', description: 'Mulai jualan dan temukan pembeli dari Sultra sekarang.', ctaText: 'Pasang sekarang', ctaLink: '#create', bg: 'from-blue-700 to-purple-700' },
];

export function PromoSlider({ onCreate }: { onCreate?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const slide = promoSlides[current];
  useEffect(() => { if (paused) return; const timer = window.setInterval(() => setCurrent(value => (value + 1) % promoSlides.length), 5000); return () => window.clearInterval(timer); }, [paused]);
  function goTo(index: number) { setCurrent((index + promoSlides.length) % promoSlides.length); }
  function activateCta() { if (slide.ctaLink === '#create') onCreate?.(); }
  return <section className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg md:h-48" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={event => { startX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={event => { if (startX.current === null) return; const delta = event.changedTouches[0]?.clientX - startX.current; if (Math.abs(delta) > 40) goTo(current + (delta < 0 ? 1 : -1)); startX.current = null; }} aria-roledescription="carousel" aria-label="Promo SultraKita"><div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} p-5 text-white transition-colors duration-500 md:p-7`}><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Promo SultraKita</span><h2 className="mt-2 max-w-lg text-xl font-bold leading-tight md:text-2xl">{slide.title}</h2><p className="mt-1 max-w-md text-xs text-white/85 md:text-sm">{slide.description}</p>{slide.ctaLink === '#create' ? <button onClick={activateCta} className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-sultra-forest transition-colors hover:bg-white/90">{slide.ctaText}</button> : <Link href={slide.ctaLink} className="mt-3 inline-block rounded-lg bg-white px-3 py-2 text-xs font-bold text-sultra-forest transition-colors hover:bg-white/90">{slide.ctaText}</Link>}</div><button onClick={() => goTo(current - 1)} className="absolute left-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-sultra-forest shadow-sm hover:bg-white" aria-label="Promo sebelumnya"><ChevronLeft size={17}/></button><button onClick={() => goTo(current + 1)} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-sultra-forest shadow-sm hover:bg-white" aria-label="Promo berikutnya"><ChevronRight size={17}/></button><div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">{promoSlides.map((item, index) => <button key={item.id} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all ${index === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} aria-label={`Buka promo ${index + 1}`} aria-current={index === current}/>)}</div><button onClick={() => setPaused(value => !value)} className="absolute right-3 top-3 rounded-full bg-black/20 p-1.5 text-white/80 hover:bg-black/30" aria-label={paused ? 'Lanjutkan carousel' : 'Jeda carousel'}>{paused ? <Play size={12}/> : <Pause size={12}/>}</button></section>;
}
