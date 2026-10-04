'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Newspaper, RefreshCw } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';
import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/news/sources';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews, timeLocale } from '@/lib/i18n/dict-chatnews';
import styles from './news.module.css';

interface ApiNewsItem {
  id: string;
  title: string;
  link: string;
  excerpt: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string | null;
  /** URL gambar dari field feed (enclosure/media:*), null bila tidak ada. */
  image: string | null;
  /** Kategori kanal asal item — untuk badge saat tab "Semua". */
  category: Exclude<NewsCategory, 'semua' | 'komunitas'>;
}

interface ApiNewsSource {
  id: string;
  name: string;
  siteUrl: string;
}

interface ApiResponse {
  ok: boolean;
  category: NewsCategory;
  categoryLabel: string;
  items: ApiNewsItem[];
  sources: ApiNewsSource[];
  stale: boolean;
  fetchedAt: string;
  comingSoon?: boolean;
  message?: string;
}

type Status = 'loading' | 'ready' | 'error';

function formatTime(iso: string | null, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function NewsSkeleton() {
  return (
    <div className={styles.newsSkeleton} aria-hidden="true">
      <div className={styles.newsShimmer} style={{ width: '40%', height: 14 }} />
      <div className={styles.newsShimmer} style={{ height: 18 }} />
      <div className={styles.newsShimmer} style={{ height: 18, width: '85%' }} />
      <div className={styles.newsShimmer} style={{ height: 12, width: '60%' }} />
    </div>
  );
}

/**
 * Badge label kategori kanal — overlay di kiri atas thumbnail (posisi ideal:
 * titik baca pertama LTR, pola standar portal berita Indonesia).
 * Warna gradien per kategori via [data-category] di kartu induk.
 */
/** Kunci label kategori → diterjemahkan per bahasa via dictChatNews. */
const NEWS_CAT_KEYS: Record<NewsCategory, string> = {
  semua: 'newsCatSemua',
  teknologi: 'newsCatTeknologi',
  umum: 'newsCatUmum',
  politik: 'newsCatPolitik',
  global: 'newsCatGlobal',
  riset: 'newsCatRiset',
  komunitas: 'newsCatKomunitas',
};

function CategoryBadge({ category, t }: { category: NewsCategory; t: Record<string, string> }) {
  const label = t[NEWS_CAT_KEYS[category]] ?? category;
  return (
    <span className={styles.newsCategoryBadge} aria-label={`${t.newsChannel} ${label}`}>
      {label}
    </span>
  );
}

/**
 * Thumbnail dari field feed (milik penerbit, CDN resmi mereka).
 * lazy + aspect-ratio fixed (zero CLS) + referrerPolicy no-referrer.
 * Gagal dimuat → badge kategori tetap tampil di placeholder, kartu text-first.
 */
function NewsThumb({ src, alt, category, t }: { src: string; alt: string; category: NewsCategory; t: Record<string, string> }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${styles.newsThumb} ${styles.newsThumbFallback}`}>
        <CategoryBadge category={category} t={t} />
      </div>
    );
  }
  return (
    <div className={styles.newsThumb}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      <CategoryBadge category={category} t={t} />
    </div>
  );
}

/**
 * T-NEWS · Section "Portal Berita" di /beranda.
 * Agregasi headline dari media Indonesia (server-side RSS).
 * Kartu bergambar bila feed menyediakan <enclosure>/<media:*> —
 * gambar milik penerbit dari CDN resmi mereka; fallback text-first.
 * Slot iklan native tiap 6 kartu memakai infra AdSlot (house ads / AdSense-ready).
 */
export function NewsPortal() {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  const locale = timeLocale(language);
  const [category, setCategory] = useState<NewsCategory>('semua');
  const [status, setStatus] = useState<Status>('loading');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const load = useCallback(async (cat: NewsCategory) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`/api/news?category=${encodeURIComponent(cat)}`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResponse;
      if (!json?.ok) throw new Error('Respons tidak valid.');
      setData(json);
      setStatus('ready');
    } catch {
      setStatus('error');
      setErrorMsg(t.newsLoadError);
    }
  }, [t]);

  useEffect(() => {
    void load(category);
  }, [category, load]);

  const items = data?.items ?? [];
  const comingSoon = data?.comingSoon === true;
  const catLabel = (cat: NewsCategory) => t[NEWS_CAT_KEYS[cat]] ?? cat;

  return (
    <section id="portal-berita" className={styles.newsSection} aria-labelledby="news-portal-title">
      <div className={styles.newsHead}>
        <div>
          <span className={styles.newsEyebrow}>
            <Newspaper size={13} aria-hidden="true" /> {t.newsPortal}
          </span>
          <h2 id="news-portal-title">{t.newsLatestFromMedia}</h2>
          <p>
            {t.newsPortalDesc}
          </p>
        </div>
        {data && !comingSoon && (
          <span className={styles.newsLive} title={`${t.newsUpdated} ${formatTime(data.fetchedAt, locale)}${data.stale ? ' (cache)' : ''}`}>
            <span className={styles.newsLiveDot} aria-hidden="true" />
            {data.stale ? t.newsCache : t.newsLive}
          </span>
        )}
      </div>

      <div className={styles.newsTabs} role="tablist" aria-label={t.newsCategoryAria}>
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={styles.newsTab}
            onClick={() => setCategory(cat)}
          >
            {catLabel(cat)}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div role="status" aria-label={t.newsLoadingNews}>
          <div className={styles.newsGrid} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
          <span className="sr-only">{t.newsLoadingLatest}</span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.newsState} role="alert">
          <strong>{t.newsErrorTitle}</strong>
          <p>{errorMsg}</p>
          <button type="button" className={styles.newsRetry} onClick={() => load(category)}>
            <RefreshCw size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
            {t.uiTryAgain}
          </button>
        </div>
      )}

      {status === 'ready' && comingSoon && (
        <div className={styles.newsState} role="status">
          <strong>{t.newsChannelComingSoon.replace('{category}', catLabel(category))}</strong>
          <p>{data?.message || t.newsComingSoonDefault}</p>
        </div>
      )}

      {status === 'ready' && !comingSoon && items.length === 0 && (
        <div className={styles.newsState} role="status">
          <strong>{t.newsEmpty}</strong>
          <p>{t.newsEmptyDesc}</p>
        </div>
      )}

      {status === 'ready' && !comingSoon && items.length > 0 && (
        <>
          <ul className={styles.newsGrid} aria-label={`${t.newsPortal} ${catLabel(category)}`}>
            {items.map((item, index) => (
              <Fragment key={item.id}>
                <li>
                  {/* data-category pakai kategori ASAL item (bukan tab) agar badge
                      berwarna benar saat tab "Semua" mencampur banyak kategori. */}
                  <article className={styles.newsCard} data-category={item.category}>
                    {item.image ? (
                      <NewsThumb src={item.image} alt={item.title} category={item.category} t={t} />
                    ) : (
                      <div className={`${styles.newsThumb} ${styles.newsThumbFallback} ${styles.newsThumbTextOnly}`}>
                        <CategoryBadge category={item.category} t={t} />
                      </div>
                    )}
                    <h3>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" title={t.newsReadOn.replace('{source}', item.sourceName)}>
                        {item.title}
                      </a>
                    </h3>
                    {item.excerpt && <p className={styles.newsExcerpt}>{item.excerpt}</p>}
                    <div className={styles.newsMeta}>
                      <span className={styles.newsSource}>{item.sourceName}</span>
                      {item.publishedAt && (
                        <time dateTime={item.publishedAt}>{formatTime(item.publishedAt, locale)}</time>
                      )}
                    </div>
                    <a className={styles.newsReadMore} href={item.link} target="_blank" rel="noopener noreferrer">
                      {t.newsReadMore} <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  </article>
                </li>
                {/* T-NEWS-ADS: slot iklan native tiap 6 kartu berita (li tersendiri agar span penuh grid). */}
                {(index + 1) % 6 === 0 && (
                  <li className={styles.newsAdSlot}>
                    <AdSlot placementId="news-infeed" />
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
          <p className={styles.newsFoot}>
            {t.newsFootPrefix}
            {data?.sources.map((s, i) => (
              <span key={s.id}>
                {i === 0 ? ': ' : ', '}
                <a href={s.siteUrl} target="_blank" rel="noopener noreferrer">{s.name}</a>
              </span>
            ))}
            . {t.newsFootSuffix}
          </p>
        </>
      )}
    </section>
  );
}
