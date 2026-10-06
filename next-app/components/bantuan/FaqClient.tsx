'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

interface FaqItem {
  qKey: string;
  aKey: string;
}

interface FaqGroup {
  id: string;
  titleKey: string;
  items: FaqItem[];
}

// Semua jawaban di bawah ini merujuk pada fitur yang BENAR-BENAR ada di
// aplikasi (hasil audit kode 2026-10-02). Tidak ada klaim fiktif.
// Q&A dirender dari kamus i18n (dict-misc.ts) agar mengikuti bahasa aktif.
const GROUPS: FaqGroup[] = [
  {
    id: 'akun',
    titleKey: 'faqGroupAccount',
    items: [
      { qKey: 'faqQ1', aKey: 'faqA1' },
      { qKey: 'faqQ2', aKey: 'faqA2' },
      { qKey: 'faqQ3', aKey: 'faqA3' },
      { qKey: 'faqQ4', aKey: 'faqA4' },
    ],
  },
  {
    id: 'jual',
    titleKey: 'faqGroupSell',
    items: [
      { qKey: 'faqQ5', aKey: 'faqA5' },
      { qKey: 'faqQ6', aKey: 'faqA6' },
      { qKey: 'faqQ7', aKey: 'faqA7' },
      { qKey: 'faqQ8', aKey: 'faqA8' },
    ],
  },
  {
    id: 'beli-aman',
    titleKey: 'faqGroupBuy',
    items: [
      { qKey: 'faqQ9', aKey: 'faqA9' },
      { qKey: 'faqQ10', aKey: 'faqA10' },
      { qKey: 'faqQ11', aKey: 'faqA11' },
    ],
  },
  {
    id: 'properti',
    titleKey: 'faqGroupProperty',
    items: [
      { qKey: 'faqQ12', aKey: 'faqA12' },
      { qKey: 'faqQ13', aKey: 'faqA13' },
    ],
  },
  {
    id: 'privasi',
    titleKey: 'faqGroupPrivacy',
    items: [
      { qKey: 'faqQ14', aKey: 'faqA14' },
      { qKey: 'faqQ15', aKey: 'faqA15' },
      { qKey: 'faqQ16', aKey: 'faqA16' },
    ],
  },
];

function FaqAccordion({ group, t }: { group: FaqGroup; t: Record<string, string> }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section aria-labelledby={`${group.id}-heading`} className="mt-8">
      <h2 id={`${group.id}-heading`} className="text-lg font-extrabold tracking-tight">
        {t[group.titleKey]}
      </h2>
      <div className="mt-4 space-y-3">
        {group.items.map((item) => {
          const key = `${group.id}-${item.qKey}`;
          const isOpen = open === key;
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface)' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-bold sm:text-base">{t[item.qKey]}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', color: 'var(--sk-teal)' }}
                />
              </button>
              {isOpen && (
                <div
                  className="border-t px-5 py-4 text-sm leading-7"
                  style={{ borderColor: 'var(--sk-line)', color: 'var(--sk-ink-2)' }}
                >
                  {t[item.aKey]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FaqClient() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);

  // Render faqNoAnswerText dengan link yang disisipkan pada placeholder
  const noAnswerParts = t.faqNoAnswerText.split(/(\{helpCenter\}|\{reportIssue\}|\{contactUs\})/g);

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl" style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)' }}>
        <Link href="/help-center" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--sk-teal)' }}>
          <ArrowLeft size={16} /> {t.faqLinkHelpCenter}
        </Link>
        <header className="rounded-3xl p-7 sm:p-10" style={{ background: 'var(--sk-teal)', color: '#fff' }}>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase" style={{ letterSpacing: '.18em', color: 'var(--sk-brand)' }}>
            <HelpCircle size={14} /> {t.faqEyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.faqTitle}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'rgba(255,255,255,.85)' }}>
            {t.faqSubtitle}
          </p>
        </header>

        {GROUPS.map((group) => (
          <FaqAccordion key={group.id} group={group} t={t} />
        ))}

        <footer className="mb-10 mt-8 rounded-2xl border p-5 text-sm" style={{ borderColor: 'var(--sk-line)', background: 'var(--sk-surface-2)' }}>
          <p className="font-bold">{t.faqNoAnswer}</p>
          <p className="mt-1" style={{ color: 'var(--sk-muted)' }}>
            {noAnswerParts.map((part, i) => {
              if (part === '{helpCenter}') return <Link key={i} href="/help-center" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>{t.faqLinkHelpCenter}</Link>;
              if (part === '{reportIssue}') return <Link key={i} href="/support" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>{t.faqLinkReport}</Link>;
              if (part === '{contactUs}') return <Link key={i} href="/kontak" className="font-semibold hover:underline" style={{ color: 'var(--sk-teal)' }}>{t.faqLinkContact}</Link>;
              return <span key={i}>{part}</span>;
            })}
          </p>
        </footer>
      </main>
    </AppLayout>
  );
}
