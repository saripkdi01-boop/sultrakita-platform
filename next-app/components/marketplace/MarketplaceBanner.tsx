'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePreferences } from '@/lib/preferences';
import { getMarketplaceLabels } from '@/lib/i18n/dict-marketplace';

const bannerBlur = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22900%22 height=%22500%22 viewBox=%220 0 900 500%22%3E%3Crect width=%22900%22 height=%22500%22 fill=%22%233b514b%22/%3E%3C/svg%3E';

export function MarketplaceBanner() {
  const { language } = usePreferences();
  const mp = getMarketplaceLabels(language);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = [
    {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=85',
      alt: mp.mpBanner1Alt,
      eyebrow: mp.mpBanner1Eyebrow,
      title: mp.mpBanner1Title,
    },
    {
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85',
      alt: mp.mpBanner2Alt,
      eyebrow: mp.mpBanner2Eyebrow,
      title: mp.mpBanner2Title,
    },
    {
      src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=85',
      alt: mp.mpBanner3Alt,
      eyebrow: mp.mpBanner3Eyebrow,
      title: mp.mpBanner3Title,
    },
    {
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85',
      alt: mp.mpBanner4Alt,
      eyebrow: mp.mpBanner4Eyebrow,
      title: mp.mpBanner4Title,
    },
    {
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85',
      alt: mp.mpBanner5Alt,
      eyebrow: mp.mpBanner5Eyebrow,
      title: mp.mpBanner5Title,
    },
  ];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section
      className="marketplace-banner"
      aria-label={mp.mpPromoLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="marketplace-banner-viewport">
        <div className="marketplace-banner-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide) => (
            <div className="marketplace-banner-slide" key={slide.src} aria-hidden={slides[active].src !== slide.src}>
              <Image
                className="marketplace-banner-image"
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 700px) calc(100vw - 36px), calc(100vw - 100px)"
                placeholder="blur"
                blurDataURL={bannerBlur}
                priority={active === 0}
              />
              <div className="marketplace-banner-copy">
                <span>{slide.eyebrow}</span>
                <strong>{slide.title}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="marketplace-banner-dots" role="tablist" aria-label={mp.mpChooseBanner}>
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={index === active ? 'active' : ''}
            role="tab"
            aria-selected={index === active}
            aria-label={`${mp.mpBanner} ${index + 1}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}
