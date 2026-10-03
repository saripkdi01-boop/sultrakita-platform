'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Check, Globe2, ImagePlus, Loader2, MapPin, Smile, Tag, Users, X } from 'lucide-react';
import { createPost, searchProfiles } from '@/lib/actions/posts';
import { createR2Upload } from '@/actions/upload';
import { trapFocus } from '@/components/ui/a11y';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { usePreferences } from '@/lib/preferences';
import { getBerandaLabels, fmtLabel } from '@/lib/i18n/dict-beranda';
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
const moodLabelKey: Record<Mood, string> = {
  'Merayakan': 'brMoodCelebrate',
  'Merasa bersyukur': 'brMoodGrateful',
  'Senang': 'brMoodHappy',
  'Sedih': 'brMoodSad',
  'Bersemangat': 'brMoodExcited',
  'Mencari rekomendasi': 'brMoodSeek',
};

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const formatId = (value: number) => new Intl.NumberFormat('id-ID').format(value);

export function CreatePostModal({ open, initialType = 'post', onClose, onCreated }: Props) {
  const { user, profile } = useSessionProfile();
  const { language } = usePreferences();
  const b = getBerandaLabels(language);
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
      setNotice(fmtLabel(b.brMaxMedia, { max: MAX_MEDIA }));
      return;
    }
    setIsUploading(true);
    setSubmitError('');
    setNotice(b.brUploading);
    try {
      const uploaded: UploadedMedia[] = [];
      for (const file of selected) {
        const isVideo = file.type.startsWith('video/');
        if (!file.type.startsWith('image/') && !isVideo) throw new Error(b.brPickMedia);
        const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
        if (file.size > maxBytes) {
          throw new Error(fmtLabel(b.brFileTooLarge, { name: file.name, max: isVideo ? '50 MB' : '20 MB' }));
        }
        // Upload memakai signed URL R2 (presigned POST) — alur yang sudah ada.
        const result = await createR2Upload({ fileName: file.name, contentType: file.type, size: file.size });
        const form = new FormData();
        Object.entries(result.fields).forEach(([key, value]) => form.append(key, String(value)));
        form.append('file', file);
        const response = await fetch(result.url, { method: 'POST', body: form });
        if (!response.ok) throw new Error(fmtLabel(b.brUploadFailed, { name: file.name, status: response.status }));
        uploaded.push({ url: result.publicUrl, name: file.name, type: file.type, preview: URL.createObjectURL(file) });
      }
      setMedia((current) => [...current, ...uploaded]);
      setNotice(fmtLabel(b.brMediaReady, { count: uploaded.length }));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : b.brMediaFail);
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
      setNotice(b.brDraftSaved);
    } catch {
      setNotice(b.brDraftSaveFail);
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
    setNotice(b.brDraftDiscarded);
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
      setNotice(fmtLabel(b.brMaxTags, { max: MAX_TAGS }));
      return;
    }
    setTaggedProfiles((current) => [...current, profileToAdd]);
    setTagQuery('');
    setTagSuggestions([]);
  }

  async function submit() {
    if (busyRef.current) return;
    if (!user) {
      setSubmitError(b.brLoginToPost);
      return;
    }
    if (!canPublish) {
      setSubmitError(
        trimmedContent.length < 2 && !media.length
          ? b.brMinContent
          : b.brPostBusy,
      );
      return;
    }
    if (postType === 'reel' && !media.some((item) => item.type.startsWith('video/'))) {
      setSubmitError(b.brReelNeedsVideo);
      return;
    }
    setIsSaving(true);
    setSubmitError('');
    setNotice(b.brPublishingPost);
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
    onCreated?.(result.duplicate ? b.brPostDup : b.brPostOk);
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

  const title = postType === 'reel' ? b.brReelTitle : b.brPostTitle;

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
            <div className="skc-type-tabs" role="tablist" aria-label={b.brContentType}>
              <button
                type="button"
                role="tab"
                aria-selected={postType === 'post'}
                onClick={() => setPostType('post')}
              >
                {b.brTabPost}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={postType === 'reel'}
                onClick={() => setPostType('reel')}
              >
                {b.brTabReel}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving || isUploading}
            className="skc-icon-btn"
            aria-label={b.brCloseComposer}
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
                <span className="sr-only">{b.brPostPrivacy}</span>
                <select
                  value={privacy}
                  onChange={(event) => setPrivacy(event.target.value as Privacy)}
                  aria-label={b.brPostPrivacy}
                >
                  <option value="public">{b.brPrivacyPublic}</option>
                  <option value="followers">{b.brPrivacyFollowers}</option>
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
                ? b.brReelPh
                : b.brComposerPh
            }
            maxLength={MAX_CONTENT}
            aria-label={b.brWriteStory}
            className="skc-textarea"
          />
          <div className={`skc-counter${remaining < 100 ? ' is-low' : ''}`} aria-live="off">
            {formatId(textContent.length)} / {formatId(MAX_CONTENT)}
          </div>

          {draftRestored && (
            <div className="skc-draft-banner" role="status">
              <span>{b.brDraftRestored}</span>
              <button type="button" onClick={discardDraft}>
                {b.brDiscard}
              </button>
            </div>
          )}

          {media.length > 0 && (
            <div className="skc-media-grid" aria-label={b.brMediaSelected}>
              {media.map((item, index) => (
                <div key={`${item.url}-${index}`} className="skc-media-item">
                  {item.type.startsWith('video/') ? (
                    <video src={item.preview} muted playsInline aria-label={fmtLabel(b.brPreviewVideo, { name: item.name })} />
                  ) : (
                    <img src={item.preview} alt={fmtLabel(b.brPreviewImg, { name: item.name })} />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="skc-media-remove"
                    aria-label={fmtLabel(b.brRemoveMedia, { name: item.name })}
                  >
                    <X size={14} />
                  </button>
                  <span className="skc-media-kind">{item.type.startsWith('video/') ? b.brMediaVideo : b.brMediaPhoto}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progressive disclosure: satu baris ikon */}
          <div className="skc-disclosure" role="toolbar" aria-label={b.brPostExtras}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading || media.length >= MAX_MEDIA}
              className={`skc-icon-btn${media.length > 0 ? ' is-active' : ''}`}
              aria-label={b.brAddMedia}
            >
              <ImagePlus size={20} />
              {media.length > 0 && <span className="skc-dot" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => togglePanel('lokasi')}
              className={`skc-icon-btn${location.trim() ? ' is-active' : ''}`}
              aria-label={b.brAddLocation}
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
              aria-label={b.brAddMood}
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
              aria-label={b.brTagPeople}
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
                <MapPin size={15} aria-hidden="true" /> {b.brLocationTitle} <em>{b.brOptional}</em>
              </p>
              <input
                id="post-location"
                value={location}
                onChange={(event) => setLocation(event.target.value.slice(0, MAX_LOCATION))}
                placeholder={b.brLocationPh}
                maxLength={MAX_LOCATION}
                className="skc-input"
                autoComplete="off"
              />
            </div>
          )}

          {panel === 'mood' && (
            <div className="skc-panel" id="skc-panel-mood">
              <p className="skc-panel-title">
                <Smile size={15} aria-hidden="true" /> {b.brMoodTitle} <em>{b.brOptional}</em>
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
                    {b[moodLabelKey[item]]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === 'tag' && (
            <div className="skc-panel" id="skc-panel-tag">
              <p className="skc-panel-title">
                <Tag size={15} aria-hidden="true" /> {b.brTagPeople} <em>{fmtLabel(b.brMaxCount, { max: MAX_TAGS })}</em>
              </p>
              <input
                value={tagQuery}
                onChange={(event) => updateTagQuery(event.target.value)}
                placeholder={b.brSearchPeoplePh}
                autoComplete="off"
                className="skc-input"
                aria-label={b.brSearchPeopleAria}
              />
              {tagLoading && (
                <p className="skc-help" role="status">
                  {b.brSearchingPeople}
                </p>
              )}
              {tagSuggestions.length > 0 && (
                <div className="skc-suggestions" role="listbox" aria-label={b.brSearchResults}>
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
                          initials(item.display_name || item.username || b.brResident)
                        )}
                      </span>
                      <span>
                        <strong>{item.display_name || item.username || b.brSultraResident}</strong>
                        <small>{item.username ? `@${item.username}` : item.district || b.brSultraResident}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {taggedProfiles.length > 0 && (
                <div className="skc-tagged" aria-label={b.brTaggedList}>
                  {taggedProfiles.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTaggedProfiles((current) => current.filter((tag) => tag.id !== item.id))}
                      aria-label={fmtLabel(b.brUntag, { name: item.display_name || item.username || b.brResident })}
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
            {fmtLabel(b.brUploadHelp, { maxMedia: MAX_MEDIA, maxImageMB: formatId(MAX_IMAGE_BYTES / 1024 / 1024), maxVideoMB: formatId(MAX_VIDEO_BYTES / 1024 / 1024) })}
          </p>

          {submitError && (
            <div className="skc-error" role="alert" aria-live="assertive">
              <span>{submitError}</span>
              <button type="button" onClick={() => void submit()} className="skc-retry" disabled={isSaving || isUploading}>
                {isSaving ? b.brSending : b.brRetry}
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
            {b.brSaveDraft}
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!canPublish}
            className="skc-publish"
            aria-label={isSaving ? b.brPublishingAria : b.brPublishNow}
          >
            {isSaving || isUploading ? <Loader2 size={16} className="skc-spin" aria-hidden="true" /> : <ArrowUp size={16} aria-hidden="true" />}
            {isSaving ? b.brPublishing : isUploading ? b.brUploading : b.brPublishNow}
          </button>
        </footer>
      </section>
    </div>
  );
}
