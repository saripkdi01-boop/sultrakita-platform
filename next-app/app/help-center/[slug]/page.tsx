'use client';

import { ArrowLeft, ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getHelpArticle } from '@/lib/actions/support';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export default function HelpArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const [article, setArticle] = useState<any>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (slug) getHelpArticle(slug).then(response => { if (response.ok) setArticle(response.data); });
  }, [slug]);

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-3xl">
        <Link href="/help-center" className="mb-5 inline-flex items-center gap-2 text-sm text-sultra-teal">
          <ArrowLeft size={16} /> {t.helpBack}
        </Link>
        {!article ? (
          <div className="h-64 animate-pulse rounded-2xl bg-sultra-mint/60" />
        ) : (
          <article className="rounded-3xl border border-sultra-mint bg-white p-6 dark:bg-sultra-dark md:p-10">
            <span className="eyebrow text-sultra-teal">{article.category} · {article.views_count} {t.helpReadCount}</span>
            <h1 className="mt-3 font-serif text-4xl font-bold">{article.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{t.helpUpdated} {new Date(article.updated_at).toLocaleDateString(language === 'id' ? 'id-ID' : language)}</p>
            <div className="prose prose-sm mt-8 max-w-none whitespace-pre-wrap dark:prose-invert">{article.content}</div>
            <div className="mt-10 border-t border-sultra-mint pt-6 text-center">
              {voted ? (
                <p className="font-semibold text-sultra-teal">{t.helpThanks}</p>
              ) : (
                <>
                  <p className="font-semibold">{t.helpWasHelpful}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <button type="button" className="soft-btn" onClick={() => setVoted(true)}><ThumbsUp size={16} /> {t.helpYes}</button>
                    <button type="button" className="soft-btn" onClick={() => setVoted(true)}><ThumbsDown size={16} /> {t.helpNo}</button>
                  </div>
                </>
              )}
              <Link href="/support" className="mt-5 inline-block text-sm font-semibold text-sultra-teal">{t.helpStillNeed}</Link>
            </div>
          </article>
        )}
      </main>
    </AppLayout>
  );
}
