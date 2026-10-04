'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Handshake,
  Layers3,
  MapPin,
  MessageCircle,
  MoveUpRight,
  Store,
  UsersRound,
} from 'lucide-react';
import BusinessNav from './_components/BusinessNav';
import { BUSINESS_CATEGORIES } from '@/lib/business-categories';
import type { PublicBusiness } from '@/lib/businesses-query';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
}

function BusinessCard({ business }: { business: PublicBusiness }) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  const initial = (business.name || '?').trim().charAt(0).toUpperCase();
  const meta = [categoryLabel(business.category), business.city].filter(Boolean).join(' · ');
  return (
    <article className="suki-business-card">
      <Link
        href={`/Business/${business.slug}`}
        className="suki-business-card-link"
        aria-label={b.bLandFeatViewProfile.replace('{name}', business.name)}
      >
        <span className="suki-business-card-initial" aria-hidden="true">
          {initial}
        </span>
        <span className="suki-business-card-body">
          <strong className="suki-business-card-name">{business.name}</strong>
          {meta && <span className="suki-business-card-meta">{meta}</span>}
          {business.is_verified && (
            <span className="suki-business-badge-verified">
              <BadgeCheck size={13} aria-hidden="true" /> {b.bLandFeatVerified}
            </span>
          )}
        </span>
      </Link>
    </article>
  );
}

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'SUKI Business',
        url: 'https://sukiapps.web.id/Business',
        parentOrganization: { '@type': 'Organization', name: 'SUKI Apps', url: 'https://sukiapps.web.id' },
      },
      {
        '@type': 'WebSite',
        name: 'SUKI Business',
        url: 'https://sukiapps.web.id/Business',
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sukiapps.web.id/Business/direktori?q={query}',
          'query-input': 'required name=query',
        },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function BusinessLandingClient({
  stats,
  featured,
}: {
  stats: { total: number; cities: number } | null;
  featured: PublicBusiness[];
}) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  const audiences = [
    { icon: Store, label: b.bLandAud1t, text: b.bLandAud1d, tone: 'mint' },
    { icon: Building2, label: b.bLandAud2t, text: b.bLandAud2d, tone: 'sand' },
    { icon: Handshake, label: b.bLandAud3t, text: b.bLandAud3d, tone: 'blue' },
  ];

  const capabilities = [
    { icon: Layers3, title: b.bLandCap1t, text: b.bLandCap1d },
    { icon: UsersRound, title: b.bLandCap2t, text: b.bLandCap2d },
    { icon: BarChart3, title: b.bLandCap3t, text: b.bLandCap3d },
  ];

  const plans = [
    { name: b.bLandPlan1n, description: b.bLandPlan1d, features: [b.bLandPlan1f1, b.bLandPlan1f2, b.bLandPlan1f3], featured: false },
    { name: b.bLandPlan2n, description: b.bLandPlan2d, features: [b.bLandPlan2f1, b.bLandPlan2f2, b.bLandPlan2f3], featured: true },
    { name: b.bLandPlan3n, description: b.bLandPlan3d, features: [b.bLandPlan3f1, b.bLandPlan3f2, b.bLandPlan3f3], featured: false },
  ];

  const faqs = [
    { q: b.bLandFaq1q, a: b.bLandFaq1a },
    { q: b.bLandFaq2q, a: b.bLandFaq2a },
    { q: b.bLandFaq3q, a: b.bLandFaq3a },
    { q: b.bLandFaq4q, a: b.bLandFaq4a },
    { q: b.bLandFaq5q, a: b.bLandFaq5a },
  ];

  return (
    <main className="suki-business-page">
      <JsonLd />
      <BusinessNav
        links={[
          { href: '/Business/direktori', label: b.bLandNavDir },
          { href: '#cara-kerja', label: b.bLandNavHow },
          { href: '#ruang-tumbuh', label: b.bLandNavGrow },
          { href: '#paket', label: b.bLandNavPlan },
        ]}
        actions={[{ href: '/login', label: b.bLandNavLogin }]}
        brandHref="/"
        brandAriaLabel={b.bNavBrandAria}
      />

      <section className="suki-business-hero">
        <div className="suki-business-hero-copy">
          <p className="suki-business-kicker"><span /> {b.bLandKicker}</p>
          <h1>{b.bLandHero1} <span className="wc-grad-text">{b.bLandHero2}</span></h1>
          <p className="suki-business-hero-text">{b.bLandHeroDesc}</p>
          <div className="suki-business-hero-actions">
            <Link href="/Business/daftar" className="suki-business-button suki-business-button-teal">{b.bLandCtaStart} <ArrowRight size={16} /></Link>
            <Link href="/Business/direktori" className="suki-business-text-link">{b.bLandCtaExplore} <MoveUpRight size={15} /></Link>
          </div>
          <div className="suki-business-trust-line"><BadgeCheck size={16} /> {b.bLandTrust}</div>
          {stats && (
            <p className="suki-business-stats">
              <strong>{Number(stats.total ?? 0).toLocaleString('id-ID')}</strong>
              &nbsp;{b.bLandStatsBiz} ·&nbsp;
              <strong>{Number(stats.cities ?? 0).toLocaleString('id-ID')}</strong>
              &nbsp;{b.bLandStatsCity}
            </p>
          )}
        </div>
        <div className="suki-business-hero-visual" aria-label={b.bLandPreviewTitle}>
          <div className="suki-business-orbit orbit-a" /><div className="suki-business-orbit orbit-b" />
          <div className="suki-business-preview">
            <div className="suki-business-preview-top"><span className="suki-business-preview-brand"><span className="suki-business-mini-mark"><img src="/suki-logo-mark.svg" alt="" width={24} height={24} /></span><b>{b.bLandPreviewTitle}</b></span><span className="suki-business-status"><i /> {b.bLandPreviewActive}</span></div>
            <div className="suki-business-preview-heading"><span>{b.bLandPreviewHead1}</span><strong>{b.bLandPreviewHead2}</strong></div>
            <div className="suki-business-preview-chart"><div className="suki-business-chart-label"><span>{b.bLandPreviewChart1}</span><b>{b.bLandPreviewChart2}</b></div><div className="suki-business-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="suki-business-preview-footer"><span><Store size={14} /> {b.bLandPreviewMkt}</span><span><UsersRound size={14} /> {b.bLandPreviewCom}</span><span><Handshake size={14} /> {b.bLandPreviewPartner}</span></div>
          </div>
          <div className="suki-business-float-card float-top"><CircleDollarSign size={16} /><span><b>{b.bLandFloat1t}</b><small>{b.bLandFloat1d}</small></span></div>
          <div className="suki-business-float-card float-bottom"><MapPin size={16} /><span><b>{b.bLandFloat2t}</b><small>{b.bLandFloat2d}</small></span></div>
        </div>
      </section>

      <div className="wc-tenun-strip" aria-hidden="true" />

      <section className="suki-business-audience" id="ruang-tumbuh">
        <div className="suki-business-section-head"><p className="suki-business-kicker">{b.bLandAudKicker}</p><h2>{b.bLandAudTitle}</h2><p>{b.bLandAudDesc}</p></div>
        <div className="suki-business-audience-grid">{audiences.map(({ icon: Icon, label, text, tone }) => <article className={`suki-business-audience-card tone-${tone}`} key={label}><span className="suki-business-icon"><Icon size={20} /></span><h3>{label}</h3><p>{text}</p><a href="#mulai">{b.bLandAudLink} <ArrowRight size={14} /></a></article>)}</div>
      </section>

      <section className="suki-business-featured" aria-labelledby="featured-heading">
        <div className="suki-business-section-head">
          <p className="suki-business-kicker">{b.bLandFeatKicker}</p>
          <h2 id="featured-heading">{b.bLandFeatTitle}</h2>
          <p>{b.bLandFeatDesc}</p>
        </div>
        {featured.length > 0 ? (
          <div className="suki-business-featured-grid">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p className="suki-business-empty">
            <strong>{b.bLandFeatEmptyT}</strong>
            {b.bLandFeatEmptyD}
          </p>
        )}
        <Link href="/Business/direktori" className="suki-business-text-link">
          {b.bLandCtaExplore} <ArrowRight size={15} />
        </Link>
      </section>

      <section className="suki-business-process" id="cara-kerja">
        <div className="suki-business-section-head"><p className="suki-business-kicker">{b.bLandHowKicker}</p><h2>{b.bLandHowTitle}</h2></div>
        <div className="suki-business-process-grid">
          <article><span>01</span><h3>{b.bLandHow1t}</h3><p>{b.bLandHow1d}</p></article>
          <article><span>02</span><h3>{b.bLandHow2t}</h3><p>{b.bLandHow2d}</p></article>
          <article><span>03</span><h3>{b.bLandHow3t}</h3><p>{b.bLandHow3d}</p></article>
        </div>
      </section>

      <section className="suki-business-capabilities"><div className="suki-business-capabilities-copy"><p className="suki-business-kicker">{b.bLandWhyKicker}</p><h2>{b.bLandWhyTitle}</h2><p>{b.bLandWhyDesc}</p><a href="#mulai" className="suki-business-text-link">{b.bLandWhyLink} <ArrowRight size={15} /></a></div><div className="suki-business-capability-list">{capabilities.map(({ icon: Icon, title, text }, index) => <article key={title}><span className="suki-business-capability-number">0{index + 1}</span><span className="suki-business-icon"><Icon size={18} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="suki-business-plans" id="paket"><div className="suki-business-section-head"><p className="suki-business-kicker">{b.bLandPlanKicker}</p><h2>{b.bLandPlanTitle}</h2><p>{b.bLandPlanDesc}</p></div><div className="suki-business-plan-grid">{plans.map((plan) => <article className={`suki-business-plan ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>{plan.featured && <span className="suki-business-plan-badge">{b.bLandPlanBadge}</span>}<h3>{plan.name}</h3><p>{plan.description}</p><div className="suki-business-plan-divider" />{plan.features.map((feature) => <span className="suki-business-plan-feature" key={feature}><Check size={14} /> {feature}</span>)}<a href="#mulai" className="suki-business-plan-link">{b.bLandPlanLink} <ArrowRight size={14} /></a></article>)}</div></section>

      <section className="suki-business-cta" id="mulai"><div><p className="suki-business-kicker">{b.bLandCtaKicker}</p><h2>{b.bLandCtaTitle}</h2><p>{b.bLandCtaDesc}</p></div><div className="suki-business-cta-actions"><Link href="/Business/daftar" className="suki-business-button suki-business-button-light">{b.bLandCtaReg} <ArrowRight size={16} /></Link><Link href="/Business/direktori" className="suki-business-cta-link">{b.bLandCtaExplore} <ArrowRight size={14} /></Link><Link href="/beranda" className="suki-business-cta-link">{b.bLandCtaBack} <ArrowRight size={14} /></Link></div></section>

      <section className="suki-business-faq"><div className="suki-business-section-head"><p className="suki-business-kicker">{b.bLandFaqKicker}</p><h2>{b.bLandFaqTitle}</h2></div><div className="suki-business-faq-list">{faqs.map(({ q, a }) => <details key={q}><summary>{q}<ChevronDown size={17} /></summary><p>{a}</p></details>)}</div></section>

      <footer className="suki-business-footer"><div className="suki-business-brand"><span className="suki-business-mark" aria-hidden="true"><img src="/suki-logo-mark.svg" alt="" width={36} height={36} /></span><span><strong>SUKI</strong><small>Business</small></span></div><p>{b.bLandFooterTag}</p><div className="suki-business-footer-links"><Link href="/">{b.bLandFooterApps}</Link><Link href="/beranda">{b.bLandFooterApp}</Link><Link href="/Business/direktori">{b.bLandFooterDir}</Link><Link href="/Business/daftar">{b.bLandFooterReg}</Link><Link href="/help-center">{b.bLandFooterGuide}</Link><Link href="/legal/privacy">{b.bLandFooterPrivacy}</Link></div><small className="suki-business-copyright">{b.bLandFooterCopy}</small></footer>
    </main>
  );
}
