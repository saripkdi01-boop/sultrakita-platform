'use client';

import { useEffect, useRef, useState } from 'react';
import { Bookmark, Check, Globe2, Heart, MessageCircle, MoreHorizontal, Send, Share2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export type BerandaPostData = { id: string; author: string; initials: string; avatarUrl?: string; time: string; location?: string; privacy?: 'public' | 'followers'; mood?: string | null; taggedCount?: number; content: string; mediaUrl?: string; mediaUrls?: string[]; mediaType?: 'image' | 'video'; likes: number; comments: number; liked?: boolean };
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
  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem('suki-saved-posts') || '[]').includes(post.id)); } catch { /* optional preference */ } }, [post.id]);
  function toggleSave() { const next = !saved; setSaved(next); try { const current = JSON.parse(localStorage.getItem('suki-saved-posts') || '[]') as string[]; localStorage.setItem('suki-saved-posts', JSON.stringify(next ? Array.from(new Set([...current, post.id])) : current.filter((id) => id !== post.id))); } catch { /* optional preference */ } onNotice?.(next ? 'Postingan disimpan di perangkat ini.' : 'Postingan dihapus dari simpanan.'); }
  async function share() { setSharing(true); const payload = { title: `Postingan ${post.author}`, text: post.content, url: window.location.href }; try { if (navigator.share) await navigator.share(payload); else { await navigator.clipboard?.writeText(`${post.content}\n${window.location.href}`); onNotice?.('Tautan postingan disalin.'); } } catch { /* user cancelled share */ } finally { setSharing(false); } }
  function toggleLike() { const next = !liked; setLiked(next); onLike?.(post.id, next); }
  return <article className="beranda-feed-post" aria-labelledby={`post-${post.id}`}>
    <header><span className="beranda-avatar" aria-hidden="true">{post.avatarUrl ? <img src={post.avatarUrl} alt=""/> : post.initials}</span><div className="min-w-0"><strong id={`post-${post.id}`} className="block truncate">{post.author}</strong><small>{post.time}{post.location ? ` · ${post.location}` : ''}{post.mood ? ` · ${post.mood}` : ''}{post.taggedCount ? ` · ${post.taggedCount} warga ditandai` : ''} · {post.privacy === 'followers' ? <><Users size={11} aria-hidden="true"/> Pengikut</> : <><Globe2 size={11} aria-hidden="true"/> Publik</>}</small></div><button type="button" className="icon-only focus-ring" aria-label={`Opsi postingan dari ${post.author}`}><MoreHorizontal size={18} aria-hidden="true"/></button></header>
    <p className="feed-copy">{post.content}</p>
    <MediaGallery post={post}/>
    <div className="feed-meta" aria-label="Ringkasan interaksi"><span><Heart size={14} fill="currentColor" aria-hidden="true"/> {post.likes + (liked && !post.liked ? 1 : 0)} suka</span><span>{post.comments} komentar</span>{saved && <span className="feed-saved-label"><Check size={13}/> Disimpan</span>}</div>
    <div className="feed-actions" role="group" aria-label={`Aksi postingan dari ${post.author}`}><motion.button type="button" whileTap={{ scale: .96 }} onClick={toggleLike} className={liked ? 'liked focus-ring' : 'focus-ring'} aria-pressed={liked}><Heart size={17} fill={liked ? 'currentColor' : 'none'} aria-hidden="true"/><span>{liked ? 'Disukai' : 'Suka'}</span></motion.button><button type="button" className="focus-ring" onClick={() => onComment?.(post.id)}><MessageCircle size={17} aria-hidden="true"/><span>Komentar</span></button><button type="button" className="focus-ring" onClick={() => void share()} disabled={sharing} aria-label={`Bagikan postingan dari ${post.author}`}><Share2 size={17} aria-hidden="true"/><span>{sharing ? 'Menyiapkan…' : 'Bagikan'}</span></button><button type="button" className={saved ? 'liked focus-ring' : 'focus-ring'} onClick={toggleSave} aria-pressed={saved}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true"/><span>{saved ? 'Tersimpan' : 'Simpan'}</span></button><a className="focus-ring feed-action-whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${post.content} ${window.location.href}`)}`} target="_blank" rel="noreferrer" aria-label="Bagikan ke WhatsApp"><Send size={17} aria-hidden="true"/><span>WhatsApp</span></a></div>
  </article>;
}
