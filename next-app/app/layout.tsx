import './globals.css';
import './homepage-qa-overrides.css';
import './suki-overhaul.css';
import './nusantara.css';
import type { Metadata } from 'next';
import { PreferencesProvider } from '@/lib/preferences';
import { AdSenseScript } from '@/components/ads/AdSenseScript';
import { UtmCapture } from '@/components/analytics/UtmCapture';
import { ReferralCapture } from '@/components/analytics/ReferralCapture';
import { PwaRegister } from '@/components/pwa/PwaRegister';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id'),
  title: 'SUKI Apps - Ekosistem Digital Sulawesi Tenggara (SultraKita)',
  description: 'SUKI Apps adalah ekosistem digital Sulawesi Tenggara untuk menemukan properti, peluang kerja, marketplace, komunitas, dan layanan warga.',
  verification: {
    google: 'tiF1Q_tscYW2AJduLkbBx9_41MfsXoorqZNs9pkTX1Q',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><meta name="theme-color" media="(prefers-color-scheme: light)" content="#F7F8F6" /><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0B1512" />{/* eslint-disable-next-line @next/next/no-page-custom-font -- false positive: ini root layout App Router, font berlaku untuk SEMUA halaman */}
        <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" /><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t!=='dark'&&t!=='light'){var legacy=localStorage.getItem('sultra-dark');t=legacy==='true'?'dark':legacy==='false'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})()" }} /></head><body><AdSenseScript /><UtmCapture /><ReferralCapture /><PwaRegister /><PreferencesProvider>{children}</PreferencesProvider><InstallPrompt /></body></html>;
}
