'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Image as ImageIcon, MapPin, Menu, Music2, Smile, Tag, Users, Video, X } from 'lucide-react';
import { createPost } from '@/lib/actions/posts';
import { MediaActionIcon } from './MediaActionIcon';

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
  const [textContent, setTextContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [isInstagramActive, setIsInstagramActive] = useState(false);
  const [location, setLocation] = useState('');
  const [postType, setPostType] = useState<PostType>(initialType);
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPostType(initialType);
    try {
      const draft = JSON.parse(window.localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft === 'object') {
        const draftText = typeof draft.content === 'string' ? draft.content.slice(0, MAX_CONTENT) : '';
        setTextContent(draftText);
        setCharCount(draftText.length);
        setLocation(typeof draft.location === 'string' ? draft.location : '');
        setPrivacy(draft.privacy === 'followers' ? 'followers' : 'public');
      }
    } catch { /* local draft is optional */ }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !isSaving) onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [initialType, isSaving, onClose, open]);

  if (!open) return null;

  function updateText(value: string) {
    const next = value.slice(0, MAX_CONTENT);
    setTextContent(next);
    setCharCount(next.length);
  }

  function selectTool(tool: string) {
    if (tool === 'Lokasi') { setNotice('Tambahkan lokasi pada kolom yang muncul di bawah postingan.'); return; }
    setNotice(`${tool} akan tersedia pada tahap media berikutnya.`);
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ content: textContent, location, privacy, savedAt: new Date().toISOString() }));
      setNotice('Draft tersimpan di perangkat ini.');
    } catch { setNotice('Draft tidak dapat disimpan di perangkat ini.'); }
  }

  async function submit() {
    if (textContent.trim().length < 2) { setNotice('Tulis minimal 2 karakter sebelum memposting.'); return; }
    setIsSaving(true); setNotice('');
    const result = await createPost({ content: textContent, type: postType, privacy, location, idempotencyKey: window.crypto.randomUUID() });
    setIsSaving(false);
    if (!result.ok) { setNotice(result.error.includes('Sesi') || result.error.includes('login') ? 'Silakan login terlebih dahulu untuk membuat postingan.' : result.error); return; }
    try { window.localStorage.removeItem(draftKey); } catch { /* optional cleanup */ }
    setTextContent(''); setCharCount(0); setLocation(''); setNotice('');
    onCreated?.(result.duplicate ? 'Postingan sudah dibuat.' : 'Postingan berhasil dibagikan.');
    onClose();
  }

  const tagTools = [
    { label: 'Musik', icon: Music2 }, { label: 'Tag warga', icon: Users }, { label: 'Lokasi', icon: MapPin }, { label: 'Perasaan', icon: Smile }, { label: 'Kategori', icon: Tag },
  ];
  const mediaTools = [
    { label: 'Galeri', icon: ImageIcon }, { label: 'GIF', icon: Tag }, { label: 'Video', icon: Video }, { label: 'Pengumuman', icon: Menu }, { label: 'Kolaborasi', icon: Users }, { label: 'Kontak Darurat', icon: MapPin }, { label: 'Momen Spesial', icon: Smile },
  ];

  return <div className="fixed inset-x-0 bottom-0 top-[66px] z-[19] flex items-end justify-center bg-black/45 md:top-[76px] md:items-start md:justify-end md:p-4 lg:inset-0 lg:items-center lg:justify-center lg:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onClose(); }}>
    <section className="flex h-full max-h-[calc(100dvh-66px)] w-full flex-col overflow-hidden rounded-t-xl bg-white text-slate-900 shadow-2xl md:h-auto md:max-h-[calc(100dvh-92px)] md:w-[min(500px,calc(100vw-32px))] md:rounded-xl lg:max-h-[min(760px,calc(100dvh-40px))]" role="dialog" aria-modal="true" aria-labelledby="create-post-modal-title">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4">
        <button type="button" onClick={onClose} disabled={isSaving} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-50" aria-label="Tutup buat postingan"><X size={22}/></button>
        <h2 id="create-post-modal-title" className="text-center text-[18px] font-bold">Buat postingan</h2>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100" aria-label="Menu postingan"><Menu size={21}/></button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal-700 text-base font-bold text-white">WS</span>
            <div className="min-w-0 flex-1"><p className="truncate text-base font-bold">Wan Shofir</p><p className="text-xs text-slate-500">Posting sebagai Anda</p></div>
            <select value={privacy} onChange={(event) => setPrivacy(event.target.value as Privacy)} className="max-w-[120px] rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" aria-label="Privasi postingan"><option value="public">Publik ▾</option><option value="followers">Pengikut ▾</option></select>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Tag tools">{tagTools.map(({ label, icon: Icon }) => <button type="button" key={label} onClick={() => selectTool(label)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-700 transition hover:border-teal-300 hover:bg-teal-50"><Icon size={15} className="text-teal-700"/>{label}</button>)}</div>

          <div className="relative mt-3 border-b border-slate-200 pb-2"><textarea autoFocus value={textContent} onChange={(event) => updateText(event.target.value)} placeholder="Apa yang sedang Anda pikirkan?" maxLength={MAX_CONTENT} className="min-h-[120px] w-full resize-none border-0 bg-transparent p-0 text-base leading-7 outline-none placeholder:text-slate-400 focus:ring-0" /><span className="absolute bottom-3 right-0 text-xs text-slate-400">{charCount === 0 ? MAX_CONTENT : charCount}/{MAX_CONTENT}</span></div>

          <div className="mt-3 flex gap-3 overflow-x-auto px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Media actions">{mediaTools.map(({ label, icon: Icon }) => <MediaActionIcon key={label} icon={<Icon size={24}/>} label={label} onClick={() => selectTool(label)} />)}</div>
          {location && <div className="mt-2 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800"><MapPin size={15}/><span className="truncate">{location}</span></div>}
          {notice && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">{notice}</p>}
        </div>
      </div>

      <footer className="sticky bottom-0 z-10 shrink-0 border-t border-slate-200 bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600">{privacy === 'public' ? 'Publik' : 'Pengikut'}</span><button type="button" onClick={() => setIsInstagramActive((value) => !value)} className={`rounded-full border px-3 py-1.5 text-xs transition ${isInstagramActive ? 'border-pink-300 bg-pink-50 text-pink-700' : 'border-slate-300 text-slate-500'}`}>Instagram: {isInstagramActive ? 'Aktif' : 'Nonaktif'}</button></div><div className="flex gap-2"><button type="button" onClick={saveDraft} disabled={isSaving} className="rounded-lg border border-teal-700 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-50">Simpan Draft</button><button type="button" onClick={() => void submit()} disabled={isSaving || textContent.trim().length < 2} className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? 'Membagikan...' : 'Bagikan'}<ArrowUp size={15}/></button></div></div>
      </footer>
    </section>
  </div>;
}
