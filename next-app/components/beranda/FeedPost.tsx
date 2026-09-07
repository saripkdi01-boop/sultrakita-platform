'use client';

import { useEffect, useRef, useState } from 'react';
import { Bookmark, Globe2, Heart, MessageCircle, MoreHorizontal, Send, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type BerandaPostData = { id: string; author: string; initials: string; time: string; location?: string; content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; likes: number; comments: number; liked?: boolean };

function ViewportVideo({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => undefined);
      else { video.pause(); video.currentTime = 0; }
    }, { threshold: [0, 0.6] });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);
  return <figure className="feed-video-wrap"><video ref={ref} className="feed-media feed-video" controls playsInline muted loop preload="metadata" poster={`${src}#t=0.1`} aria-label={caption}><source src={src} type="video/mp4"/>Browser Anda tidak mendukung video.</video><figcaption className="sr-only">{caption}</figcaption></figure>;
}

export function FeedPost({ post, onLike, onComment }: { post: BerandaPostData; onLike?: (id: string, liked: boolean) => void; onComment?: (id: string) => void }) {
  const [liked, setLiked] = useState(Boolean(post.liked)); const [saved, setSaved] = useState(false);
  const toggleLike = () => { const next = !liked; setLiked(next); onLike?.(post.id, next); };
  return <article className="beranda-feed-post" aria-labelledby={`post-${post.id}`}>
    <header><span className="beranda-avatar" aria-hidden="true">{post.initials}</span><div><strong id={`post-${post.id}`}>{post.author}</strong><small>{post.time}{post.location ? ` · ${post.location}` : ''} · <Globe2 size={11}/></small></div><button className="icon-only focus-ring" aria-label={`Opsi postingan dari ${post.author}`}><MoreHorizontal size={18}/></button></header>
    <p className="feed-copy">{post.content}</p>
    {post.mediaUrl && (post.mediaType === 'video' ? <ViewportVideo src={post.mediaUrl} caption={`Video dari ${post.author}`}/> : <img className="feed-media" src={post.mediaUrl} alt={`Media dari ${post.author}`} loading="lazy" decoding="async"/>) }
    <div className="feed-meta"><span><Heart size={14} fill="currentColor"/> {post.likes + (liked && !post.liked ? 1 : 0)}</span><span>{post.comments} komentar</span></div>
    <div className="feed-actions"><motion.button whileTap={{ scale: .96 }} onClick={toggleLike} className={liked ? 'liked focus-ring' : 'focus-ring'} aria-pressed={liked}><Heart size={17} fill={liked ? 'currentColor' : 'none'}/> Suka</motion.button><button className="focus-ring" onClick={() => onComment?.(post.id)}><MessageCircle size={17}/> Komentar</button><button className="focus-ring" onClick={() => navigator.share?.({ title: post.author, text: post.content }).catch(() => undefined)}><Share2 size={17}/> Bagikan</button><button className={saved ? 'liked focus-ring' : 'focus-ring'} onClick={() => setSaved((value) => !value)} aria-pressed={saved}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'}/> Simpan</button><a className="focus-ring" href={`https://wa.me/?text=${encodeURIComponent(post.content)}`} target="_blank" rel="noreferrer" aria-label="Bagikan ke WhatsApp"><Send size={17}/></a></div>
  </article>;
}
