import './globals.css';
import type { Metadata } from 'next';
import { PreferencesProvider } from '@/lib/preferences';

export const metadata: Metadata = {
  metadataBase: new URL('https://sultrakita-platform.vercel.app'),
  title: 'SUKI Apps - Ekosistem Digital Sulawesi Tenggara (SultraKita)',
  description: 'SUKI Apps adalah ekosistem digital Sulawesi Tenggara untuk menemukan properti, peluang kerja, marketplace, komunitas, dan layanan warga.',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/suki-logo-mark.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t!=='dark'&&t!=='light')t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})()" }} /></head><body><PreferencesProvider>{children}</PreferencesProvider></body></html>;
}
