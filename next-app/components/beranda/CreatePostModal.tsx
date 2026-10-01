'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Check, Globe2, ImagePlus, Loader2, MapPin, Smile, Tag, Users, X } from 'lucide-react';
import { createPost, searchProfiles } from '@/lib/actions/posts';
import { createR2Upload } from '@/actions/upload';
import { trapFocus } from '@/components/ui/a11y';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import './composer.css';

type Privacy = 'public' | 'followers';
type PostType = 'post' | 'reel';
type Mood = 'Merayakan' | 'Merasa bersyukur' | 'Senang' | 'Sedih' | 'Bersemangat' | 'Mencari rekomendasi';
type UploadedMedia = { url: string; name: string; type: string; preview: string };
type TagProfile = { id: string; display_name: string | null; username: string | null; avatar_url: string | null; district: string | null };
type Props = { open: boolean; initialType?: PostType; onClose: () => void; onCreated?: (message: string) => void };
type Panel = 'lokasi' | 'mood' | 'tag' | null;

const MAX_CONTENT = 2000;
const MAX_LOCATION = 120;
const MAX_MEDIA = 4;
const MAX_TAGS = 10;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const draftKey = 'suki-create-post-draft';
const moods: Mood[] = ['Merayakan', 'Merasa bersyukur', 'Senang', 'Sedih', 'Bersemangat', 'Mencari rekomendasi'];

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const formatId = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export function CreatePostModal({ open, initialType = 'post', onClose, onCreated }: Props) {
  const { user, profile } = useSessionProfile();
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [location, setLocation] = useState('');
  const [postType, setPostType] = useState<PostType>(initialType);
  const [mood, setMood] = useState<Mood | ''>('');
  const [panel, setPanel] = useState<Panel>(null);
  const [notice, setNotice] = useState('');
  const [submitError, setSubmitError] = useState('');
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(false);
  const tagTimer = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  busyRef.current = isSaving || isUploading;

  const displayName = getProfileNickname(user, profile);
  const avatarUrl = profile?.avatar_url;
  const trimmedContent = textContent.trim();
  const canPublish = (trimmedContent.length >= 2 || media.length > 0) && !isSaving && !isUploading;
  const remaining = MAX_CONTENT - textContent.length;

  // Mount/unmount dengan animasi masuk-keluar (sheet mobile, dialog desktop).
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setMounted(true);
      const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(() => setShown(true)));
      return () => window.cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
      // Kembalikan fokus ke pemicu saat dialog ditutup.
      triggerRef.current?.focus?.();
      triggerRef.current = null;
    }, 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Focus trap ringan: Tab berputar di dalam dialog agar fokus tidak bocor
  // ke konten di belakang overlay (Esc + kembalikan fokus sudah ada).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const sheet = sheetRef.current;
      if (sheet) trapFocus(sheet, event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Reset + pulihkan draft + kunci scroll + Esc saat dibuka.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPostType(initialType);
    setNotice('');
    setSubmitError('');
    setPanel(null);
    setDraftRestored(false);
    setIdempotencyKey(window.crypto.randomUUID());
    setTagQuery('');
    setTagSuggestions([]);
    setTaggedProfiles([]);
    setMood('');
    setMedia([]);
    try {
      const draft = JSON.parse(window.localStorage.getItem(draftKey) || 'null');
      if (draft && typeof draft === 'object' && typeof draft.content === 'string' && draft.content.trim()) {
        setTextContent(draft.content.slice(0, MAX_CONTENT));
        setLocation(typeof draft.location === 'string' ? draft.location : '');
        setPrivacy(draft.privacy === 'followers' ? 'followers' : 'public');
        setMood(moods.includes(draft.mood) ? draft.mood : '');
        setDraftRestored(true);
      } else {
        setTextContent('');
        setLocation('');
        setPrivacy('public');
      }
    } catch {
      /* draft bersifat opsional */
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyRef.current) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (tagTimer.current) window.clearTimeout(tagTimer.current);
    };
  }, [initialType, onClose, open]);

  // Draft otomatis tersimpan (debounce) — perilaku restore saat dibuka dipertahankan.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      try {
        if (textContent.trim() || location.trim() || mood) {
          window.localStorage.setItem(
            draftKey,
            JSON.stringify({ content: textContent, location, privacy, mood, savedAt: new Date().toISOString() }),
          );
        } else {
          window.localStorage.removeItem(draftKey);
        }
      } catch {
        /* penyimpanan draft bersifat opsional */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [open, textContent, location, privacy, mood]);

  // Textarea auto-grow.
  const autosize = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 320)}px`;
  }, []);

  useEffect(() => {
    if (mounted) autosize();
  }, [mounted, textContent, autosize]);

  function togglePanel(next: Exclude<Panel, null>) {
    setPanel((current) => (current === next ? null : next));
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (!selected.length) return;
    if (media.length + selected.length > MAX_MEDIA) {
      setNotice(`Maksimal ${MAX_MEDIA} media per postingan.`);
      return;
    }
    setIsUploading(true);
    setSubmitError('');
    setNotice('Mengunggah media…');
    try {
      const uploaded: UploadedMedia[] = [];
      for (const file of selected) {
        const isVideo = file.type.startsWith('video/');
        if (!file.type.startsWith('image/') && !isVideo) throw new Error('Pilih file gambar atau video.');
        const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
        if (file.size > maxBytes) {
          throw new Error(`"${file.name}" terlalu besar. Maksimal ${isVideo ? '50 MB' : '20 MB'}.`);
        }
        // Upload memakai signed URL R2 (presigned POST) — alur yang sudah ada.
        const result = await createR2Upload({ fileName: file.name, contentType: file.type, size: file.size });
        const form = new FormData();
        Object.entries(result.fields).forEach(([key, value]) => form.append(key, String(value)));
        form.append('file', file);
        const response = await fetch(result.url, { method: 'POST', body: form });
        if (!response.ok) throw new Error(`Upload ${file.name} gagal (${response.status}).`);
        uploaded.push({ url: result.publicUrl, name: file.name, type: file.type, preview: URL.createObjectURL(file) });
      }
      setMedia((current) => [...current, ...uploaded]);
      setNotice(`${uploaded.length} media siap dipublikasikan.`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Media gagal diunggah.');
    } finally {
      setIsUploading(false);
    }
  }

  function removeMedia(index: number) {
    setMedia((current) => {
      const target = current[index];
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({ content: textContent, location, privacy, mood, savedAt: new Date().toISOString() }),
      );
      setNotice('Draft tersimpan di perangkat ini.');
    } catch {
      setNotice('Draft tidak dapat disimpan di perangkat ini.');
    }
  }

  function discardDraft() {
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      /* opsional */
    }
    setTextContent('');
    setLocation('');
    setMood('');
    setDraftRestored(false);
    setNotice('Draft dibuang.');
  }

  function updateTagQuery(value: string) {
    setTagQuery(value);
    setTagSuggestions([]);
    if (tagTimer.current) window.clearTimeout(tagTimer.current);
    if (value.trim().length < 2) return;
    tagTimer.current = window.setTimeout(async () => {
      setTagLoading(true);
      const result = await searchProfiles(value);
      setTagLoading(false);
      if (result.ok) {
        setTagSuggestions(
          result.data.filter((item) => item.id !== user?.id && !taggedProfiles.some((tag) => tag.id === item.id)),
        );
      }
    }, 280);
  }

  function addTag(profileToAdd: TagProfile) {
    if (taggedProfiles.length >= MAX_TAGS) {
      setNotice(`Maksimal ${MAX_TAGS} warga dapat ditandai.`);
      return;
    }
    setTaggedProfiles((current) => [...current, profileToAdd]);
    setTagQuery('');
    setTagSuggestions([]);
  }

  async function submit() {
    if (busyRef.current) return;
    if (!user) {
      setSubmitError('Silakan login terlebih dahulu untuk membuat postingan.');
      return;
    }
    if (!canPublish) {
      setSubmitError(
        trimmedContent.length < 2 && !media.length
          ? 'Tulis minimal 2 karakter atau tambahkan media.'
          : 'Postingan sedang diproses, tunggu sebentar.',
      );
      return;
    }
    if (postType === 'reel' && !media.some((item) => item.type.startsWith('video/'))) {
      setSubmitError('Reel membutuhkan setidaknya satu video. Tambahkan video dulu ya.');
      return;
    }
    setIsSaving(true);
    setSubmitError('');
    setNotice('Mempublikasikan postingan…');
    const result = await createPost({
      content: textContent,
      type: postType,
      privacy,
      location,
      mood: mood || null,
      taggedUserIds: taggedProfiles.map((item) => item.id),
      mediaUrls: media.map((item) => item.url),
      idempotencyKey,
    });
    setIsSaving(false);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    try {
      window.localStorage.removeItem(draftKey);
    } catch {
      /* pembersihan draft bersifat opsional */
    }
    media.forEach((item) => URL.revokeObjectURL(item.preview));
    setTextContent('');
    setLocation('');
    setMood('');
    setMedia([]);
    setTaggedProfiles([]);
    onCreated?.(result.duplicate ? 'Postingan ini sudah ada di feed Anda.' : 'Postingan berhasil dibagikan ke feed.');
    onClose();
  }

  // Swipe-to-dismiss (sheet mobile): tarik ke bawah dari area header.
  function onSwipeStart(event: React.TouchEvent) {
    swipeStartY.current = event.touches[0]?.clientY ?? null;
  }

  function onSwipeMove(event: React.TouchEvent) {
    if (swipeStartY.current == null || busyRef.current) return;
    const deltaY = (event.touches[0]?.clientY ?? swipeStartY.current) - swipeStartY.current;
    if (deltaY > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      sheetRef.current.style.opacity = `${Math.max(0.4, 1 - deltaY / 400)}`;
    }
  }

  function onSwipeEnd(event: React.TouchEvent) {
    if (swipeStartY.current == null) return;
    const endY = event.changedTouches[0]?.clientY ?? swipeStartY.current;
    const deltaY = endY - swipeStartY.current;
    swipeStartY.current = null;
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      sheetRef.current.style.opacity = '';
    }
    if (deltaY > 96 && !busyRef.current) onClose();
  }

  if (!mounted) return null;

  const title = postType === 'reel' ? 'Buat reel' : 'Buat postingan';

  return (
    <div
      className={`skc-overlay${shown ? ' is-shown' : ''}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busyRef.current) onClose();
      }}
    >
      <section
        ref={sheetRef}
        className="skc-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skc-title"
        aria-busy={isSaving || isUploading}
      >
        <div
          className="skc-drag"
          aria-hidden="true"
          onTouchStart={onSwipeStart}
          onTouchMove={onSwipeMove}
          onTouchEnd={onSwipeEnd}
        />
        <header
          className="skc-header"
          onTouchStart={onSwipeStart}
          onTouchMove={onSwipeMove}
          onTouchEnd={onSwipeEnd}
        >
          <div className="skc-header-title">
            <h2 id="skc-title" className="skc-title">
              {title}
            </h2>
            <div className="skc-type-tabs" role="tablist" aria-label="Jenis konten">
              <button
                type="button"
                role="tab"
                aria-selected={postType === 'post'}
                onClick={() => setPostType('post')}
              >
                Postingan
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={postType === 'reel'}
                onClick={() => setPostType('reel')}
              >
                Reel
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isUploading}
            className="skc-icon-btn"
            aria-label="Tutup composer"
          >
            <X size={20} />
          </button>
        </header>

        <div className="skc-body">
          <div className="skc-author">
            <span className="skc-author-avatar" aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initials(displayName)}
            </span>
            <div>
              <div className="skc-author-name">{displayName}</div>
              <label className="skc-privacy">
                <Globe2 size={13} aria-hidden="true" />
                <span className="sr-only">Privasi postingan</span>
                <select
                  value={privacy}
                  onChange={(event) => setPrivacy(event.target.value as Privacy)}
                  aria-label="Privasi postingan"
                >
                  <option value="public">Publik</option>
                  <option value="followers">Pengikut</option>
                </select>
              </label>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            autoFocus
            value={textContent}
            onChange={(event) => setTextContent(event.target.value.slice(0, MAX_CONTENT))}
            placeholder={
              postType === 'reel'
                ? 'Ceritakan tentang reel ini…'
                : 'Ceritakan kabar Sultra hari ini…'
            }
            maxLength={MAX_CONTENT}
            aria-label="Tulis cerita"
            className="skc-textarea"
          />
          <div className={`skc-counter${remaining < 100 ? ' is-low' : ''}`} aria-live="off">
            {formatId(textContent.length)} / {formatId(MAX_CONTENT)}
          </div>

          {draftRestored && (
            <div className="skc-draft-banner" role="status">
              <span>Draft terakhir dipulihkan otomatis.</span>
              <button type="button" onClick={discardDraft}>
                Buang
              </button>
            </div>
          )}

          {media.length > 0 && (
            <div className="skc-media-grid" aria-label="Media terpilih">
              {media.map((item, index) => (
                <div key={`${item.url}-${index}`} className="skc-media-item">
                  {item.type.startsWith('video/') ? (
                    <video src={item.preview} muted playsInline aria-label={`Pratinjau video ${item.name}`} />
                  ) : (
                    <img src={item.preview} alt={`Pratinjau ${item.name}`} />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="skc-media-remove"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <X size={14} />
                  </button>
                  <span className="skc-media-kind">{item.type.startsWith('video/') ? 'Video' : 'Foto'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progressive disclosure: satu baris ikon */}
          <div className="skc-disclosure" role="toolbar" aria-label="Tambahan postingan">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading || media.length >= MAX_MEDIA}
              className={`skc-icon-btn${media.length > 0 ? ' is-active' : ''}`}
              aria-label="Tambah foto atau video"
            >
              <ImagePlus size={20} />
              {media.length > 0 && <span className="skc-dot" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => togglePanel('lokasi')}
              className={`skc-icon-btn${location.trim() ? ' is-active' : ''}`}
              aria-label="Tambah lokasi"
              aria-expanded={panel === 'lokasi'}
              aria-controls="skc-panel-lokasi"
            >
              <MapPin size={20} />
              {location.trim() && <span className="skc-dot" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => togglePanel('mood')}
              className={`skc-icon-btn${mood ? ' is-active' : ''}`}
              aria-label="Tambah mood"
              aria-expanded={panel === 'mood'}
              aria-controls="skc-panel-mood"
            >
              <Smile size={20} />
              {mood && <span className="skc-dot" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => togglePanel('tag')}
              className={`skc-icon-btn${taggedProfiles.length > 0 ? ' is-active' : ''}`}
              aria-label="Tandai warga"
              aria-expanded={panel === 'tag'}
              aria-controls="skc-panel-tag"
            >
              <Users size={20} />
              {taggedProfiles.length > 0 && <span className="skc-dot" aria-hidden="true" />}
            </button>
          </div>

          {panel === 'lokasi' && (
            <div className="skc-panel" id="skc-panel-lokasi">
              <p className="skc-panel-title">
                <MapPin size={15} aria-hidden="true" /> Lokasi <em>opsional</em>
              </p>
              <input
                id="post-location"
                value={location}
                onChange={(event) => setLocation(event.target.value.slice(0, MAX_LOCATION))}
                placeholder="Contoh: Kendari, Sulawesi Tenggara"
                maxLength={MAX_LOCATION}
                className="skc-input"
                autoComplete="off"
              />
            </div>
          )}

          {panel === 'mood' && (
            <div className="skc-panel" id="skc-panel-mood">
              <p className="skc-panel-title">
                <Smile size={15} aria-hidden="true" /> Mood <em>opsional</em>
              </p>
              <div className="skc-mood-list">
                {moods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="skc-mood-chip"
                    aria-pressed={mood === item}
                    onClick={() => setMood(mood === item ? '' : item)}
                  >
                    {mood === item && <Check size={12} aria-hidden="true" />}
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === 'tag' && (
            <div className="skc-panel" id="skc-panel-tag">
              <p className="skc-panel-title">
                <Tag size={15} aria-hidden="true" /> Tandai warga <em>maks. {MAX_TAGS}</em>
              </p>
              <input
                value={tagQuery}
                onChange={(event) => updateTagQuery(event.target.value)}
                placeholder="Cari nama atau username warga"
                autoComplete="off"
                className="skc-input"
                aria-label="Cari warga untuk ditandai"
              />
              {tagLoading && (
                <p className="skc-help" role="status">
                  Mencari warga…
                </p>
              )}
              {tagSuggestions.length > 0 && (
                <div className="skc-suggestions" role="listbox" aria-label="Hasil pencarian warga">
                  {tagSuggestions.map((item) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected="false"
                      key={item.id}
                      onClick={() => addTag(item)}
                      className="skc-suggestion"
                    >
                      <span className="skc-suggestion-avatar" aria-hidden="true">
                        {item.avatar_url ? (
                          <img src={item.avatar_url} alt="" />
                        ) : (
                          initials(item.display_name || item.username || 'Warga')
                        )}
                      </span>
                      <span>
                        <strong>{item.display_name || item.username || 'Warga Sultra'}</strong>
                        <small>{item.username ? `@${item.username}` : item.district || 'Warga Sultra'}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {taggedProfiles.length > 0 && (
                <div className="skc-tagged" aria-label="Warga yang ditandai">
                  {taggedProfiles.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTaggedProfiles((current) => current.filter((tag) => tag.id !== item.id))}
                      aria-label={`Hapus tanda untuk ${item.display_name || item.username}`}
                      className="skc-tag-chip"
                    >
                      <span>@{item.username || (item.display_name || 'warga').replace(/\s+/g, '').toLowerCase()}</span>
                      <X size={12} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(event) => void handleFiles(event)}
            aria-hidden="true"
            tabIndex={-1}
          />
          <p className="skc-help">
            Maksimal {MAX_MEDIA} media · foto {formatId(MAX_IMAGE_BYTES / 1024 / 1024)} MB · video{' '}
            {formatId(MAX_VIDEO_BYTES / 1024 / 1024)} MB · upload memakai signed URL.
          </p>

          {submitError && (
            <div className="skc-error" role="alert" aria-live="assertive">
              <span>{submitError}</span>
              <button type="button" onClick={() => void submit()} className="skc-retry" disabled={isSaving || isUploading}>
                {isSaving ? 'Mengirim…' : 'Coba lagi'}
              </button>
            </div>
          )}
          {notice && !submitError && (
            <p className="skc-notice" role="status" aria-live="polite">
              {notice}
            </p>
          )}
        </div>

        <footer className="skc-footer">
          <button
            type="button"
            onClick={saveDraft}
            disabled={isSaving || isUploading}
            className="skc-draft-btn"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!canPublish}
            className="skc-publish"
            aria-label={isSaving ? 'Sedang mempublikasikan' : 'Publikasikan sekarang'}
          >
            {isSaving || isUploading ? <Loader2 size={16} className="skc-spin" aria-hidden="true" /> : <ArrowUp size={16} aria-hidden="true" />}
            {isSaving ? 'Mempublikasikan…' : isUploading ? 'Mengunggah media…' : 'Publikasikan sekarang'}
          </button>
        </footer>
      </section>
    </div>
  );
}
