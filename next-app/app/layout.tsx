import './globals.css';
import './styles/suki-foundation.css';
import type { Metadata, Viewport } from 'next';
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

/**
 * Viewport is declared here so both colour schemes are advertised and the
 * browser chrome matches the resolved theme. `PreferencesProvider` updates the
 * `theme-color` meta on theme change; these are the pre-hydration defaults.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F8F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1D19' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><meta name="theme-color" content="#F7F8F6" /><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t!=='dark'&&t!=='light'){var legacy=localStorage.getItem('sultra-dark');t=legacy==='true'?'dark':legacy==='false'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})()" }} /></head><body><a className="suki-skip-link" href="#suki-main">Lewati ke konten utama</a><PreferencesProvider>{children}</PreferencesProvider></body></html>;
}
