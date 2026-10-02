'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Newspaper, RefreshCw } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/news/sources';
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

function formatTime(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('id-ID', {
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
function CategoryBadge({ category }: { category: NewsCategory }) {
  return (
    <span className={styles.newsCategoryBadge} aria-label={`Kanal ${NEWS_CATEGORY_LABELS[category]}`}>
      {NEWS_CATEGORY_LABELS[category]}
    </span>
  );
}

/**
 * Thumbnail dari field feed (milik penerbit, CDN resmi mereka).
 * lazy + aspect-ratio fixed (zero CLS) + referrerPolicy no-referrer.
 * Gagal dimuat → badge kategori tetap tampil di placeholder, kartu text-first.
 */
function NewsThumb({ src, alt, category }: { src: string; alt: string; category: NewsCategory }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${styles.newsThumb} ${styles.newsThumbFallback}`}>
        <CategoryBadge category={category} />
      </div>
    );
  }
  return (
    <div className={styles.newsThumb}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      <CategoryBadge category={category} />
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
      setErrorMsg('Portal berita tidak dapat dimuat. Periksa koneksimu lalu coba lagi.');
    }
  }, []);

  useEffect(() => {
    void load(category);
  }, [category, load]);

  const items = data?.items ?? [];
  const comingSoon = data?.comingSoon === true;

  return (
    <section id="portal-berita" className={styles.newsSection} aria-labelledby="news-portal-title">
      <div className={styles.newsHead}>
        <div>
          <span className={styles.newsEyebrow}>
            <Newspaper size={13} aria-hidden="true" /> Portal Berita
          </span>
          <h2 id="news-portal-title">Kabar terkini dari media Indonesia</h2>
          <p>
            Ringkasan headline terbaru yang dikumpulkan otomatis dari media nasional.
            Klik untuk membaca artikel lengkap di situs penerbit aslinya.
          </p>
        </div>
        {data && !comingSoon && (
          <span className={styles.newsLive} title={`Diperbarui ${formatTime(data.fetchedAt)}${data.stale ? ' (cache)' : ''}`}>
            <span className={styles.newsLiveDot} aria-hidden="true" />
            {data.stale ? 'Cache' : 'Live'}
          </span>
        )}
      </div>

      <div className={styles.newsTabs} role="tablist" aria-label="Kategori berita">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={styles.newsTab}
            onClick={() => setCategory(cat)}
          >
            {NEWS_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div role="status" aria-label="Memuat berita">
          <div className={styles.newsGrid} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
          <span className="sr-only">Memuat berita terkini…</span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.newsState} role="alert">
          <strong>Berita tidak dapat dimuat.</strong>
          <p>{errorMsg}</p>
          <button type="button" className={styles.newsRetry} onClick={() => load(category)}>
            <RefreshCw size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Coba lagi
          </button>
        </div>
      )}

      {status === 'ready' && comingSoon && (
        <div className={styles.newsState} role="status">
          <strong>Kanal {NEWS_CATEGORY_LABELS[category]} segera hadir.</strong>
          <p>{data?.message || 'Kami sedang menyiapkan sumber berita terverifikasi untuk kanal ini.'}</p>
        </div>
      )}

      {status === 'ready' && !comingSoon && items.length === 0 && (
        <div className={styles.newsState} role="status">
          <strong>Belum ada berita saat ini.</strong>
          <p>Sumber berita tidak mengembalikan artikel baru. Coba lagi beberapa menit lagi.</p>
        </div>
      )}

      {status === 'ready' && !comingSoon && items.length > 0 && (
        <>
          <ul className={styles.newsGrid} aria-label={`Berita ${NEWS_CATEGORY_LABELS[category]}`}>
            {items.map((item, index) => (
              <Fragment key={item.id}>
                <li>
                  {/* data-category pakai kategori ASAL item (bukan tab) agar badge
                      berwarna benar saat tab "Semua" mencampur banyak kategori. */}
                  <article className={styles.newsCard} data-category={item.category}>
                    {item.image ? (
                      <NewsThumb src={item.image} alt={item.title} category={item.category} />
                    ) : (
                      <div className={`${styles.newsThumb} ${styles.newsThumbFallback} ${styles.newsThumbTextOnly}`}>
                        <CategoryBadge category={item.category} />
                      </div>
                    )}
                    <h3>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" title={`Baca di ${item.sourceName}`}>
                        {item.title}
                      </a>
                    </h3>
                    {item.excerpt && <p className={styles.newsExcerpt}>{item.excerpt}</p>}
                    <div className={styles.newsMeta}>
                      <span className={styles.newsSource}>{item.sourceName}</span>
                      {item.publishedAt && (
                        <time dateTime={item.publishedAt}>{formatTime(item.publishedAt)}</time>
                      )}
                    </div>
                    <a className={styles.newsReadMore} href={item.link} target="_blank" rel="noopener noreferrer">
                      Baca selengkapnya <ArrowUpRight size={13} aria-hidden="true" />
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
            Headline &amp; ringkasan milik masing-masing penerbit
            {data?.sources.map((s, i) => (
              <span key={s.id}>
                {i === 0 ? ': ' : ', '}
                <a href={s.siteUrl} target="_blank" rel="noopener noreferrer">{s.name}</a>
              </span>
            ))}
            . SUKI Apps menampilkan kutipan singkat + tautan ke artikel asli.
          </p>
        </>
      )}
    </section>
  );
}
