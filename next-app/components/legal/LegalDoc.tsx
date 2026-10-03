'use client';

import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

// Shell bersama untuk dokumen legal SUKI Apps.
// Token design system --sk-*, tanpa klaim yang tidak didukung kode
// (tanpa alamat kantor/telepon fiktif). Chrome diterjemahkan via i18n;
// isi dokumen legal tetap Bahasa Indonesia (dokumen hukum).
export function LegalDoc({
  eyebrow,
  title,
  description,
  effectiveDate,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);

  const questionsParts = t.legalQuestionsText.split(/(\{contact\}|\{faq\})/g);

  return (
    <AppLayout>
      <main
        className="platform-shell mx-auto max-w-3xl"
        style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)' }}
      >
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--sk-teal)' }}
        >
          <ArrowLeft size={16} /> {t.legalBack}
        </Link>

        <header
          className="rounded-3xl p-7 sm:p-10"
          style={{ background: 'var(--sk-teal)', color: '#fff' }}
        >
          <p
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase"
            style={{ letterSpacing: '.18em', color: 'var(--sk-brand)' }}
          >
            <Scale size={14} /> {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'rgba(255,255,255,.85)' }}>
            {description}
          </p>
          <p className="mt-4 text-xs font-semibold" style={{ color: 'rgba(255,255,255,.7)' }}>
            {t.legalEffective} {effectiveDate}
          </p>
        </header>

        <nav
          aria-label={t.legalTocAria}
          className="mt-6 rounded-2xl border p-5"
          style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface)' }}
        >
          <p className="text-xs font-extrabold uppercase" style={{ letterSpacing: '.14em', color: 'var(--sk-muted)' }}>
            {t.legalToc}
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-6 space-y-6 pb-10">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl border p-6 sm:p-7"
              style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface)' }}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="text-lg font-extrabold tracking-tight"
                style={{ color: 'var(--sk-ink)' }}
              >
                <span style={{ color: 'var(--sk-teal)' }}>{index + 1}.</span> {section.title}
              </h2>
              <div className="legal-body mt-4 text-sm leading-7" style={{ color: 'var(--sk-ink-2)' }}>
                {section.body}
              </div>
            </section>
          ))}
        </article>

        <footer
          className="mb-10 rounded-2xl border p-5 text-sm"
          style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface-2)' }}
        >
          <p className="font-bold">{t.legalQuestions}</p>
          <p className="mt-1" style={{ color: 'var(--sk-muted)' }}>
            {questionsParts.map((part, i) => {
              if (part === '{contact}') return <Link key={i} href="/kontak" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>{t.legalLinkContact}</Link>;
              if (part === '{faq}') return <Link key={i} href="/bantuan/faq" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>{t.legalLinkFaq}</Link>;
              return <span key={i}>{part}</span>;
            })}
          </p>
        </footer>
      </main>
    </AppLayout>
  );
}

// Paragraf & daftar dengan gaya konsisten untuk isi dokumen legal.
export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 first:mt-0">{children}</p>;
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-2 pl-5 first:mt-0">{children}</ul>;
}
