'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, Globe2, Image as ImageIcon, MapPin, Menu, Smile, Tag, Users, Video, X } from 'lucide-react';
import { createPost } from '@/lib/actions/posts';
import { useSessionProfile } from '@/hooks/useSessionProfile';
import { MediaActionIcon } from './MediaActionIcon';
import { TagToolRow } from './TagToolRow';

type Privacy = 'public' | 'followers';
type PostType = 'post' | 'reel';

type CreatePostModalProps = {
  open: boolean;
  initialType?: PostType;
  onClose: () => void;
  onCreated?: (message: string) => void;
};

const MAX_CONTENT = 2000;
const draftKey = 'suki-create-post-draft';

export function CreatePostModal({ open, initialType = 'post', onClose, onCreated }: CreatePostModalProps) {
  const { user, profile } = useSessionProfile();
  const [textContent, setTextContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [postType, setPostType] = useState<PostType>(initialType);
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isInstagramActive, setIsInstagramActive] = useState(false);
  const displayName = profile?.full_name || user?.email || 'Pengguna SultraKita';
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const trimmedContent = textContent.trim();
  const canPublish = trimmedContent.length >= 2 && !isSaving;
  const remaining = MAX_CONTENT - textContent.length;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPostType(initialType);
    setNotice('');
    setDraftRestored(false);
    try {
      const draft = JSON.parse(window.localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft === 'object' && typeof draft.content === 'string' && draft.content.trim()) {
        setTextContent(draft.content.slice(0, MAX_CONTENT));
        setLocation(typeof draft.location === 'string' ? draft.location : '');
        setPrivacy(draft.privacy === 'followers' ? 'followers' : 'public');
        setSelectedTags(Array.isArray(draft.selectedTags) ? draft.selectedTags.filter((tag: unknown): tag is string => typeof tag === 'string') : []);
        setDraftRestored(true);
      }
    } catch { /* local draft is optional */ }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !isSaving) onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [initialType, isSaving, onClose, open]);

  const audienceLabel = privacy === 'public' ? 'Publik' : 'Pengikut';
  const audienceDescription = privacy === 'public' ? 'Siapa pun dapat melihat postingan ini' : 'Hanya pengikut Anda yang dapat melihatnya';
  const tagTools = useMemo(() => [
    { id: 'music', label: 'Musik', icon: '🎵', action: () => setNotice('Pilih musik akan tersedia pada tahap media berikutnya.') },
    { id: 'tag', label: 'Tag warga', icon: '👥', action: () => setNotice('Fitur tag warga siap digunakan pada update berikutnya.') },
    { id: 'feeling', label: 'Perasaan', icon: '😊', action: () => setNotice('Tambahkan perasaan akan tersedia pada tahap berikutnya.') },
    { id: 'category', label: 'Kategori', icon: '🏷️', action: () => setNotice('Kategori dapat ditambahkan setelah postingan dibuat.') },
  ], []);
  const mediaTools = [
    { label: 'Foto', icon: ImageIcon }, { label: 'GIF', icon: Tag }, { label: 'Video', icon: Video }, { label: 'Kolaborasi', icon: Users }, { label: 'Momen', icon: Smile },
  ];

  function saveDraft() {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ content: textContent, location, privacy, selectedTags, savedAt: new Date().toISOString() }));
      setNotice('Draft tersimpan di perangkat ini.');
    } catch { setNotice('Draft tidak dapat disimpan di perangkat ini.'); }
  }

  async function submit() {
    if (!canPublish) {
      setNotice(trimmedContent.length < 2 ? 'Tulis minimal 2 karakter sebelum memposting.' : 'Postingan sedang diproses.');
      return;
    }
    setIsSaving(true); setNotice('');
    const result = await createPost({ content: textContent, type: postType, privacy, location, idempotencyKey: window.crypto.randomUUID() });
    setIsSaving(false);
    if (!result.ok) {
      setNotice(result.error.includes('Sesi') || result.error.includes('login') ? 'Silakan login terlebih dahulu untuk membuat postingan.' : 'Postingan belum dapat dipublikasikan. Coba lagi.');
      return;
    }
    try { window.localStorage.removeItem(draftKey); } catch { /* optional cleanup */ }
    setTextContent(''); setLocation(''); setSelectedTags([]); setNotice('');
    onCreated?.(result.duplicate ? 'Postingan sudah ada di feed Anda.' : 'Postingan berhasil dibagikan ke feed.');
    onClose();
  }

  if (!open) return null;

  return <div className="fixed inset-0 z-[40] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onClose(); }}>
    <section className="flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-[24px] bg-white text-slate-900 shadow-2xl sm:max-h-[min(820px,calc(100dvh-32px))] sm:max-w-[560px] sm:rounded-[24px]" role="dialog" aria-modal="true" aria-labelledby="create-post-modal-title" aria-busy={isSaving}>
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
        <div><p className="mb-0.5 text-[10px] font-bold uppercase tracking-[.18em] text-teal-700">SUKI COMMUNITY</p><h2 id="create-post-modal-title" className="text-xl font-extrabold tracking-tight">Buat postingan</h2></div>
        <button type="button" onClick={onClose} disabled={isSaving} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50" aria-label="Tutup buat postingan"><X size={21}/></button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-teal-700 text-sm font-extrabold text-white ring-4 ring-teal-50">{avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : initials}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{displayName}</p><p className="mt-0.5 text-xs text-slate-500">Bagikan kabar terbaru bersama warga SultraKita</p></div>
          <label className="relative"><span className="sr-only">Pilih audiens postingan</span><select value={privacy} onChange={(event) => setPrivacy(event.target.value as Privacy)} className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-7 text-xs font-bold text-slate-700 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" aria-label="Privasi postingan"><option value="public">Publik</option><option value="followers">Pengikut</option></select><Globe2 size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-teal-700" /></label>
        </div>

        <div className="mb-4 flex gap-2 rounded-2xl bg-slate-50 p-1.5" role="tablist" aria-label="Jenis konten"><button type="button" role="tab" aria-selected={postType === 'post'} onClick={() => setPostType('post')} className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition ${postType === 'post' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Postingan biasa</button><button type="button" role="tab" aria-selected={postType === 'reel'} onClick={() => setPostType('reel')} className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition ${postType === 'reel' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Reels</button></div>

        {draftRestored && <div className="mb-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status"><span>Draft terakhir dipulihkan.</span><button type="button" className="font-bold underline" onClick={() => { setTextContent(''); setLocation(''); setDraftRestored(false); }}>Hapus</button></div>}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-50">
          <textarea autoFocus value={textContent} onChange={(event) => setTextContent(event.target.value.slice(0, MAX_CONTENT))} placeholder="Apa yang sedang Anda pikirkan? Ceritakan sesuatu yang bermanfaat untuk warga..." maxLength={MAX_CONTENT} className="min-h-[150px] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-7 outline-none placeholder:text-slate-400 focus:ring-0" aria-label="Isi postingan" />
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400"><span>{remaining < 200 ? `${remaining} karakter tersisa` : 'Tulis dengan nyaman — maksimal 2.000 karakter'}</span><span className={remaining < 0 ? 'text-red-600' : ''}>{textContent.length}/{MAX_CONTENT}</span></div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"><label htmlFor="post-location" className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"><MapPin size={15} className="text-teal-700"/> Tambahkan lokasi <span className="font-normal text-slate-400">(opsional)</span></label><input id="post-location" value={location} onChange={(event) => setLocation(event.target.value.slice(0, 120))} placeholder="Contoh: Kendari, Sulawesi Tenggara" maxLength={120} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" /></div>

        <div className="mt-4"><p className="mb-2 text-xs font-bold text-slate-600">Tambahkan ke postingan</p><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Media actions">{mediaTools.map(({ label, icon: Icon }) => <MediaActionIcon key={label} icon={<Icon size={20}/>} label={label} onClick={() => setNotice(`${label} akan tersedia pada tahap media berikutnya.`)} />)}</div></div>
        <TagToolRow items={tagTools} selectedTags={selectedTags} onSelectedTagsChange={setSelectedTags} />
        {notice && <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800" role="status">{notice}</p>}
      </div>

      <footer className="shrink-0 border-t border-slate-100 bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 sm:pb-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500"><span className="flex items-center gap-2"><Globe2 size={14} className="text-teal-700"/><span><strong className="text-slate-700">{audienceLabel}</strong> · {audienceDescription}</span></span><button type="button" onClick={() => setIsInstagramActive((value) => !value)} className={`rounded-full border px-3 py-1.5 font-bold transition ${isInstagramActive ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-slate-200 text-slate-500'}`}>Instagram: {isInstagramActive ? 'Aktif' : 'Nonaktif'}</button></div><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={saveDraft} disabled={isSaving} className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">Simpan Draft</button><button type="button" onClick={() => void submit()} disabled={!canPublish} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? 'Mempublikasikan...' : 'Publikasikan sekarang'}<ArrowUp size={15}/></button></div></footer>
    </section>
  </div>;
}
