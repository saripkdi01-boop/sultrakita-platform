'use client';

import { useState } from 'react';
import { StoryCard, type StoryItem } from './StoryCard';

type StoriesSectionProps = { stories?: StoryItem[]; onCreate?: () => void; onOpen?: (story: StoryItem) => void };
const defaultStories: StoryItem[] = [
  { id: 'wakatobi', userName: 'Aulia Wakatobi', avatar: 'AW', label: 'Wisata lokal' },
  { id: 'umkm', userName: 'UMKM Sultra', avatar: 'US', label: 'Karya warga' },
  { id: 'kuliner', userName: 'Kuliner Kendari', avatar: 'KK', label: 'Rasa dekat' },
  { id: 'buton', userName: 'Cerita Buton', avatar: 'CB', label: 'Budaya lokal' },
];
export function StoriesSection({ stories = defaultStories, onCreate, onOpen }: StoriesSectionProps) {
  const [activePreview, setActivePreview] = useState<StoryItem | null>(null);
  function openStory(story: StoryItem) { setActivePreview(story); onOpen?.(story); }
  return <section className="rounded-xl bg-white py-3 shadow-sm dark:bg-sultra-dark" aria-label="Stories dan Reels"><div className="mb-2 flex items-center justify-between px-4"><h2 className="text-sm font-semibold text-gray-900 dark:text-sultra-sand">Stories & Reels</h2><button onClick={() => document.getElementById('reels')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-medium text-sultra-teal">Lihat semua</button></div><div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 scroll-smooth"><StoryCard create onClick={onCreate}/>{stories.map(story => <StoryCard key={story.id} story={story} onClick={() => openStory(story)}/>)}</div>{activePreview && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-5" role="dialog" aria-label={`Story ${activePreview.userName}`} onClick={() => setActivePreview(null)}><div className="relative h-[min(78vh,560px)] w-[min(90vw,360px)] rounded-2xl bg-gradient-to-br from-sultra-teal to-sultra-forest p-5 text-white shadow-2xl" onClick={event => event.stopPropagation()}><button className="absolute right-3 top-3 rounded-full bg-black/25 px-3 py-1" onClick={() => setActivePreview(null)} aria-label="Tutup story">×</button><div className="flex h-full flex-col justify-end"><span className="mb-2 text-xs opacity-80">Story warga</span><h3 className="text-xl font-semibold">{activePreview.userName}</h3><p className="mt-1 text-sm opacity-80">{activePreview.label || 'Cerita terbaru dari Sulawesi Tenggara.'}</p></div></div></div>}</section>;
}
