'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Flag, Globe2, Heart, Link2, MessageCircle, MoreHorizontal, Users } from 'lucide-react';
import { CommentThread } from './CommentThread';
import { reportPost, REPORT_REASON_LABELS, type ReportReason } from '@/lib/actions/reports';
import type { MutationResult } from '@/hooks/useInfiniteFeed';
import styles from './feed.module.css';

export type BerandaPostData = {
  id: string;
  userId?: string;
  author: string;
  authorUsername?: string;
  initials: string;
  avatarUrl?: string | null;
  createdAt?: string;
  time: string;
  location?: string;
  privacy?: 'public' | 'followers';
  mood?: string | null;
  taggedCount?: number;
  content: string;
  mediaUrl?: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video';
  likes: number;
  comments: number;
  liked?: boolean;
  followingAuthor?: boolean;
};

export type FeedCardActions = {
  toggleLike: (postId: string) => Promise<MutationResult>;
  toggleSave: (postId: string) => Promise<MutationResult & { saved?: boolean }>;
  toggleFollow: (userId: string) => Promise<MutationResult & { following?: boolean }>;
  bumpComments: (postId: string, delta: 1) => void;
};

type Props = {
  post: BerandaPostData;
  currentUserId?: string | null;
  saved: boolean;
  actions: FeedCardActions;
  onNotice: (message: string) => void;
};

