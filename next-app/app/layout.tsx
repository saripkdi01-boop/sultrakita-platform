import './globals.css';
import type { Metadata } from 'next';
import { PreferencesProvider } from '@/lib/preferences';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id'),
  title: 'SUKI Apps - Ekosistem Digital Sulawesi Tenggara (SultraKita)',
  description: 'SUKI Apps adalah ekosistem digital Sulawesi Tenggara untuk menemukan properti, peluang kerja, marketplace, komunitas, dan layanan warga.',
  verification: {
    google: 'tiF1Q_tscYW2AJduLkbBx9_41MfsXoorqZNs9pkTX1Q',
  },
  icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/suki-logo-mark.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><meta name="theme-color" content="#F7F8F6" /><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t!=='dark'&&t!=='light'){var legacy=localStorage.getItem('sultra-dark');t=legacy==='true'?'dark':legacy==='false'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})()" }} /></head><body><PreferencesProvider>{children}</PreferencesProvider></body></html>;
}
