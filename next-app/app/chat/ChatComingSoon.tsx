'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';

/** Placeholder "segera hadir" untuk /chat selama gateway realtime belum tersedia. */
export function ChatComingSoon() {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--theme-bg, #f7fbf8)' }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 28px', boxShadow: '0 12px 40px rgba(18,33,31,.08)' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 20, display: 'grid', placeItems: 'center', background: '#e5f3ed', color: '#0e6258' }}>
          <MessageCircle size={30} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#143b35', margin: '0 0 8px' }}>{t.chatComingSoonTitle}</h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5b6f6a', margin: '0 0 20px' }}>
          {t.chatComingSoonDesc}
        </p>
        <Link href="/beranda" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 12, background: '#0e6258', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          {t.chatBackToHome}
        </Link>
      </div>
    </main>
  );
}
