'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Check, MessageCircle, ShieldCheck } from 'lucide-react';
import {
  CARE_PLAN,
  MARKET_ANCHOR,
  PRICE_SENTENCE,
  RISK_REDUCERS,
  STUDIO_HREF,
  TIERS,
  WA_MESSAGES,
  type Currency,
} from '@/lib/homepage/content';
import { sukiWaLink } from '@/lib/whatsapp';
import { trackHome } from '@/lib/homepage/track';

const TABS: Array<{ id: Currency; label: string; sub: string }> = [
  { id: 'idr', label: 'Rupiah', sub: 'Indonesia' },
  { id: 'usd', label: 'Dolar', sub: 'Internasional' },
];

/** Tahap 3 corong — KEINGINAN: satu cerita harga, dua mata uang, pengurang risiko. */
export function PricingStory() {
  const [currency, setCurrency] = useState<Currency>('idr');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(next: Currency, focus = false) {
    if (next === currency) return;
    setCurrency(next);
    trackHome('price_tab_switch', { currency: next });
    if (focus) tabRefs.current[TABS.findIndex((t) => t.id === next)]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    select(currency === 'idr' ? 'usd' : 'idr', true);
  }

  return (
    <section id="harga" className="hm-section hm-section--tint" aria-labelledby="hm-price-title">
      <div className="hm-wrap">
        <header className="hm-section-head hm-reveal">
          <p className="hm-eyebrow">Harga Suki Studio Web</p>
          <h2 id="hm-price-title" className="hm-h2">Satu harga. Dua mata uang.</h2>
          <p className="hm-section-lead">{PRICE_SENTENCE}</p>
        </header>

        <div className="hm-tabs hm-reveal" role="tablist" aria-label="Pilih mata uang" onKeyDown={onKeyDown}>
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`hm-tab-${tab.id}`}
              aria-selected={currency === tab.id}
              aria-controls="hm-price-panel"
              tabIndex={currency === tab.id ? 0 : -1}
              className="hm-tab"
              onClick={() => select(tab.id)}
            >
              {tab.label} <small>{tab.sub}</small>
            </button>
          ))}
        </div>

        <div id="hm-price-panel" role="tabpanel" aria-labelledby={`hm-tab-${currency}`} className="hm-price-panel">
          <ul className="hm-tiers">
            {TIERS.map((tier, index) => {
              const price = tier.price[currency];
              const wa = sukiWaLink(WA_MESSAGES.tier(tier.name, price));
              return (
                <li key={tier.id} className="hm-tier hm-reveal" style={{ '--i': index } as React.CSSProperties}>
                  <h3 className="hm-h3">{tier.name}</h3>
                  <p className="hm-tier-price" aria-live="polite">
                    <strong>{price}</strong>
                    <span className="hm-tier-alt">
                      = {tier.price[currency === 'idr' ? 'usd' : 'idr']}
                    </span>
                  </p>
                  <p className="hm-tier-meta">{tier.meta}</p>
                  <ul className="hm-checks">
                    {tier.features.map((feature) => (
                      <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>
                    ))}
                  </ul>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hm-btn hm-btn--outline hm-tier-cta"
                      data-track="cta_whatsapp"
                      data-track-placement="pricing"
                      data-track-tier={tier.id}
                      data-track-currency={currency}
                    >
                      <MessageCircle size={18} aria-hidden="true" /> Konsultasi paket ini
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hm-care hm-reveal">
            <div>
              <h3 className="hm-h3">{CARE_PLAN.name}</h3>
              <p className="hm-tier-price">
                <strong>{CARE_PLAN.price}</strong><span>{CARE_PLAN.period}</span>
              </p>
              <p className="hm-tier-meta">
                {CARE_PLAN.footnote}
                {currency === 'idr' && <> {CARE_PLAN.idrNote}</>}
              </p>
            </div>
            <ul className="hm-checks hm-checks--inline">
              {CARE_PLAN.features.map((feature) => (
                <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="hm-risk hm-reveal" aria-label="Kenapa aman memesan">
          {RISK_REDUCERS.map((item) => (
            <li key={item.title}>
              <ShieldCheck size={20} aria-hidden="true" />
              <span><strong>{item.title}</strong>{item.text}</span>
            </li>
          ))}
        </ul>

        <div className="hm-anchor hm-reveal">
          <table>
            <caption>Biaya proyek awal di pasar vs Suki Studio</caption>
            <tbody>
              {MARKET_ANCHOR.rows.map((row) => (
                <tr key={row.label} className={row.ours ? 'is-ours' : undefined}>
                  <th scope="row">{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hm-fineprint">{MARKET_ANCHOR.source}</p>
          <p className="hm-fineprint">
            Klien internasional? Detail lengkap dalam bahasa Inggris di{' '}
            <Link href={STUDIO_HREF} hrefLang="en" className="hm-link">Suki Studio (English)</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
