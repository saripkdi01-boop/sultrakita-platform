'use client';

import './beranda-wc.css';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Compass, LoaderCircle, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost, FeedPostSkeleton } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import { AdSlot } from '@/components/ads/AdSlot';
import { PopupAd } from '@/components/ads/PopupAd';
import { NewsPortal } from '@/components/news/NewsPortal';
import { StoriesSection } from '@/components/beranda/StoriesSection';
import { useInfiniteFeed, type FeedTab } from '@/hooks/useInfiniteFeed';
import { supabase } from '@/lib/supabase/client';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getBerandaLabels, fmtLabel } from '@/lib/i18n/dict-beranda';
import styles from '@/components/beranda/feed.module.css';

// /beranda adalah feed sosial content-first: komposer + infinite scroll.
// Hero marketing, section explore/produk/event, dan baris kategori mati
// dihapus (2026-10-01) agar halaman menjadi jantung sosial, bukan landing page.
// Header "Cerita warga Sultra" + filter pil (2026-10-02) dihapus atas
// permintaan pemilik: feed langsung mengalir tanpa interupsi visual.
export default function BerandaPage() {
  // ?tab=saved (dari nav "Tersimpan") → tampilkan daftar simpanan, bukan feed.
  const [initialTab] = useState<FeedTab>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tab') === 'saved' ? 'saved' : 'feed',
  );
  const { tab, items, loading, error, hasNextPage, loadMore, reload, savedIds, toggleLike, toggleSave, toggleFollow, bumpComments } = useInfiniteFeed('recommended', initialTab);
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const b = getBerandaLabels(language);
  const isSavedTab = tab === 'saved';
  const [notice, setNotice] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'post' | 'reel'>('post');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  function openComposer(type: 'post' | 'reel' = 'post') { setComposerType(type); setComposerOpen(true); }
  useEffect(() => { const compose = new URLSearchParams(window.location.search).get('compose'); if (compose === 'post' || compose === 'reel') openComposer(compose); }, []);
  useEffect(() => { const node = sentinelRef.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { rootMargin: '480px' }); observer.observe(node); return () => observer.disconnect(); }, [loadMore]);

  // Id pengguna login (untuk tombol Ikuti & status milik sendiri). Anonim → null.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (active) setCurrentUserId(user?.id || null);
      } catch { /* abaikan — feed tetap publik */ }
    })();
    return () => { active = false; };
  }, []);

  const actions = { toggleLike, toggleSave, toggleFollow, bumpComments };

  return <AppLayout active="home" onCreate={openComposer}>
    <main className="beranda-v4-page">
      <div className="beranda-v4-container">
        <div className="beranda-v4-layout">
          <div className="beranda-v4-main">
            <StoriesSection onCreate={() => openComposer('post')} />
            <CreatePostInput onCreate={openComposer}/>
            {notice && <div className={`beranda-notice ${styles.noticeBar}`} role="status" aria-live="polite"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>{t.close}</button></div>}

            {isSavedTab && (
              <section className={styles.feedHead} aria-labelledby="feed-title">
                <div>
                  <h1 id="feed-title">{b.brSavedTitle}</h1>
                  <p>{b.brSavedDesc}</p>
                </div>
              </section>
            )}

            {error && (
              <div className={`${styles.feedState} ${styles.feedStateError}`} role="alert">
                <strong>{isSavedTab ? b.brFeedSavedError : b.brFeedError}</strong>
                <span>{error}</span>
                <button type="button" className={styles.btnGhost} onClick={reload}>
                  <RefreshCw size={14} aria-hidden="true" /> {b.brRetry}
                </button>
              </div>
            )}

            {!error && loading && items.length === 0 && (
              <div aria-label={b.brLoadingStories} role="status">
                <ul className={styles.feedList} aria-hidden="true">
                  {[0, 1, 2].map((index) => <li key={index}><FeedPostSkeleton /></li>)}
                </ul>
                <span className="sr-only">{b.brLoadingStories}</span>
              </div>
            )}

            {!error && !loading && items.length === 0 && (
              <div className={styles.feedState} role="status">
                {isSavedTab ? (
                  <>
                    <strong>{b.brSavedEmpty}</strong>
                    <span>{b.brSavedEmptyHint}</span>
                  </>
                ) : (
                  <>
                    <strong>{b.brFeedEmpty}</strong>
                    <span>{b.brFeedEmptyHint}</span>
                  </>
                )}
              </div>
            )}

            {items.length > 0 && (
              <ul className={styles.feedList} aria-label={isSavedTab ? b.brSavedListLabel : b.brFeedListLabel}>
                {items.map((post, index) => (
                  <Fragment key={post.id}>
                    <li>
                      <FeedPost
                        post={post}
                        currentUserId={currentUserId}
                        saved={savedIds.has(post.id)}
                        actions={actions}
                        onNotice={setNotice}
                      />
                    </li>
                    {/* T-ADS: iklan native tiap 8 postingan (~12,5% densitas). Tidak di tab Tersimpan. */}
                    {!isSavedTab && (index + 1) % 8 === 0 && (
                      <li>
                        <AdSlot placementId="feed-infeed" eager={index === 7} />
                      </li>
                    )}
                  </Fragment>
                ))}
              </ul>
            )}

            {loading && items.length > 0 && (
              <p className={styles.feedEnd} aria-live="polite">
                <LoaderCircle size={15} className="spin" aria-hidden="true" /> {b.brLoadingNext}
              </p>
            )}

            <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />
            {!hasNextPage && items.length > 0 && !loading && (
              <p className={styles.feedEnd}>{b.brFeedEnd}</p>
            )}
          </div>

          <aside className="beranda-v4-rail">
            <section className="beranda-v4-opportunity">
              <span className="beranda-v4-opportunity-icon"><Compass size={20} /></span>
              <span className="beranda-v4-eyebrow">{b.brOppEyebrow}</span>
              <h2>{b.brOppTitle}</h2>
              <p>{b.brOppDesc}</p>
              <a href="/jobs">{b.brOppCta} <ArrowRight size={15} /></a>
            </section>
            <section className="beranda-v4-trust">
              <span className="beranda-v4-eyebrow">{b.brTrustEyebrow}</span>
              <h2>{b.brTrustTitle}</h2>
              <p>{b.brTrustDesc}</p>
              <ul>
                <li><Check size={15} /> {b.brTrust1}</li>
                <li><Check size={15} /> {b.brTrust2}</li>
                <li><Check size={15} /> {b.brTrust3}</li>
              </ul>
            </section>
            <RightSidebar />
          </aside>
        </div>

        {/* T-NEWS: Portal Berita — gateway berita dalam ekosistem SUKI Apps,
            full-width di bawah layout feed. Hanya di tab feed (bukan Tersimpan). */}
        {!isSavedTab && <NewsPortal />}
      </div>
    </main>
    <CreatePostModal open={composerOpen} initialType={composerType} onClose={() => setComposerOpen(false)} onCreated={(message) => { setNotice(message); reload(); }} />
    {/* T-ADS popup: slot iklan interstitial beranda (beranda-popup). Nonaktif bila belum dikonfigurasi di /admin/ads. */}
    <PopupAd />
  </AppLayout>;
}
