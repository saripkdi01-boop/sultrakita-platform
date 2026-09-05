'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Bell, Heart, ImagePlus, MessageCircle, Play, Search, Send, Share2, Sparkles, Store, Users, Video, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AiListingAssistant } from '@/components/marketplace/AiListingAssistant';
import { ReelsFeed as EngineReelsFeed } from '@/components/reels/ReelsFeed';
import { ChatDrawer } from '@/components/chat/ChatDrawer';
import { CreatePostInput } from '@/components/feed/CreatePostInput';
import { FeedPost } from '@/components/feed/FeedPost';
import { StoriesSection } from '@/components/stories/StoriesSection';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { PromoSlider } from '@/components/marketing/PromoSlider';
import type { ListingAiResult } from '@/lib/actions/ai-listing';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const demoReels = [
  { id: 'demo-1', author: 'Maya Kendari', group: 'Warga Kendari', time: '12 menit lalu', avatar: 'M', title: 'Teluk Kendari dari sudut yang berbeda', description: 'Cerita singkat warga untuk warga Sultra.', video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', likes: 128, comments: 12 },
  { id: 'demo-2', author: 'Kendari Kreatif', group: 'UMKM Sultra', time: '1 jam lalu', avatar: 'K', title: 'Di balik produk lokal yang kamu pakai', description: 'Kenali proses dan orang-orang di balik seller lokal.', video_url: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4', likes: 84, comments: 7 },
];
const listings = [
  { title: 'Kain Tenun Buton Premium', price: 'Rp 450.000', category: 'Fashion', location: 'Kendari Barat', tone: 'gold' },
  { title: 'Paket Ikan Bakar Sambal', price: 'Rp 120.000', category: 'Kuliner', location: 'Baruga', tone: 'teal' },
  { title: 'Paket Snorkeling Wakatobi', price: 'Rp 350.000', category: 'Jasa', location: 'Kendari', tone: 'blue' },
];

type Reel = typeof demoReels[number];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'market' | 'groups'>('home');
  const [reels, setReels] = useState<Reel[]>(demoReels);
  const [liked, setLiked] = useState<string[]>([]);
  const [listingOpen, setListingOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState({ title: '', price: '', category: 'Fashion', district: 'Kendari', description: '' });
  const [media, setMedia] = useState<File[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/videos`).then(response => response.json()).then(body => {
      const rows = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : body?.data?.items || [];
      if (rows.length) setReels(rows);
    }).catch(() => undefined);
  }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2400); return () => window.clearTimeout(timer); }, [toast]);
  const categories = useMemo(() => ['Semua', 'Properti', 'Kendaraan', 'Elektronik', 'Jasa', 'Kuliner', 'Fashion'], []);

  function saveDraft() { localStorage.setItem('sultra-next-listing-draft', JSON.stringify(draft)); setToast('Draft iklan disimpan.'); }
  function restoreDraft() { try { const saved = JSON.parse(localStorage.getItem('sultra-next-listing-draft') || '{}'); setDraft(current => ({ ...current, ...saved })); setToast('Draft dipulihkan.'); } catch { setToast('Draft belum tersedia.'); } }
  async function assistDescription() {
    if (!draft.title.trim()) return setToast('Isi judul iklan terlebih dahulu.');
    try {
      const response = await fetch(`${API_BASE}/api/ai/listing-assist`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(draft) });
      const body = await response.json();
      if (body.data?.description) { setDraft(current => ({ ...current, description: body.data.description })); setToast('Deskripsi dibantu AI.'); return; }
    } catch { /* local fallback below */ }
    setDraft(current => ({ ...current, description: `${current.title} pilihan warga ${current.district}. Produk ${current.category} dengan kualitas baik, siap dipertimbangkan. Hubungi penjual untuk detail, stok, dan kesepakatan COD.` }));
    setToast('Deskripsi dibuat dengan bantuan lokal.');
  }
  function applyAiResult(result: ListingAiResult) { setDraft(current => ({ ...current, title: result.title, description: result.description, category: result.category, price: String(Math.round((result.estimated_price_min + result.estimated_price_max) / 2) || '') })); setToast('Hasil AI dimasukkan ke draft. Periksa kembali sebelum terbitkan.'); }
  function submitListing(event: FormEvent) { event.preventDefault(); if (!draft.title.trim()) return setToast('Judul iklan wajib diisi.'); setListingOpen(false); setActiveTab('market'); setToast('Iklan disimpan sebagai listing baru.'); }

  return <AppLayout onCreate={() => setListingOpen(true)}>
    <main className="platform-shell">
      <div className="mx-auto mb-4 max-w-2xl"><PromoSlider onCreate={() => setListingOpen(true)}/></div>
      {activeTab === 'home' && <HomeTab onListing={() => setListingOpen(true)} onReels={() => setActiveTab('reels')} />}
      {activeTab === 'reels' && <ReelsTab reels={reels} liked={liked} setLiked={setLiked} onListing={() => setListingOpen(true)} onToast={setToast} />}
      {activeTab === 'market' && <MarketTab categories={categories} onListing={() => setListingOpen(true)} onChat={() => setChatOpen(true)} />}
      {activeTab === 'groups' && <GroupsTab />}
    </main>
    {listingOpen && <ListingModal draft={draft} setDraft={setDraft} media={media} setMedia={setMedia} onClose={() => setListingOpen(false)} onSave={saveDraft} onRestore={restoreDraft} onAssist={assistDescription} onGenerated={applyAiResult} onSubmit={submitListing} />}
    {toast && <div className="next-toast" role="status">{toast}</div>}<ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)}/>
  </AppLayout>;
}

function HomeTab({ onListing, onReels }: { onListing: () => void; onReels: () => void }) { return <div className="mx-auto max-w-6xl px-0 sm:px-4"><div className="mx-auto max-w-2xl"><div className="mb-4"><CreatePostInput userName="Laras Rahayu" onOpen={mode => mode === 'post' ? onReels() : onListing()}/></div><div className="mb-4"><StoriesSection onCreate={onReels} onOpen={onReels}/></div><div id="feed" className="space-y-4"><FeedPost author="Wa Ode Sari" avatar="WS" time="2 jam lalu" location="Kendari" caption="Akhir pekan di Wakatobi, airnya sejernih kaca. Siapa mau ikut trip bulan depan?" imageLabel="WAKATOBI" likes={214} comments={18} onFollow={() => undefined} onComment={() => undefined} onShare={() => undefined}/><FeedPost author="Kendari Kreatif" avatar="KK" time="Kemarin" location="Kendari Barat" caption="Di balik produk lokal, ada tangan-tangan warga yang terus berkarya. Dukung UMKM Sultra hari ini." imageLabel="UMKM SULTRA" likes={86} comments={12} onFollow={() => undefined} onComment={() => undefined} onShare={() => undefined}/></div></div><RightSidebar onMarketplace={onListing} onGroups={onReels}/></div> }

function ReelsTab({ reels }: { reels: Reel[]; liked: string[]; setLiked: (value: string[]) => void; onListing: () => void; onToast: (value: string) => void }) { const fallback = reels.map(reel => ({ id: reel.id, user_id: 'demo', video_url: reel.video_url, thumbnail_url: null, caption: reel.description, district: reel.group, views_count: 0, likes_count: reel.likes, created_at: new Date().toISOString(), author: reel.author, title: reel.title })); return <section className="reels-shell"><div className="reels-heading"><div><span className="eyebrow">Video warga Sultra</span><h2>Reels yang dekat</h2><p>Temukan kabar, karya, dan momen dari komunitas lokal.</p></div></div><div className="reels-filter"><button className="active">Untuk kamu</button><button>Terbaru</button><button>Di Kendari</button></div><EngineReelsFeed district="Kendari" fallback={fallback}/></section> }
function ReelCard({ reel, isLiked, onLike, onToast }: { reel: Reel; isLiked: boolean; onLike: () => void; onToast: (value: string) => void }) { const [muted, setMuted] = useState(true); const [playing, setPlaying] = useState(false); const [comment, setComment] = useState(''); const [comments, setComments] = useState<string[]>([]); return <article className="next-reel"><div className="next-video"><video src={reel.video_url} muted={muted} loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><button className="video-play" onClick={event => { const video = event.currentTarget.parentElement?.querySelector('video'); if (!video) return; playing ? video.pause() : video.play().catch(() => undefined); }}>{playing ? '❚❚' : '▶'}</button><button className="video-mute" onClick={() => setMuted(!muted)}>{muted ? '⌕' : '◉'}</button></div><div className="next-reel-body"><div className="reel-author"><span className="avatar warm">{reel.avatar}</span><div><strong>{reel.author}</strong><small>{reel.time} · {reel.group}</small></div><button onClick={() => onToast('Kini mengikuti kreator.')}>Ikuti</button></div><h3>{reel.title}</h3><p>{reel.description}</p><div className="reel-actions"><button className={isLiked ? 'liked' : ''} onClick={onLike}>♥ {reel.likes + (isLiked ? 1 : 0)}</button><button onClick={() => document.getElementById(`comment-${reel.id}`)?.focus()}>💬 {reel.comments + comments.length}</button><button onClick={() => { navigator.clipboard?.writeText(location.href); onToast('Tautan Reels disalin.'); }}><Share2 size={15}/> Bagikan</button></div><form className="reel-comment" onSubmit={event => { event.preventDefault(); if (!comment.trim()) return; setComments([comment, ...comments]); setComment(''); }}><input id={`comment-${reel.id}`} value={comment} onChange={event => setComment(event.target.value)} placeholder="Tulis komentar..."/><button><Send size={15}/></button></form>{comments.map((item, index) => <small className="comment-line" key={`${item}-${index}`}>Warga Sultra: {item}</small>)}</div></article> }

function MarketTab({ categories, onListing, onChat }: { categories: string[]; onListing: () => void; onChat: () => void }) { return <section className="market-shell"><div className="section-title"><div><span className="eyebrow">Marketplace warga</span><h2>Temukan yang dekat</h2></div><button className="primary-btn" onClick={onListing}>＋ Buat iklan</button></div><div className="category-row">{categories.map(category => <button key={category}>{category}</button>)}</div><div className="market-grid">{listings.map(item => <article className="market-card" key={item.title}><div className={`market-art ${item.tone}`}>{item.category}</div><div><span className="price">{item.price}</span><h3>{item.title}</h3><p>{item.location} · Seller terverifikasi</p><div className="market-card-actions"><button className="soft-btn">Lihat detail</button><button className="soft-btn" onClick={onChat}>Hubungi seller</button></div></div></article>)}</div></section> }
function GroupsTab() { return <section className="groups-shell"><span className="eyebrow">Ruang warga</span><h2>Komunitas Sultra</h2><p>Temukan grup untuk jual beli, wisata, kuliner, UMKM, dan hobi lokal.</p><div className="group-grid">{['Jual Beli Kendari & Sekitarnya', 'Pecinta Wisata Wakatobi & Sultra', 'Kuliner Sultra — SUKI Foodies', 'UMKM Sultra Naik Kelas'].map((name, index) => <article className="group-card" key={name}><span>{['🛍', '◉', '✦', '▣'][index]}</span><div><h3>{name}</h3><p>{[125, 48, 32, 21][index]} rb anggota</p></div><button>Gabung</button></article>)}</div></section> }

function ListingModal({ draft, setDraft, media, setMedia, onClose, onSave, onRestore, onAssist, onGenerated, onSubmit }: { draft: { title: string; price: string; category: string; district: string; description: string }; setDraft: (value: typeof draft) => void; media: File[]; setMedia: (value: File[]) => void; onClose: () => void; onSave: () => void; onRestore: () => void; onAssist: () => void; onGenerated: (result: ListingAiResult) => void; onSubmit: (event: FormEvent) => void }) { const update = (key: keyof typeof draft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDraft({ ...draft, [key]: event.target.value }); return <div className="next-modal-layer" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><form className="next-modal" onSubmit={onSubmit}><header><div><span className="eyebrow">Marketplace warga</span><h2>Pasang iklan gratis</h2></div><button type="button" onClick={onClose} aria-label="Tutup"><X size={20}/></button></header><label>Judul iklan<input value={draft.title} onChange={update('title')} placeholder="Contoh: Kain Tenun Buton Motif Klasik" required/></label><div className="two-fields"><label>Harga (Rp)<input type="number" value={draft.price} onChange={update('price')} placeholder="450000"/></label><label>Kategori<select value={draft.category} onChange={update('category')}><option>Fashion</option><option>Properti</option><option>Kendaraan</option><option>Elektronik</option><option>Jasa</option><option>Kuliner</option><option>Hobi</option></select></label></div><label>Distrik<select value={draft.district} onChange={update('district')}><option>Kendari</option><option>Poasia</option><option>Baruga</option><option>Mandonga</option><option>Kadia</option><option>Wua-Wua</option></select></label><label>Deskripsi<textarea value={draft.description} onChange={update('description')} rows={4} placeholder="Jelaskan kondisi, keunggulan, dan cara COD..."/></label><div className="ai-tools"><button type="button" onClick={onAssist}><Sparkles size={14}/> Bantu AI menulis deskripsi</button><button type="button" onClick={onSave}>Simpan draft</button><button type="button" onClick={onRestore}>Pulihkan</button></div><label>Foto atau video<input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple onChange={event => setMedia(Array.from(event.target.files || []).slice(0, 6))}/></label>{media.length > 0 && <div className="media-names">{media.map(file => <span key={file.name}>{file.name}</span>)}</div>}<AiListingAssistant file={media.find(file => file.type.startsWith('image/'))} onGenerated={onGenerated}/><button className="primary-btn full" type="submit">🚀 Terbitkan iklan</button></form></div> }
