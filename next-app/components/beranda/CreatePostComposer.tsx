'use client';

import { MapPin, Send, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPost } from '@/lib/actions/posts';

type PostType = 'post' | 'reel' | 'property';
type Privacy = 'public' | 'followers';

export function CreatePostComposer({ open, initialType = 'post', onClose, onCreated }: { open: boolean; initialType?: PostType; onClose: () => void; onCreated?: (message: string) => void }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<PostType>(initialType);
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [location, setLocation] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const draftKey = 'suki-create-post-draft';

  useEffect(() => {
    if (!open) return;
    setType(initialType);
    try {
      const draft = JSON.parse(window.localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft === 'object') { setContent(typeof draft.content === 'string' ? draft.content : ''); setLocation(typeof draft.location === 'string' ? draft.location : ''); setPrivacy(draft.privacy === 'followers' ? 'followers' : 'public'); }
    } catch { /* local draft is optional */ }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !saving) onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, initialType, onClose, saving]);

  const remaining = 2000 - content.length;
  const canSubmit = useMemo(() => content.trim().length >= 2 && !saving, [content, saving]);
  if (!open) return null;

  function saveDraft() {
    try { window.localStorage.setItem(draftKey, JSON.stringify({ content, location, privacy, savedAt: new Date().toISOString() })); setNotice('Draft tersimpan di perangkat ini.'); } catch { setNotice('Draft tidak dapat disimpan di perangkat ini.'); }
  }
  async function submit() {
    if (!canSubmit) { setNotice('Tulis minimal 2 karakter sebelum memposting.'); return; }
    setSaving(true); setNotice('');
    const result = await createPost({ content, type, privacy, location, idempotencyKey: window.crypto.randomUUID() });
    setSaving(false);
    if (!result.ok) { setNotice(result.error.includes('Sesi') || result.error.includes('login') ? 'Silakan login terlebih dahulu untuk membuat postingan.' : result.error); return; }
    try { window.localStorage.removeItem(draftKey); } catch { /* optional cleanup */ }
    setContent(''); setLocation(''); setNotice(''); onCreated?.(result.duplicate ? 'Postingan sudah dibuat.' : 'Postingan berhasil dibagikan.'); onClose();
  }

  return <div className="create-composer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section className="create-composer" role="dialog" aria-modal="true" aria-labelledby="create-composer-title">
      <header className="create-composer-header"><div><span className="eyebrow">SUKI Create</span><h2 id="create-composer-title">Buat postingan</h2><p>Bagikan cerita, kabar, atau informasi bermanfaat untuk warga Sultra.</p></div><button type="button" className="create-composer-close" onClick={onClose} disabled={saving} aria-label="Tutup composer"><X size={20}/></button></header>
      <div className="create-composer-author"><span className="beranda-avatar">SH</span><div><strong>Profil Anda</strong><small>Posting sebagai Anda</small></div><select value={privacy} onChange={(event) => setPrivacy(event.target.value as Privacy)} aria-label="Privasi postingan"><option value="public">Publik</option><option value="followers">Pengikut</option></select></div>
      <div className="create-type-tabs" role="tablist" aria-label="Jenis postingan"><button type="button" className={type === 'post' ? 'active' : ''} onClick={() => setType('post')} role="tab" aria-selected={type === 'post'}>Post</button><button type="button" className={type === 'reel' ? 'active' : ''} onClick={() => setType('reel')} role="tab" aria-selected={type === 'reel'}>Reels</button><button type="button" className={type === 'property' ? 'active' : ''} onClick={() => setType('property')} role="tab" aria-selected={type === 'property'}>Properti</button></div>
      <label className="create-composer-field"><span className="sr-only">Isi postingan</span><textarea autoFocus value={content} onChange={(event) => setContent(event.target.value.slice(0, 2000))} placeholder={type === 'reel' ? 'Tulis caption untuk Reels Anda...' : type === 'property' ? 'Bagikan informasi properti atau lingkungan...' : 'Apa yang sedang Anda pikirkan?'} maxLength={2000} /></label>
      <div className="create-composer-meta"><label><MapPin size={15}/><input value={location} onChange={(event) => setLocation(event.target.value.slice(0, 120))} placeholder="Tambahkan lokasi" maxLength={120} /></label><span className={remaining < 100 ? 'warning' : ''}>{remaining}</span></div>
      {notice && <p className="create-composer-notice" role="status">{notice}</p>}
      <footer className="create-composer-footer"><button type="button" className="create-secondary-button" onClick={saveDraft} disabled={saving}>Simpan draft</button><button type="button" className="create-primary-button" onClick={() => void submit()} disabled={!canSubmit}><Send size={16}/>{saving ? 'Membagikan...' : 'Bagikan postingan'}</button></footer>
    </section>
  </div>;
}
