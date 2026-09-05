'use client';

import { ImagePlus, Video } from 'lucide-react';

type CreatePostInputProps = { userName?: string; avatarUrl?: string | null; onOpen?: (mode: 'post' | 'media' | 'listing') => void };
export function CreatePostInput({ userName = 'Warga SultraKita', avatarUrl, onOpen }: CreatePostInputProps) {
  const initials = userName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  return <section className="rounded-xl bg-white p-3 shadow-sm dark:bg-sultra-dark sm:p-4" aria-label="Buat postingan"><div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-sultra-teal text-xs font-semibold text-white">{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover"/> : initials}</div><button onClick={() => onOpen?.('post')} className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-left text-sm text-gray-500 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-sultra-teal dark:bg-sultra-forest/20 dark:text-sultra-sand/70 dark:hover:bg-sultra-forest/30">Apa yang Anda pikirkan, {userName.split(' ')[0]}?</button></div><div className="mt-3 grid grid-cols-2 divide-x border-t border-gray-100 pt-3 dark:border-sultra-forest/30"><button onClick={() => onOpen?.('media')} className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-sultra-teal transition-colors hover:bg-sultra-mint/30"><Video size={18}/> Video warga</button><button onClick={() => onOpen?.('media')} className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-sultra-teal transition-colors hover:bg-sultra-mint/30"><ImagePlus size={18}/> Foto / video</button></div></section>;
}