// Linkify sederhana & aman: URL http(s) jadi <a>, sisanya teks biasa.
// Tidak memakai dangerouslySetInnerHTML sehingga tidak ada injeksi HTML.
const URL_FIND = /(https?:\/\/[^\s<>"')\]]+)/g;
const URL_TEST = /^https?:\/\/[^\s<>"')\]]+$/;
function linkify(text: string) {
  const parts = text.split(URL_FIND);
  return parts.map((part, index) => {
    if (!URL_TEST.test(part)) return <span key={index}>{part}</span>;
    const trimmed = part.replace(/[.,!?:;)\]]+$/, '');
    const trail = part.slice(trimmed.length);
    return (
      <span key={index}>
        <a href={trimmed} target="_blank" rel="noopener noreferrer nofollow">{trimmed}</a>
        {trail}
      </span>
    );
  });
}

function MediaGallery({ post }: { post: BerandaPostData }) {
  const media = post.mediaUrls?.length ? post.mediaUrls : post.mediaUrl ? [post.mediaUrl] : [];
  if (!media.length) return null;
  if (post.mediaType === 'video') return <ViewportVideo src={media[0]} caption={`Video dari ${post.author}`} />;
  const shown = media.slice(0, 4);
  const extra = media.length - shown.length;
  const variant = styles[`media${shown.length}` as 'media1' | 'media2' | 'media3' | 'media4'];
  return (
    <div className={`${styles.mediaGrid} ${variant}`} role="group" aria-label={`${media.length} media dari ${post.author}`}>
      {shown.map((src, index) => (
        <button
          type="button"
          key={`${src}-${index}`}
          className={styles.mediaItem}
          onClick={() => window.open(src, '_blank', 'noopener,noreferrer')}
          aria-label={`Buka foto ${index + 1} dari ${post.author}`}
        >
          <img src={src} alt={`Media ${index + 1} dari ${post.author}`} loading="lazy" decoding="async" />
          {index === shown.length - 1 && extra > 0 && <span className={styles.mediaMore} aria-hidden="true">+{extra}</span>}
        </button>
      ))}
    </div>
  );
}

function ViewportVideo({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: [0, 0.6] },
    );
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);
  return (
    <figure className={styles.videoWrap}>
      <video ref={ref} controls playsInline muted loop preload="metadata" poster={`${src}#t=0.1`} aria-label={caption}>
        <source src={src} type="video/mp4" />
        Browser Anda tidak mendukung video.
      </video>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

function loginOrGeneric(code: string | undefined, loginMessage: string, genericMessage: string) {
  return code === 'UNAUTHORIZED' ? loginMessage : genericMessage;
}

export function FeedPost({ post, currentUserId, saved, actions, onNotice }: Props) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [busy, setBusy] = useState<'like' | 'save' | 'follow' | 'report' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Ref fokus menu: kembalikan fokus ke pemicu saat Esc; pindahkan fokus saat
  // tampilan menu berubah (tombol sebelumnya ter-unmount agar fokus tak hilang).
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reportBtnRef = useRef<HTMLButtonElement>(null);
  const firstReasonRef = useRef<HTMLButtonElement>(null);
  const prevReportingRef = useRef(false);

  const liked = !!post.liked;
  const showFollow = !!currentUserId && !!post.userId && post.userId !== currentUserId;

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: PointerEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) { setMenuOpen(false); setReporting(false); } };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setReporting(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  // Saat beralih ke/dari mode lapor, tombol yang sedang fokus ter-unmount —
  // pindahkan fokus secara eksplisit agar tidak jatuh ke <body>.
  useEffect(() => {
    if (!menuOpen) { prevReportingRef.current = false; return; }
    const wasReporting = prevReportingRef.current;
    prevReportingRef.current = reporting;
    if (reporting && !wasReporting) firstReasonRef.current?.focus();
    else if (!reporting && wasReporting) reportBtnRef.current?.focus();
  }, [menuOpen, reporting]);

  async function handleLike() {
    if (busy) return;
    setBusy('like');
    try {
      const result = await actions.toggleLike(post.id);
      if (!result.ok) onNotice(loginOrGeneric(result.code, 'Silakan login untuk menyukai postingan.', 'Suka gagal disimpan. Coba lagi.'));
    } finally { setBusy(null); }
  }

  async function handleSave() {
    if (busy) return;
    setBusy('save');
    try {
      const result = await actions.toggleSave(post.id);
      if (!result.ok) {
        onNotice(
          result.code === 'SERVICE_UNAVAILABLE'
            ? 'Fitur simpan belum tersedia — pembaruan database tertunda. Coba lagi nanti.'
            : loginOrGeneric(result.code, 'Silakan login untuk menyimpan postingan.', 'Simpan gagal. Coba lagi.'),
        );
      } else {
        onNotice(result.saved ? 'Postingan disimpan.' : 'Postingan dihapus dari simpanan.');
      }
    } finally { setBusy(null); }
  }

  async function handleFollow() {
    if (busy || !post.userId) return;
    setBusy('follow');
    try {
      const result = await actions.toggleFollow(post.userId);
      if (!result.ok) onNotice(loginOrGeneric(result.code, 'Silakan login untuk mengikuti warga.', 'Ikuti gagal. Coba lagi.'));
    } finally { setBusy(null); }
  }

  async function copyLink() {
    const url = `${window.location.origin}/beranda`;
    try {
      await navigator.clipboard.writeText(url);
      onNotice('Tautan beranda disalin ke papan klip.');
    } catch {
      onNotice('Tautan tidak dapat disalin otomatis.');
    }
    setMenuOpen(false);
  }

  async function submitReport(reason: ReportReason) {
    setBusy('report');
    try {
      const result = await reportPost(post.id, reason);
      onNotice(result.message);
    } finally {
      setBusy(null);
      setMenuOpen(false);
      setReporting(false);
    }
  }

  async function share() {
    const url = `${window.location.origin}/beranda`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Postingan ${post.author} di SUKI`, text: post.content.slice(0, 120), url });
      } else {
        await navigator.clipboard.writeText(`${post.content}\n${url}`);
        onNotice('Tautan postingan disalin ke papan klip.');
      }
    } catch {
      /* pengguna membatalkan — diam */
    }
  }

  return (
    <article className={styles.postCard} aria-labelledby={`post-title-${post.id}`}>
      <header className={styles.postHeader}>
        <span className={styles.avatar} aria-hidden="true">
          {post.avatarUrl ? <img src={post.avatarUrl} alt="" loading="lazy" /> : post.initials}
        </span>
        <div className={styles.authorMeta}>
          <div className={styles.nameRow}>
            <span id={`post-title-${post.id}`} style={{ display: 'contents' }}>
              {post.authorUsername ? (
                <Link href={`/profile/${encodeURIComponent(post.authorUsername)}`} className={styles.authorName} aria-label={`Buka profil publik ${post.author}`}>
                  {post.author}
                </Link>
              ) : (
                <strong className={styles.authorName}>{post.author}</strong>
              )}
            </span>
            {showFollow && (
              <button
                type="button"
                className={`${styles.followBtn} ${post.followingAuthor ? styles.isFollowing : ''}`}
                aria-pressed={!!post.followingAuthor}
                aria-label={post.followingAuthor ? `Berhenti mengikuti ${post.author}` : `Ikuti ${post.author}`}
                onClick={() => void handleFollow()}
                disabled={busy === 'follow'}
              >
                {busy === 'follow' ? '…' : post.followingAuthor ? 'Mengikuti' : 'Ikuti'}
              </button>
            )}
          </div>
          <small className={styles.authorSub}>
            <span>{post.time}</span>
            {post.location ? <><span className={styles.dot} aria-hidden="true">·</span><span>{post.location}</span></> : null}
            {post.mood ? <><span className={styles.dot} aria-hidden="true">·</span><span>{post.mood}</span></> : null}
            {post.taggedCount ? <><span className={styles.dot} aria-hidden="true">·</span><span>{post.taggedCount} warga ditandai</span></> : null}
            <span className={styles.dot} aria-hidden="true">·</span>
            {post.privacy === 'followers'
              ? <><Users size={11} aria-hidden="true" /> Pengikut</>
              : <><Globe2 size={11} aria-hidden="true" /> Publik</>}
          </small>
        </div>
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            ref={triggerRef}
            className={styles.menuBtn}
            aria-label={`Opsi postingan dari ${post.author}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => { setMenuOpen((open) => !open); setReporting(false); }}
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className={styles.menuPop} role="menu" aria-label={`Opsi postingan dari ${post.author}`}>
              {!reporting ? (
                <>
                  <button type="button" className={styles.menuItem} role="menuitem" onClick={() => void copyLink()}>
                    <Link2 size={15} aria-hidden="true" /> Salin tautan
                  </button>
                  <button type="button" className={`${styles.menuItem} ${styles.danger}`} role="menuitem" ref={reportBtnRef} onClick={() => setReporting(true)}>
                    <Flag size={15} aria-hidden="true" /> Laporkan
                  </button>
                </>
              ) : (
                <div className={styles.reportBox}>
                  <p>Alasan laporan</p>
                  <div className={styles.reportReasons} role="group" aria-label="Pilih alasan laporan">
                    {(Object.keys(REPORT_REASON_LABELS) as ReportReason[]).map((reason, index) => (
                      <button
                        key={reason}
                        type="button"
                        className={styles.menuItem}
                        ref={index === 0 ? firstReasonRef : undefined}
                        disabled={busy === 'report'}
                        onClick={() => void submitReport(reason)}
                      >
                        {REPORT_REASON_LABELS[reason]}
                      </button>
                    ))}
                  </div>
                  <div className={styles.reportActions}>
                    <button type="button" className={styles.btnGhost} onClick={() => setReporting(false)}>Kembali</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {post.content ? <p className={styles.postContent}>{linkify(post.content)}</p> : null}
      <MediaGallery post={post} />

      <div className={styles.metaRow} aria-label="Ringkasan interaksi">
        <span className={styles.likes}>
          <Heart size={14} fill="currentColor" aria-hidden="true" /> {post.likes} suka
        </span>
        <button
          type="button"
          className={styles.replyBtn}
          onClick={() => setCommentsOpen((open) => !open)}
          aria-expanded={commentsOpen}
          aria-label={commentsOpen ? 'Tutup komentar' : `Lihat ${post.comments} komentar`}
        >
          {post.comments} komentar
        </button>
      </div>

      <div className={styles.actionRow} role="group" aria-label={`Aksi postingan dari ${post.author}`}>
        <button
          type="button"
          className={`${styles.actionBtn} ${liked ? styles.isActive : ''}`}
          aria-pressed={liked}
          aria-label={liked ? `Batal suka postingan dari ${post.author}` : `Sukai postingan dari ${post.author}`}
          onClick={() => void handleLike()}
          disabled={busy === 'like'}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
          <span>{liked ? 'Disukai' : 'Suka'}</span>
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setCommentsOpen((open) => !open)}
          aria-expanded={commentsOpen}
          aria-label={`Komentar pada postingan dari ${post.author}`}
        >
          <MessageCircle size={17} aria-hidden="true" />
          <span>Komentar</span>
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => void share()}
          aria-label={`Bagikan postingan dari ${post.author}`}
        >
          <Link2 size={17} aria-hidden="true" />
          <span>Bagikan</span>
        </button>
        <button
          type="button"
          className={`${styles.actionBtn} ${saved ? styles.isSaved : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Hapus postingan dari ${post.author} dari simpanan` : `Simpan postingan dari ${post.author}`}
          onClick={() => void handleSave()}
          disabled={busy === 'save'}
        >
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
          <span>{saved ? 'Tersimpan' : 'Simpan'}</span>
        </button>
      </div>

      {commentsOpen && (
        <CommentThread
          postId={post.id}
          postAuthor={post.author}
          onCountChange={(delta) => actions.bumpComments(post.id, delta)}
          onNotice={onNotice}
        />
      )}
    </article>
  );
}

/** Skeleton yang menyerupai PostCard untuk loading awal feed. */
export function FeedPostSkeleton() {
  return (
    <div className={styles.skCard} aria-hidden="true">
      <div className={styles.skRow}>
        <div className={`${styles.skAvatar} ${styles.shimmer}`} />
        <div className={styles.skCol}>
          <div className={`${styles.skLine} ${styles.shimmer}`} style={{ height: 14, width: '40%' }} />
          <div className={`${styles.skLine} ${styles.shimmer}`} style={{ height: 11, width: '60%' }} />
        </div>
      </div>
      <div className={`${styles.skLine} ${styles.shimmer}`} style={{ height: 13, width: '92%' }} />
      <div className={`${styles.skLine} ${styles.shimmer}`} style={{ height: 13, width: '70%' }} />
      <div className={`${styles.skMedia} ${styles.shimmer}`} />
      <div className={styles.skActions}>
        {[0, 1, 2, 3].map((index) => <div key={index} className={`${styles.skAction} ${styles.shimmer}`} />)}
      </div>
    </div>
  );
}
