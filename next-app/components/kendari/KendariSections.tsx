'use client';

import Link from 'next/link';
import { usePreferences } from '@/lib/preferences';
import { useCoreLabels } from '@/lib/i18n/dictionaries-lazy';
import { Globe, ShieldCheck, Users } from 'lucide-react';
import WcReveal from '@/components/ui/WcReveal';
import {
  SukiIconBisnis,
  SukiIconJobs,
  SukiIconKampung,
  SukiIconKomunitas,
  SukiIconMarketplace,
  SukiIconProperti,
} from '@/components/layout/SukiIcons';
import ImageSlot from './ImageSlot';

/* ------------------------------------------------------------------ */
/* Value strip — 3 proposisi jujur, tanpa angka karangan.              */
/* ------------------------------------------------------------------ */
const getValues = (t: Record<string, string>) => [
  { Icon: Globe, title: t.value1Title, desc: t.value1Desc },
  { Icon: ShieldCheck, title: t.value2Title, desc: t.value2Desc },
  { Icon: Users, title: t.value3Title, desc: t.value3Desc },
];

export function KendariValue() {
  const { language } = usePreferences();
  const t: Record<string, string> = useCoreLabels(language);
  const values = getValues(t);
  return (
    <section className="kh-section kh-value" aria-label={t.ecoLabel}>
      <div className="kh-wrap">
        <div className="kh-value-grid">
          {values.map((v, i) => (
            <WcReveal key={v.title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="kh-value-card">
                <div className="kh-value-icon">
                  <v.Icon size={26} aria-hidden="true" />
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ekosistem — 6 modul dengan ikon SVG khas SUKI, link ke rute nyata.  */
/* ------------------------------------------------------------------ */
const getModules = (t: Record<string, string>) => [
  { Icon: SukiIconMarketplace, title: t.marketplace, desc: t.moduleMarketplaceDesc, href: '/marketplace' },
  { Icon: SukiIconProperti, title: t.property, desc: t.modulePropertyDesc, href: '/properti' },
  { Icon: SukiIconJobs, title: t.footerJobs, desc: t.moduleJobsDesc, href: '/jobs' },
  { Icon: SukiIconKomunitas, title: t.groups, desc: t.moduleCommunityDesc, href: '/groups' },
  { Icon: SukiIconKampung, title: 'Kampung', desc: t.moduleKampungDesc, href: '/kampung' },
  { Icon: SukiIconBisnis, title: t.business, desc: t.moduleBusinessDesc, href: '/Business' },
];

export function KendariEcosystem() {
  const { language } = usePreferences();
  const t: Record<string, string> = useCoreLabels(language);
  const modules = getModules(t);
  return (
    <section className="kh-section kh-eco" id="ekosistem" aria-labelledby="kh-eco-title">
      <div className="kh-wrap">
        <WcReveal>
          <div className="kh-label">{t.ecoLabel}</div>
        </WcReveal>
        <WcReveal delay={1}>
          <h2 className="kh-h2" id="kh-eco-title">
            {t.ecoTitleA}
            <br />
            <span className="kh-gold">{t.ecoTitleB}</span>
          </h2>
        </WcReveal>
        <WcReveal delay={2}>
          <p className="kh-desc">
            {t.ecoDesc}
          </p>
        </WcReveal>
        <div className="kh-eco-grid">
          {modules.map((m, i) => (
            <WcReveal key={m.title} delay={(i % 3) as 0 | 1 | 2}>
              <Link
                href={m.href}
                className="kh-eco-card"
                aria-label={`${m.title} — ${m.desc}`}
              >
                <span className="kh-eco-icon">
                  <m.Icon aria-hidden="true" />
                </span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <span className="kh-eco-arrow" aria-hidden="true">→</span>
              </Link>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bahteramas — metafora "menghubungkan" dipetakan ke fitur nyata.      */
/* ------------------------------------------------------------------ */
const getBahteraLinks = (t: Record<string, string>) => [
  { title: t.baht1Title, desc: t.baht1Desc, href: '/marketplace' },
  { title: t.baht2Title, desc: t.baht2Desc, href: '/jobs' },
  { title: t.baht3Title, desc: t.baht3Desc, href: '/properti' },
];

export function KendariBahteramas() {
  const { language } = usePreferences();
  const t: Record<string, string> = useCoreLabels(language);
  const bahteraLinks = getBahteraLinks(t);
  return (
    <section className="kh-baht" id="menghubungkan" aria-labelledby="kh-baht-title">
      <div className="kh-baht-bg" aria-hidden="true">
        <ImageSlot
          src="/images/jembatan-bahteramas.jpg"
          alt=""
          imgAltHidden
          fallbackClass="kh-fb-bahteramas"
        />
      </div>
      <div className="kh-baht-veil" aria-hidden="true" />
      <div className="kh-wrap">
        <div className="kh-baht-grid">
          <div>
            <WcReveal>
              <div className="kh-label">{t.navConnecting}</div>
            </WcReveal>
            <WcReveal delay={1}>
              <h2 className="kh-h2" id="kh-baht-title">
                {t.bahtTitleA}
                <br />
                <span className="kh-gold">{t.bahtTitleB}</span>
              </h2>
            </WcReveal>
            <WcReveal delay={2}>
              <p className="kh-desc">
                {t.bahtDesc}
              </p>
            </WcReveal>
            <div className="kh-baht-feats">
              {bahteraLinks.map((f, i) => (
                <WcReveal key={f.title} delay={(i % 3) as 0 | 1 | 2}>
                  <Link href={f.href} className="kh-baht-feat">
                    <span>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </span>
                  </Link>
                </WcReveal>
              ))}
            </div>
          </div>
          <WcReveal delay={1}>
            <div className="kh-baht-visual">
              <ImageSlot
                src="/images/jembatan-bahteramas-2.jpg"
                alt={t.bahtBridgeAlt}
                fallbackClass="kh-fb-bahteramas"
              />
            </div>
          </WcReveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Komunitas — foto warga + aksen Tugu MTQ (slot, fallback bila kosong).*/
/* ------------------------------------------------------------------ */
const getKomCards = (t: Record<string, string>) => [
  { src: '/images/komunitas-1.jpg', alt: t.kom1Alt, tag: t.kom1Tag, title: t.kom1Title, desc: t.kom1Desc },
  { src: '/images/komunitas-2.jpg', alt: t.kom2Alt, tag: t.kom2Tag, title: t.kom2Title, desc: t.kom2Desc },
  { src: '/images/komunitas-3.jpg', alt: t.kom3Alt, tag: t.kom3Tag, title: t.kom3Title, desc: t.kom3Desc },
];

export function KendariKomunitas() {
  const { language } = usePreferences();
  const t: Record<string, string> = useCoreLabels(language);
  const komCards = getKomCards(t);
  return (
    <section className="kh-section kh-kom" id="komunitas" aria-labelledby="kh-kom-title">
      <div className="kh-tugu" aria-hidden="true">
        <ImageSlot
          src="/images/tugu-mtq.jpg"
          alt=""
          imgAltHidden
          fallbackClass="kh-fb-tugu"
        />
      </div>
      <div className="kh-wrap">
        <WcReveal>
          <div className="kh-label">{t.groups}</div>
        </WcReveal>
        <WcReveal delay={1}>
          <h2 className="kh-h2" id="kh-kom-title">
            {t.komTitleA}
            <br />
            <span className="kh-gold">{t.komTitleB}</span>
          </h2>
        </WcReveal>
        <WcReveal delay={2}>
          <p className="kh-desc">
            {t.komDesc}
          </p>
        </WcReveal>
        <div className="kh-kom-grid">
          {komCards.map((c, i) => (
            <WcReveal key={c.title} delay={(i % 3) as 0 | 1 | 2}>
              <article className="kh-kom-card">
                <div className="kh-kom-media">
                  <ImageSlot
                    src={c.src}
                    alt={c.alt}
                    fallbackClass="kh-fb-komunitas"
                  />
                  <div className="kh-kom-shade" aria-hidden="true" />
                </div>
                <div className="kh-kom-body">
                  <span className="kh-kom-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </article>
            </WcReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
