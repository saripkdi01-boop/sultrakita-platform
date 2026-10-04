'use client';

import { ImagePlus, Video } from 'lucide-react';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { usePreferences } from '@/lib/preferences';
import { getBerandaLabels, fmtLabel } from '@/lib/i18n/dict-beranda';
import './composer.css';

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

/**
 * Pemicu composer inline ala "Apa yang terjadi?":
 * avatar + pil placeholder + aksi media. Posting biasa via pil,
 * aksi video membuka composer tipe reel (dikunci contract test).
 */
export function CreatePostInput({ onCreate }: { onCreate?: (type?: 'post' | 'reel') => void }) {
  const { user, profile } = useSessionProfile();
  const { language } = usePreferences();
  const b = getBerandaLabels(language);
  const displayName = getProfileNickname(user, profile);
  const avatarUrl = profile?.avatar_url;
  return (
    <section className="skc-trigger" aria-label={b.brCreatePost}>
      <span className="skc-trigger-avatar" aria-hidden="true">
        {avatarUrl ? <img src={avatarUrl} alt="" /> : initials(displayName)}
      </span>
      <button
        type="button"
        onClick={() => onCreate?.('post')}
        className="skc-trigger-pill"
        aria-label={fmtLabel(b.brCreatePostAs, { name: displayName })}
      >
        {b.brComposerPh}
      </button>
      <div className="skc-trigger-actions">
        <button
          type="button"
          onClick={() => onCreate?.('post')}
          className="skc-icon-btn"
          aria-label={b.brAddPhoto}
        >
          <ImagePlus size={20} />
        </button>
        <button
          type="button"
          onClick={() => onCreate?.('reel')}
          className="skc-icon-btn"
          aria-label={b.brReelAria}
        >
          <Video size={20} />
        </button>
      </div>
    </section>
  );
}
