'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Quote } from 'lucide-react';
import { PORTFOLIO, TESTIMONIAL } from '@/lib/homepage/content';
import { HOME_ASSETS } from '@/lib/homepage/assets';
import { trackHome } from '@/lib/homepage/track';
import { HomeImage, hasAsset } from './HomeImage';

/** Tahap 3 corong — KEINGINAN: bukti bisa dibuka, bukan janji. */
export function ProofSection() {
  const listRef = useRef<HTMLUListElement>(null);

  // portfolio_view: sekali per kartu saat ≥50% terlihat.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !('IntersectionObserver' in window)) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.portfolio;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackHome('portfolio_view', { portfolio: id, trigger: 'impression' });
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    list.querySelectorAll('[data-portfolio]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const showFamilyPhoto = hasAsset(HOME_ASSETS.agenProperti);

  return (
    <section id="bukti" className="hm-section" aria-labelledby="hm-proof-title">
      <div className="hm-wrap">
        <header className="hm-section-head hm-reveal">
          <p className="hm-eyebrow">Bukti nyata</p>
          <h2 id="hm-proof-title" className="hm-h2">Sudah tayang. Bisa kamu buka sekarang.</h2>
          <p className="hm-section-lead">Tiga produk live buatan tim Suki — satu proyek klien, dua produk kami sendiri. Tanpa mockup.</p>
        </header>

        <ul ref={listRef} className="hm-portfolio">
          {PORTFOLIO.map((item, index) => (
            <li key={item.id} className="hm-reveal" style={{ '--i': index } as React.CSSProperties}>
              <article className="hm-work" data-portfolio={item.id}>
                <div className={`hm-work-stage${item.desktopShot ? ' has-desktop' : ''}`}>
                  {item.desktopShot && (
                    <div className="hm-work-desktop">
                      <Image src={item.desktopShot} alt={item.desktopAlt ?? ''} fill sizes="(max-width: 900px) 80vw, 340px" loading="lazy" />
                    </div>
                  )}
                  <div className="hm-work-phone">
                    <Image src={item.mobileShot} alt={item.mobileAlt} fill sizes="160px" loading="lazy" />
                  </div>
                </div>
                <div className="hm-work-body">
                  <p className="hm-badge">{item.kind}</p>
                  <h3 className="hm-h3">{item.title}</h3>
                  <dl className="hm-work-facts">
                    <div><dt>Masalah</dt><dd>{item.problem}</dd></div>
                    <div><dt>Hasil</dt><dd>{item.outcome}</dd></div>
                  </dl>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hm-link hm-work-link"
                    data-track="portfolio_view"
                    data-track-portfolio={item.id}
                    data-track-trigger="click"
                  >
                    Buka {item.urlLabel} <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className={`hm-proof-strip hm-reveal${showFamilyPhoto ? ' has-photo' : ''}`}>
          <figure className="hm-testimonial" data-verified={TESTIMONIAL.verified}>
            <Quote size={28} aria-hidden="true" />
            <blockquote>{TESTIMONIAL.quote}</blockquote>
            <figcaption>
              {TESTIMONIAL.verified
                ? `${TESTIMONIAL.name} — ${TESTIMONIAL.role} · ${TESTIMONIAL.metric}`
                : TESTIMONIAL.pendingNote}
            </figcaption>
          </figure>
          {showFamilyPhoto && (
            <figure className="hm-proof-photo">
              <div className="hm-proof-photo-frame">
                <HomeImage asset={HOME_ASSETS.agenProperti} sizes="(max-width: 900px) 92vw, 420px" className="hm-cover" />
              </div>
              <figcaption>Foto ilustrasi — bukan klien.</figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
