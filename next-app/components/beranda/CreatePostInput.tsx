'use client';

import { ImagePlus, MapPin, Video } from 'lucide-react';
import { useSessionProfile } from '@/hooks/useSessionProfile';

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function CreatePostInput({ onCreate }: { onCreate?: () => void }) {
  const { user, profile } = useSessionProfile();
  const displayName = profile?.full_name || user?.email || 'Pengguna SultraKita';
  const avatarUrl = profile?.avatar_url;
  return <section className="beranda-create-post">
    <div className="beranda-create-row">
      <span className="beranda-avatar">{avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials(displayName)}</span>
      <button onClick={onCreate}>Apa yang Anda pikirkan, {displayName.split(/\s+/)[0]}?</button>
    </div>
    <div className="beranda-create-actions"><button onClick={onCreate}><ImagePlus size={17}/> Foto</button><button onClick={onCreate}><Video size={17}/> Reels</button><button onClick={onCreate}><MapPin size={17}/> Lokasi</button></div>
  </section>;
}
