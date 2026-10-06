'use client';

import { BookOpen, HelpCircle, Search, ShieldCheck, ShoppingBag, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArticleCard } from '@/components/support/SupportComponents';
import { getHelpArticles } from '@/lib/actions/support';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export default function HelpCenterPage() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [articles, setArticles] = useState<any[]>([]);

  const categories = [
    ['umum', t.helpCatGeneral, HelpCircle],
    ['marketplace', t.helpCatMarketplace, ShoppingBag],
    ['suki_suits', t.helpCatSuits, BookOpen],
    ['chat', t.helpCatChat, Video],
    ['payment', t.helpCatPayment, ShoppingBag],
    ['security', t.helpCatSecurity, ShieldCheck],
  ] as const;

  useEffect(() => {
    const timer = setTimeout(() => {
      getHelpArticles(query, category).then(response => { if (response.ok) setArticles(response.data); });
    }, 250);
    return () => clearTimeout(timer);
  }, [query, category]);

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-6xl">
        <header className="rounded-3xl bg-gradient-to-br from-sultra-forest to-sultra-teal p-7 text-white md:p-10">
          <span className="eyebrow text-sultra-sand"><HelpCircle size={14} /> {t.helpEyebrow}</span>
          <h1 className="mt-3 font-serif text-4xl font-bold">{t.helpTitle}</h1>
          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl bg-white px-4 py-3">
            <Search size={20} className="text-gray-400" />
            <input value={query} onChange={event => setQuery(event.target.value)} className="w-full bg-transparent text-gray-800 outline-none" placeholder={t.helpSearchPlaceholder} aria-label={t.helpSearchPlaceholder} />
          </div>
        </header>
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map(([value, label, Icon]) => (
            <button key={value} onClick={() => setCategory(category === value ? '' : value)} className={`rounded-2xl border p-4 text-left transition ${category === value ? 'border-sultra-teal bg-sultra-mint' : 'border-sultra-mint bg-white dark:bg-sultra-dark'}`}>
              <Icon className="text-sultra-teal" size={23} />
              <p className="mt-2 font-semibold">{label}</p>
              <small className="text-gray-500">{t.helpCatDesc}</small>
            </button>
          ))}
        </div>
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{t.helpPopular}</h2>
            <Link href="/support" className="text-sm font-semibold text-sultra-teal">{t.helpContactSupport}</Link>
          </div>
          {articles.length ? (
            <div className="grid gap-3 md:grid-cols-2">{articles.map(article => <ArticleCard key={article.id} article={article} />)}</div>
          ) : (
            <div className="rounded-2xl border border-dashed border-sultra-mint p-10 text-center text-gray-500">{t.helpNoArticles}</div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
