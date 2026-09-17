'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Check, Globe2, Heart, MessageCircle, MoreHorizontal, Send, Share2, Users } from 'lucide-react';
import { createPostComment, recordPostShare, setPostSaved } from '@/lib/feed-interactions';

export type BerandaPostData = { id: string; author: string; authorUsername?: string; initials: string; avatarUrl?: string | null; time: string; location?: string; privacy?: 'public' | 'followers'; mood?: string | null; taggedCount?: number; content: string; mediaUrl?: string; mediaUrls?: string[]; mediaType?: 'image' | 'video'; likes: number; comments: number; liked?: boolean; recommendationReason?: 'following' | 'popular' | 'fresh' | null };
type Props = { post: BerandaPostData; onLike?: (id: string, liked: boolean) => void; onComment?: (id: string) => void; onNotice?: (message: string) => void };

function MediaGallery({ post }: { post: BerandaPostData }) {
  const media = post.mediaUrls?.length ? post.mediaUrls : post.mediaUrl ? [post.mediaUrl] : [];
  if (!media.length) return null;
  if (post.mediaType === 'video') return <ViewportVideo src={media[0]} caption={`Video dari ${post.author}`}/>;
  return <div className={`feed-media-gallery feed-media-count-${Math.min(media.length, 4)}`} aria-label={`${media.length} media dari ${post.author}`}>{media.slice(0, 4).map((src, index) => <button type="button" key={src} className="feed-gallery-item" onClick={() => window.open(src, '_blank', 'noopener,noreferrer')} aria-label={`Buka foto ${index + 1} dari ${post.author}`}><img src={src} alt={`Media ${index + 1} dari ${post.author}`} loading="lazy" decoding="async"/>{index === 3 && media.length > 4 && <span>+{media.length - 4}</span>}</button>)}</div>;
}

function ViewportVideo({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current; if (!video) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => undefined); else { video.pause(); video.currentTime = 0; } }, { threshold: [0, 0.6] });
    observer.observe(video); return () => { observer.disconnect(); video.pause(); };
  }, []);
  return <figure className="feed-video-wrap"><video ref={ref} className="feed-media feed-video" controls playsInline muted loop preload="metadata" poster={`${src}#t=0.1`} aria-label={caption}><source src={src} type="video/mp4"/>Browser Anda tidak mendukung video.</video><figcaption className="sr-only">{caption}</figcaption></figure>;
}

