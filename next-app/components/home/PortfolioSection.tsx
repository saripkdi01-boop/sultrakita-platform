'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Globe } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import './portfolio-section.css';

/**
 * PortfolioSection — portofolio Web Studio di homepage.
 * Menampilkan website klien yang real & live (bukan mockup).
 * Bahasa: Indonesia sumber kebenaran, Inggris diterjemahkan, sisanya fallback ID.
 */

const FALLBACK: Record<string, string> = {
  pfKicker: 'Portofolio Web Studio',
  pfTitle: 'Website yang sudah kami buatkan',
  pfSub: 'Contoh nyata hasil kerja SUKI Web Studio — website live yang bisa langsung dibuka, bukan mockup.',
  pfBadge: 'Klien #1',
  pfName: 'Senten Febrari Kadir Massa',
  pfRole: 'Agen Properti — Kendari, Sulawesi Tenggara',
  pfDesc:
    'Website personal agen properti: personal branding, katalog 2 perumahan (Bumi Samarkand & Villa Madinah Land), simulasi KPR, dan tombol WhatsApp untuk cek kelayakan.',
  pfFeat1: 'Katalog properti',
  pfFeat2: 'Simulasi KPR',
  pfFeat3: 'CTA WhatsApp',
  pfFeat4: 'SEO lokal',
  pfVisit: 'Kunjungi Website Live',
  pfCtaText: 'Mau website seperti ini untuk bisnis Anda?',
  pfCtaBtn: 'Konsultasi Gratis',
  pfImgAlt: 'Tampilan website personal agen properti Senten Febrari Kadir Massa',
};

const SITE_URL = 'https://senchen.vercel.app/';

export default function PortfolioSection() {
  const { language } = usePreferences();
  const t: Record<string, string> = getCoreLabels(language);
  const tx = (k: string) => t[k] ?? FALLBACK[k] ?? k;

  return (
    <section className="pf-section" aria-labelledby="pf-title">
      <div className="pf-inner">
        <p className="pf-kicker">{tx('pfKicker')}</p>
        <h2 id="pf-title" className="pf-title">
          {tx('pfTitle')}
        </h2>
        <p className="pf-sub">{tx('pfSub')}</p>

        <article className="pf-card">
          <a
            className="pf-shot"
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tx('pfVisit')} — ${tx('pfName')}`}
          >
            <Image
              src="/images/portfolio-senten.jpg"
              alt={tx('pfImgAlt')}
              width={1280}
              height={800}
              loading="lazy"
            />
            <span className="pf-shot-cta">
              <Globe size={15} aria-hidden="true" />
              {tx('pfVisit')}
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>
          <div className="pf-body">
            <span className="pf-badge">
              <BadgeCheck size={14} aria-hidden="true" />
              {tx('pfBadge')}
            </span>
            <h3 className="pf-name">{tx('pfName')}</h3>
            <p className="pf-role">{tx('pfRole')}</p>
            <p className="pf-desc">{tx('pfDesc')}</p>
            <ul className="pf-feats">
              {[tx('pfFeat1'), tx('pfFeat2'), tx('pfFeat3'), tx('pfFeat4')].map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="pf-cta">
          <p>{tx('pfCtaText')}</p>
          <Link href="/web-studio" className="pf-cta-btn">
            {tx('pfCtaBtn')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
