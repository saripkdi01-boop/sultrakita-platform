'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ReelsFeed } from '@/components/reels/ReelsFeed';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';
const fallback = [{ id: 'reel-route-1', user_id: 'demo', video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', thumbnail_url: null, caption: 'Cerita singkat warga untuk warga Sultra.', district: 'Kendari', views_count: 0, likes_count: 128, created_at: new Date().toISOString(), author: 'Maya Kendari', title: 'Teluk Kendari dari sudut yang berbeda' }];
export default function ReelsPage() {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  return <AppLayout><main className="platform-shell mx-auto max-w-3xl"><div className="mb-4"><span className="eyebrow">{t.reelEyebrow}</span><h1 className="mt-2 text-2xl font-bold text-sultra-forest dark:text-sultra-mint">{t.reelPageTitle}</h1><p className="mt-1 text-sm text-gray-600 dark:text-sultra-sand/70">{t.reelPageDesc}</p></div><ReelsFeed district="Kendari" fallback={fallback}/></main></AppLayout>;
}