export function FeedPost({ post, onLike, onComment, onNotice }: Props) {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [commentBusy, setCommentBusy] = useState(false);
  useEffect(() => { setSaved(false); }, [post.id]);
  async function toggleSave() { const next = !saved; setSaved(next); try { await setPostSaved(post.id, next); onNotice?.(next ? 'Postingan disimpan.' : 'Postingan dihapus dari simpanan.'); } catch (error) { setSaved(!next); onNotice?.(error instanceof Error && error.message === 'authentication_required' ? 'Silakan login untuk menyimpan postingan.' : 'Simpanan belum dapat diperbarui.'); } }
  async function share() { setSharing(true); const payload = { title: `Postingan ${post.author}`, text: post.content, url: window.location.href }; try { if (navigator.share) { await navigator.share(payload); await recordPostShare(post.id, 'native'); } else { await navigator.clipboard?.writeText(`${post.content}\n${window.location.href}`); await recordPostShare(post.id, 'clipboard'); onNotice?.('Tautan postingan disalin.'); } } catch { /* user cancelled share or unavailable */ } finally { setSharing(false); } }
  async function submitComment() { if (!commentBody.trim() || commentBusy) return; setCommentBusy(true); try { await createPostComment(post.id, commentBody); setCommentBody(''); onNotice?.('Komentar berhasil dikirim.'); } catch (error) { onNotice?.(error instanceof Error && error.message === 'authentication_required' ? 'Silakan login untuk berkomentar.' : 'Komentar belum dapat dikirim.'); } finally { setCommentBusy(false); } }
  function toggleLike() { const next = !liked; setLiked(next); onLike?.(post.id, next); }
  const recommendationLabel = post.recommendationReason === 'following' ? 'Dari akun yang kamu ikuti' : post.recommendationReason === 'popular' ? 'Populer di Suki Apps' : post.recommendationReason === 'fresh' ? 'Baru di beranda' : null;
  return <article className="beranda-feed-post" aria-labelledby={`post-${post.id}`}>
    <header><span className="beranda-avatar" aria-hidden="true">{post.avatarUrl ? <img src={post.avatarUrl} alt=""/> : post.initials}</span><div className="min-w-0"><strong id={`post-${post.id}`} className="block truncate">{post.authorUsername ? <Link href={`/profile/${encodeURIComponent(post.authorUsername)}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-sultra-teal focus:ring-offset-2" aria-label={`Buka profil publik ${post.author}`}>{post.author}</Link> : post.author}</strong><small>{post.time}{post.location ? ` · ${post.location}` : ''}{post.mood ? ` · ${post.mood}` : ''}{post.taggedCount ? ` · ${post.taggedCount} warga ditandai` : ''} · {post.privacy === 'followers' ? <><Users size={11} aria-hidden="true"/> Pengikut</> : <><Globe2 size={11} aria-hidden="true"/> Publik</>}</small></div><button type="button" className="icon-only focus-ring" aria-label={`Opsi postingan dari ${post.author}`}><MoreHorizontal size={18} aria-hidden="true"/></button></header>
    {recommendationLabel && <p className="feed-recommendation" aria-label={`Alasan rekomendasi: ${recommendationLabel}`}>{recommendationLabel}</p>}
    <p className="feed-copy">{post.content}</p>
    <MediaGallery post={post}/>
    <div className="feed-meta" aria-label="Ringkasan interaksi"><span><Heart size={14} fill="currentColor" aria-hidden="true"/> {post.likes + (liked && !post.liked ? 1 : 0)} suka</span><span>{post.comments} komentar</span>{saved && <span className="feed-saved-label"><Check size={13}/> Disimpan</span>}</div>
    <div className="feed-actions" role="group" aria-label={`Aksi postingan dari ${post.author}`}><button type="button" onClick={toggleLike} className={liked ? 'liked focus-ring' : 'focus-ring'} aria-pressed={liked}><Heart size={17} fill={liked ? 'currentColor' : 'none'} aria-hidden="true"/><span>{liked ? 'Disukai' : 'Suka'}</span></button><button type="button" className="focus-ring" onClick={() => { setCommentOpen(!commentOpen); onComment?.(post.id); }}><MessageCircle size={17} aria-hidden="true"/><span>Komentar</span></button><button type="button" className="focus-ring" onClick={() => void share()} disabled={sharing} aria-label={`Bagikan postingan dari ${post.author}`}><Share2 size={17} aria-hidden="true"/><span>{sharing ? 'Menyiapkan…' : 'Bagikan'}</span></button><button type="button" className={saved ? 'liked focus-ring' : 'focus-ring'} onClick={() => void toggleSave()} aria-pressed={saved}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true"/><span>{saved ? 'Tersimpan' : 'Simpan'}</span></button><a className="focus-ring feed-action-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${post.content} ${window.location.href}`)}`} target="_blank" rel="noreferrer" aria-label="Bagikan ke WhatsApp" onClick={() => void recordPostShare(post.id, 'whatsapp')}><Send size={17} aria-hidden="true"/><span>WhatsApp</span></a></div>
    {commentOpen && <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); void submitComment(); }}><label className="sr-only" htmlFor={`comment-${post.id}`}>Komentar</label><input id={`comment-${post.id}`} value={commentBody} onChange={(event) => setCommentBody(event.target.value.slice(0, 1000))} maxLength={1000} placeholder="Tulis komentar…" className="min-w-0 flex-1 rounded-full border px-3 py-2 text-sm"/><button type="submit" disabled={commentBusy || !commentBody.trim()} className="rounded-full bg-sultra-teal px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{commentBusy ? 'Mengirim…' : 'Kirim'}</button></form>}
  </article>;
}
