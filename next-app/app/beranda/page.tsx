'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { FeedPost, type BerandaPostData } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import { StoriesSection } from '@/components/beranda/StoriesSection';

const demoPosts: BerandaPostData[] = [
  { id: 'demo-1', author: 'Komunitas Kendari', initials: 'KK', time: '18 menit lalu', location: 'Kendari', content: 'Sore yang hangat dari Teluk Kendari. Ada rekomendasi tempat makan lokal yang wajib dicoba minggu ini?', likes: 128, comments: 19, mediaUrl: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', mediaType: 'image' },
  { id: 'demo-2', author: 'Ayu Rahma', initials: 'AR', time: '1 jam lalu', location: 'Wakatobi', content: 'Cerita kecil dari Wakatobi: ketika produk lokal bertemu warga yang saling mendukung.', likes: 86, comments: 12 },
];

type DbPost = { id: string; content: string; media_urls?: string[]; type: string; location?: string; created_at: string; user_id: string; profiles?: { display_name?: string; name?: string; avatar_url?: string } | null };
const relativeTime = (iso: string) => { const minutes = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000)); return minutes < 60 ? `${minutes} menit lalu` : `${Math.floor(minutes / 60)} jam lalu`; };

export default function BerandaPage() {
  const [posts, setPosts] = useState<BerandaPostData[]>(demoPosts); const [loading, setLoading] = useState(true); const [notice, setNotice] = useState('');
  const loadFeed = useCallback(async () => { const client = supabase; if (!client) { setLoading(false); return; } const { data, error } = await client.from('posts').select('id,content,media_urls,type,location,created_at,user_id,profiles(display_name,name,avatar_url)').order('created_at', { ascending: false }).limit(20); if (error || !data?.length) { setLoading(false); return; } const mapped: BerandaPostData[] = await Promise.all((data as DbPost[]).map(async post => { const [likes, comments] = await Promise.all([client.from('likes').select('post_id', { count: 'exact', head: true }).eq('post_id', post.id), client.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id)]); const name = post.profiles?.display_name || post.profiles?.name || 'Warga Sultra'; return { id: post.id, author: name, initials: name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(), time: relativeTime(post.created_at), location: post.location, content: post.content, mediaUrl: post.media_urls?.[0], mediaType: (post.type === 'reel' ? 'video' : 'image') as 'video' | 'image', likes: likes.count || 0, comments: comments.count || 0 }; })); setPosts(mapped); setLoading(false); }, []);
  useEffect(() => { void loadFeed(); const client = supabase; if (!client) return; const channel = client.channel('beranda-feed').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => void loadFeed()).on('postgres_changes', { event: '*', schema: 'public', table: 'likes' }, () => void loadFeed()).on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => void loadFeed()).subscribe(); return () => { void client.removeChannel(channel); }; }, [loadFeed]);
  const sortedPosts = useMemo(() => posts, [posts]);
  return <AppLayout active="home"><main className="beranda-shell"><div className="beranda-main"><div className="beranda-feed-heading"><div><span className="eyebrow">RUANG WARGA</span><h1>Beranda</h1><p>Temukan cerita dan kabar terbaru dari Sulawesi Tenggara.</p></div><button className="beranda-filter" aria-label="Opsi beranda"><MoreHorizontal size={18}/></button></div><StoriesSection/><CreatePostInput onCreate={() => setNotice('Buat postingan siap digunakan setelah Anda login.')}/>{notice && <div className="beranda-notice"><span>{notice}</span><button onClick={() => setNotice('')}>Tutup</button></div>}{loading ? <div className="beranda-loading">Memuat cerita warga...</div> : sortedPosts.map(post => <FeedPost key={post.id} post={post} onLike={(id, liked) => setPosts(current => current.map(item => item.id === id ? { ...item, likes: Math.max(0, item.likes + (liked ? 1 : -1)) } : item))} onComment={() => setNotice('Kolom komentar akan tersedia setelah Anda login.')}/>)}</div><RightSidebar/></main></AppLayout>;
}
