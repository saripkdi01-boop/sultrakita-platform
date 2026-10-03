'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderCircle, RefreshCw, Send, X } from 'lucide-react';
import { ApiComment, getComments, postComment } from '@/lib/feed-interactions';
import { relativeTime } from '@/lib/format-time';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getBerandaLabels, fmtLabel } from '@/lib/i18n/dict-beranda';
import styles from './feed.module.css';

type Props = {
  postId: string;
  postAuthor: string;
  /** Dipanggil saat komentar berhasil ditambah (+1) agar hitungan kartu sinkron. */
  onCountChange?: (delta: 1) => void;
  onNotice?: (message: string) => void;
};

const PAGE_SIZE = 10;

function initialsOf(name: string) {
  return name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase() || '•';
}

export function CommentThread({ postId, postAuthor, onCountChange, onNotice }: Props) {
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const b = getBerandaLabels(language);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [sending, setSending] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const load = useCallback(async (nextCursor: string | null, append: boolean) => {
    if (append) setLoadingMore(true); else { setLoading(true); setError(null); }
    try {
      const payload = await getComments(postId, nextCursor, PAGE_SIZE);
      if (!mountedRef.current) return;
      setComments((current) => {
        const source = append ? [...current, ...payload.data] : payload.data;
        return Array.from(new Map(source.map((item) => [item.id, item])).values());
      });
      setCursor(payload.pageInfo.endCursor);
      setHasNextPage(payload.pageInfo.hasNextPage);
    } catch {
      // Gagal tambah halaman: biarkan daftar yang sudah ada + tombol "Muat lagi"
      // tetap bisa dicoba ulang. Gagal awal: tampilkan error + tombol coba lagi.
      if (mountedRef.current && !append) setError(b.brCommentsErr);
      if (mountedRef.current && append) onNotice?.(b.brCommentsMoreFail);
    } finally {
      if (mountedRef.current) { setLoading(false); setLoadingMore(false); }
    }
  }, [postId, onNotice, b.brCommentsErr, b.brCommentsMoreFail]);

  useEffect(() => { void load(null, false); }, [load]);

  async function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    if (content.length > 500) { onNotice?.(b.brCommentLong); return; }
    setSending(true);
    const tempId = `temp-${Date.now()}`;
    const replyName = replyTo?.name || null;
    const optimistic: ApiComment = {
      id: tempId, post_id: postId, user_id: 'me', content,
      parent_id: replyTo?.id || null, reply_to_name: replyName,
      created_at: new Date().toISOString(),
      profiles: { display_name: b.brYou },
    };
    setComments((current) => [optimistic, ...current]);
    setDraft(''); setReplyTo(null);
    try {
      const result = await postComment(postId, content, optimistic.parent_id);
      if (!mountedRef.current) return;
      setComments((current) => current.map((item) => (item.id === tempId ? { ...result.comment, reply_to_name: result.comment.reply_to_name ?? replyName } : item)));
      onCountChange?.(1);
    } catch (caught) {
      if (!mountedRef.current) return;
      setComments((current) => current.filter((item) => item.id !== tempId));
      const message = caught instanceof Error ? caught.message : b.brCommentFail;
      onNotice?.(message === 'Sesi login diperlukan.' ? b.brLoginComment : b.brCommentRetry);
    } finally {
      if (mountedRef.current) setSending(false);
    }
  }

  return <section className={styles.thread} aria-label={fmtLabel(b.brCommentsFor, { name: postAuthor })}>
    {loading ? (
      <p className={styles.threadEmpty} role="status"><LoaderCircle size={15} className="spin" aria-hidden="true" /> {b.brLoadingComments}</p>
    ) : error && comments.length === 0 ? (
      <p className={styles.threadError} role="alert">{error} <button type="button" onClick={() => void load(null, false)}><RefreshCw size={13} aria-hidden="true" /> {b.brRetry}</button></p>
    ) : (
      <>
        {comments.length === 0 && <p className={styles.threadEmpty}>{b.brCommentsEmpty}</p>}
        <ul className={styles.threadList}>
          {comments.map((comment) => {
            const name = comment.profiles?.username || comment.profiles?.display_name || b.brUserFallback;
            return <li key={comment.id} className={styles.commentItem}>
              <span className={styles.commentAvatar} aria-hidden="true">
                {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} alt="" loading="lazy" /> : initialsOf(name)}
              </span>
              <div className={styles.commentBody}>
                <div className={styles.commentHead}>
                  <span className={styles.commentAuthor}>{name}</span>
                  <span className={styles.commentTime}>{relativeTime(comment.created_at)}</span>
                  {comment.reply_to_name && <span className={styles.replyTo}>{fmtLabel(b.brReplyTo, { name: comment.reply_to_name })}</span>}
                </div>
                <p className={styles.commentText}>{comment.content}</p>
                <div className={styles.commentFoot}>
                  {!comment.parent_id && (
                    <button type="button" className={styles.replyBtn} onClick={() => setReplyTo({ id: comment.id, name })}>
                      {b.brReply}
                    </button>
                  )}
                </div>
              </div>
            </li>;
          })}
        </ul>
        {hasNextPage && comments.length > 0 && (
          <button type="button" className={styles.loadMoreBtn} onClick={() => void load(cursor, true)} disabled={loadingMore}>
            {loadingMore ? <LoaderCircle size={14} className="spin" aria-hidden="true" /> : null}
            {loadingMore ? b.brLoadingShort : b.brLoadMoreComments}
          </button>
        )}
      </>
    )}
    <form onSubmit={(event) => void submit(event)}>
      {replyTo && (
        <p className={styles.replyingTo}>
          {b.brReplyingTo} <strong>{replyTo.name}</strong>
          <button type="button" onClick={() => setReplyTo(null)} aria-label={b.brCancelReply}><X size={13} aria-hidden="true" /> {t.cancel}</button>
        </p>
      )}
      <div className={styles.composerRow}>
        <label htmlFor={`comment-input-${postId}`} className="sr-only">{b.brWriteComment}</label>
        <input
          id={`comment-input-${postId}`}
          className={styles.composerInput}
          value={draft}
          maxLength={500}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={replyTo ? fmtLabel(b.brReplyPh, { name: replyTo.name }) : b.brCommentPh}
          disabled={sending}
          autoComplete="off"
        />
        <button type="submit" className={styles.composerSend} disabled={sending || !draft.trim()} aria-label={b.brSendComment}>
          {sending ? <LoaderCircle size={17} className="spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
        </button>
      </div>
    </form>
  </section>;
}
