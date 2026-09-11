'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Check, ChevronDown, Globe2, Image as ImageIcon, MapPin, Music2, Search, Tag, Users, Video, X } from 'lucide-react';
import { createPost, searchProfiles } from '@/lib/actions/posts';
import { createR2Upload } from '@/actions/upload';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';

type Privacy = 'public' | 'followers';
type PostType = 'post' | 'reel';
type Mood = 'Merayakan' | 'Merasa bersyukur' | 'Senang' | 'Sedih' | 'Bersemangat' | 'Mencari rekomendasi';
type UploadedMedia = { url: string; name: string; type: string; preview: string };
type TagProfile = { id: string; display_name: string | null; username: string | null; avatar_url: string | null; district: string | null };
type Props = { open: boolean; initialType?: PostType; onClose: () => void; onCreated?: (message: string) => void };

const MAX_CONTENT = 2000;
const MAX_MEDIA = 4;
const MAX_TAGS = 10;
const draftKey = 'suki-create-post-draft';
const moods: Mood[] = ['Merayakan', 'Merasa bersyukur', 'Senang', 'Sedih', 'Bersemangat', 'Mencari rekomendasi'];

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export function CreatePostModal({ open, initialType = 'post', onClose, onCreated }: Props) {
  const { user, profile } = useSessionProfile();
  const [textContent, setTextContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [location, setLocation] = useState('');
  const [postType, setPostType] = useState<PostType>(initialType);
  const [mood, setMood] = useState<Mood | ''>('');
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<TagProfile[]>([]);
  const [taggedProfiles, setTaggedProfiles] = useState<TagProfile[]>([]);
  const [tagLoading, setTagLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const tagTimer = useRef<number | null>(null);
  busyRef.current = isSaving || isUploading;

  const displayName = getProfileNickname(user, profile);
  const avatarUrl = profile?.avatar_url;
  const trimmedContent = textContent.trim();
  const canPublish = (trimmedContent.length >= 2 || media.length > 0) && !isSaving && !isUploading;
  const remaining = MAX_CONTENT - textContent.length;
  const audienceLabel = privacy === 'public' ? 'Publik' : 'Pengikut';
  const audienceDescription = privacy === 'public' ? 'Siapa pun dapat melihat postingan ini' : 'Hanya pengikut Anda yang dapat melihatnya';

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPostType(initialType); setNotice(''); setDraftRestored(false); setIdempotencyKey(window.crypto.randomUUID()); setTagQuery(''); setTagSuggestions([]); setTaggedProfiles([]); setMood('');
    try {
      const draft = JSON.parse(window.localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft === 'object' && typeof draft.content === 'string' && draft.content.trim()) {
        setTextContent(draft.content.slice(0, MAX_CONTENT)); setLocation(typeof draft.location === 'string' ? draft.location : ''); setPrivacy(draft.privacy === 'followers' ? 'followers' : 'public'); setMood(moods.includes(draft.mood) ? draft.mood : ''); setDraftRestored(true);
      } else { setTextContent(''); setLocation(''); setPrivacy('public'); }
    } catch { /* optional draft */ }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busyRef.current) onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; if (tagTimer.current) window.clearTimeout(tagTimer.current); };
  }, [initialType, onClose, open]);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []); event.target.value = ''; if (!selected.length) return;
    if (media.length + selected.length > MAX_MEDIA) { setNotice(`Maksimal ${MAX_MEDIA} media per postingan.`); return; }
    setIsUploading(true); setNotice('Mengunggah media…');
    try {
      const uploaded: UploadedMedia[] = [];
      for (const file of selected) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) throw new Error('Pilih file gambar atau video.');
        const result = await createR2Upload({ fileName: file.name, contentType: file.type, size: file.size });
        const form = new FormData(); Object.entries(result.fields).forEach(([key, value]) => form.append(key, String(value))); form.append('file', file);
        const response = await fetch(result.url, { method: 'POST', body: form }); if (!response.ok) throw new Error(`Upload ${file.name} gagal (${response.status}).`);
        uploaded.push({ url: result.publicUrl, name: file.name, type: file.type, preview: URL.createObjectURL(file) });
      }
      setMedia((current) => [...current, ...uploaded]); setNotice(`${uploaded.length} media siap dipublikasikan.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Media gagal diunggah.'); } finally { setIsUploading(false); }
  }

  function saveDraft() {
    try { window.localStorage.setItem(draftKey, JSON.stringify({ content: textContent, location, privacy, mood, savedAt: new Date().toISOString() })); setNotice('Draft tersimpan di perangkat ini.'); } catch { setNotice('Draft tidak dapat disimpan di perangkat ini.'); }
  }

  function updateTagQuery(value: string) {
    setTagQuery(value); setTagSuggestions([]);
    if (tagTimer.current) window.clearTimeout(tagTimer.current);
    if (value.trim().length < 2) return;
    tagTimer.current = window.setTimeout(async () => { setTagLoading(true); const result = await searchProfiles(value); setTagLoading(false); if (result.ok) setTagSuggestions(result.data.filter((item) => item.id !== user?.id && !taggedProfiles.some((tag) => tag.id === item.id))); }, 280);
  }

  function addTag(profileToAdd: TagProfile) {
    if (taggedProfiles.length >= MAX_TAGS) { setNotice(`Maksimal ${MAX_TAGS} warga dapat ditandai.`); return; }
    setTaggedProfiles((current) => [...current, profileToAdd]); setTagQuery(''); setTagSuggestions([]);
  }

  async function submit() {
    if (!user) { setNotice('Silakan login terlebih dahulu untuk membuat postingan.'); return; }
    if (!canPublish) { setNotice(trimmedContent.length < 2 && !media.length ? 'Tulis minimal 2 karakter atau tambahkan media.' : 'Postingan sedang diproses.'); return; }
    setIsSaving(true); setNotice('Mempublikasikan postingan…');
    const result = await createPost({ content: textContent, type: postType, privacy, location, mood: mood || null, taggedUserIds: taggedProfiles.map((item) => item.id), mediaUrls: media.map((item) => item.url), idempotencyKey });
    setIsSaving(false);
    if (!result.ok) { setNotice(result.error); return; }
    try { window.localStorage.removeItem(draftKey); } catch { /* optional cleanup */ }
    media.forEach((item) => URL.revokeObjectURL(item.preview));
    setTextContent(''); setLocation(''); setMood(''); setMedia([]); setTaggedProfiles([]);
    onCreated?.(result.duplicate ? 'Postingan ini sudah ada di feed Anda.' : 'Postingan berhasil dibagikan ke feed.'); onClose();
  }

  if (!open) return null;
  return <div className="create-post-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving && !isUploading) onClose(); }}>
    <section className="create-post-modal" role="dialog" aria-modal="true" aria-labelledby="create-post-modal-title" aria-busy={isSaving || isUploading}>
      <header className="create-post-header"><div><p className="create-post-kicker">SUKI COMMUNITY</p><h2 id="create-post-modal-title">Buat postingan</h2><p className="create-post-subtitle">Bagikan kabar yang bermanfaat untuk warga SultraKita.</p></div><button type="button" onClick={onClose} disabled={isSaving || isUploading} className="create-post-close" aria-label="Tutup buat postingan"><X size={20}/></button></header>
      <div className="create-post-scroll">
        <div className="create-post-author"><span className="create-post-avatar">{avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials(displayName)}</span><div className="create-post-author-copy"><strong>{displayName}</strong><span>Posting sebagai akun Anda</span></div><label className="create-post-audience"><span className="sr-only">Pilih audiens postingan</span><Globe2 size={14}/><select value={privacy} onChange={(event) => setPrivacy(event.target.value as Privacy)} aria-label="Privasi postingan"><option value="public">Publik</option><option value="followers">Pengikut</option></select><ChevronDown size={13}/></label></div>
        <div className="create-post-tabs" role="tablist" aria-label="Jenis konten"><button type="button" role="tab" aria-selected={postType === 'post'} onClick={() => setPostType('post')} className={postType === 'post' ? 'active' : ''}>Postingan biasa</button><button type="button" role="tab" aria-selected={postType === 'reel'} onClick={() => setPostType('reel')} className={postType === 'reel' ? 'active' : ''}>Reels</button></div>
        {draftRestored && <div className="create-post-draft" role="status"><span>Draft terakhir dipulihkan.</span><button type="button" onClick={() => { setTextContent(''); setLocation(''); setMood(''); setDraftRestored(false); }}>Hapus</button></div>}
        <div className="create-post-editor"><textarea autoFocus value={textContent} onChange={(event) => setTextContent(event.target.value.slice(0, MAX_CONTENT))} placeholder={postType === 'reel' ? 'Tambahkan keterangan untuk reel Anda…' : 'Apa yang sedang Anda pikirkan?'} maxLength={MAX_CONTENT} aria-label="Isi postingan" /><div className="create-post-counter"><span>{remaining < 200 ? `${remaining} karakter tersisa` : 'Tulis dengan nyaman — maksimal 2.000 karakter'}</span><span>{textContent.length}/{MAX_CONTENT}</span></div></div>
        {media.length > 0 && <div className="create-post-media-grid" aria-label="Media terpilih">{media.map((item, index) => <div key={`${item.url}-${index}`} className="create-post-media"><div className="create-post-media-preview">{item.type.startsWith('video/') ? <video src={item.preview} muted playsInline controls /> : <img src={item.preview} alt={`Pratinjau ${item.name}`} />}</div><button type="button" onClick={() => { URL.revokeObjectURL(item.preview); setMedia((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} aria-label={`Hapus ${item.name}`}><X size={14}/></button><span>{item.type.startsWith('video/') ? 'Video' : 'Foto'}</span></div>)}</div>}
        <div className="create-post-fields"><label><span><MapPin size={15}/> Lokasi <em>opsional</em></span><input id="post-location" value={location} onChange={(event) => setLocation(event.target.value.slice(0, 120))} placeholder="Contoh: Kendari, Sulawesi Tenggara" maxLength={120} /></label><div className="create-post-mood"><span><Music2 size={15}/> Mood atau aktivitas <em>opsional</em></span><div className="create-post-mood-list">{moods.map((item) => <button key={item} type="button" className={mood === item ? 'active' : ''} onClick={() => setMood(mood === item ? '' : item)} aria-pressed={mood === item}>{mood === item && <Check size={12}/>} {item}</button>)}</div></div><div className="create-post-tags"><label htmlFor="post-tag-search"><span><Tag size={15}/> Tag warga <em>maks. {MAX_TAGS}</em></span><div className="create-post-tag-input"><Search size={14}/><input id="post-tag-search" value={tagQuery} onChange={(event) => updateTagQuery(event.target.value)} placeholder="Cari nama atau username warga" autoComplete="off" /></div></label>{tagLoading && <small className="create-post-help">Mencari warga…</small>}{tagSuggestions.length > 0 && <div className="create-post-suggestions" role="listbox">{tagSuggestions.map((item) => <button type="button" role="option" key={item.id} onClick={() => addTag(item)}><span className="create-post-suggestion-avatar">{item.avatar_url ? <img src={item.avatar_url} alt="" /> : initials(item.display_name || item.username || 'Warga')}</span><span><strong>{item.display_name || item.username || 'Warga Sultra'}</strong><small>{item.username ? `@${item.username}` : item.district || 'Warga Sultra'}</small></span></button>)}</div>}{taggedProfiles.length > 0 && <div className="create-post-tagged-list" aria-label="Warga yang ditandai">{taggedProfiles.map((item) => <button type="button" key={item.id} onClick={() => setTaggedProfiles((current) => current.filter((tag) => tag.id !== item.id))} aria-label={`Hapus tag ${item.display_name || item.username}`}><span>@{item.username || (item.display_name || 'warga').replace(/\s+/g, '').toLowerCase()}</span><X size={12}/></button>)}</div>}</div></div>
        <div className="create-post-add"><p>Tambahkan ke postingan</p><div className="create-post-add-grid"><button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading || media.length >= MAX_MEDIA}><ImageIcon size={18}/> Foto / GIF</button><button type="button" onClick={() => { setPostType('reel'); fileRef.current?.click(); }} disabled={isUploading || media.length >= MAX_MEDIA}><Video size={18}/> Video / Reel</button><button type="button" onClick={() => document.getElementById('post-tag-search')?.focus()}><Users size={18}/> Tag warga</button><button type="button" onClick={() => document.querySelector('.create-post-mood-list button')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Music2 size={18}/> Mood</button></div><input ref={fileRef} type="file" accept="image/*,video/*" multiple className="sr-only" onChange={(event) => void handleFiles(event)} /><p className="create-post-help">Maksimal 4 media. Foto 20 MB, video 50 MB. Upload memakai signed URL.</p></div>
        {notice && <p className="create-post-notice" role="status">{notice}</p>}
      </div>
      <footer className="create-post-footer"><div className="create-post-audience-note"><Globe2 size={14}/><span><strong>{audienceLabel}</strong> · {audienceDescription}</span></div><div className="create-post-footer-actions"><button type="button" onClick={saveDraft} disabled={isSaving || isUploading} className="create-post-draft-button">Simpan Draft</button><button type="button" onClick={() => void submit()} disabled={!canPublish} className="create-post-publish">{isSaving ? 'Mempublikasikan…' : isUploading ? 'Mengunggah media…' : 'Publikasikan sekarang'}<ArrowUp size={15}/></button></div></footer>
    </section>
  </div>;
}
