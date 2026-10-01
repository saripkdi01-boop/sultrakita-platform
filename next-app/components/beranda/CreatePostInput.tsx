'use client';

import { ImagePlus, Video } from 'lucide-react';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
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
  const displayName = getProfileNickname(user, profile);
  const avatarUrl = profile?.avatar_url;
  return (
    <section className="skc-trigger" aria-label="Buat postingan">
      <span className="skc-trigger-avatar" aria-hidden="true">
        {avatarUrl ? <img src={avatarUrl} alt="" /> : initials(displayName)}
      </span>
      <button
        type="button"
        onClick={() => onCreate?.('post')}
        className="skc-trigger-pill"
        aria-label={`Buat postingan sebagai ${displayName}`}
      >
        Ceritakan kabar Sultra hari ini…
      </button>
      <div className="skc-trigger-actions">
        <button
          type="button"
          onClick={() => onCreate?.('post')}
          className="skc-icon-btn"
          aria-label="Tambah foto ke postingan"
        >
          <ImagePlus size={20} />
        </button>
        <button
          type="button"
          onClick={() => onCreate?.('reel')}
          className="skc-icon-btn"
          aria-label="Buat reel video"
        >
          <Video size={20} />
        </button>
      </div>
    </section>
  );
}
