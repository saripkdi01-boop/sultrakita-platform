'use client';

import { ImagePlus, MapPin, PenLine, Video } from 'lucide-react';
import { useSessionProfile } from '@/hooks/useSessionProfile';

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export function CreatePostInput({ onCreate }: { onCreate?: (type?: 'post' | 'reel') => void }) {
  const { user, profile } = useSessionProfile();
  const displayName = profile?.full_name || user?.email || 'Pengguna SultraKita';
  const avatarUrl = profile?.avatar_url;
  return <section className="beranda-create-post" aria-label="Buat postingan"><div className="mb-3 flex items-center gap-3"><span className="beranda-avatar ring-4 ring-teal-50">{avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials(displayName)}</span><button type="button" onClick={() => onCreate?.('post')} className="flex min-h-11 flex-1 items-center rounded-full bg-slate-100 px-4 text-left text-sm text-slate-500 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-100">Apa yang ingin Anda bagikan, {displayName.split(/\s+/)[0]}?</button><button type="button" onClick={() => onCreate?.('post')} className="hidden h-10 w-10 place-items-center rounded-full bg-teal-50 text-teal-700 transition hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-100 sm:grid" aria-label="Tulis postingan"><PenLine size={17}/></button></div><div className="grid grid-cols-3 divide-x border-t border-slate-100 pt-3"><button type="button" onClick={() => onCreate?.('post')} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"><ImagePlus size={17}/> Foto</button><button type="button" onClick={() => onCreate?.('reel')} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500"><Video size={17}/> Reel</button><button type="button" onClick={() => onCreate?.('post')} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"><MapPin size={17}/> Lokasi</button></div></section>;
}
