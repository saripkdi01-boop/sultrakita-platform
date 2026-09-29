import './globals.css';
import './styles/suki-foundation.css';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { PreferencesProvider } from '@/lib/preferences';

/**
 * Fonts are self-hosted by `next/font` so there is no render-blocking request
 * to fonts.googleapis.com and no layout shift while the face swaps in.
 *
 * The CSS variables are deliberately named `--font-jakarta` / `--font-instrument`
 * rather than `--font-body` / `--font-display`. `globals.css` already defines
 * `--font-display` inside `:root` (as Playfair Display), and a same-specificity
 * redefinition would make the winner depend on stylesheet order. Instead these
 * two variables are only ever *inputs*; the actual `--font-body` /
 * `--font-display` contract is composed in `suki-foundation.css` section 13,
 * which loads after `globals.css` and therefore wins deterministically.
 *
 * `display: 'swap'` plus a fallback chain in the CSS contract means text is
 * always readable, even if a face fails to load.
 */
const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

const displayFont = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument',
});

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
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <head>
        <meta name="theme-color" content="#F7F8F6" />
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t!=='dark'&&t!=='light'){var legacy=localStorage.getItem('sultra-dark');t=legacy==='true'?'dark':legacy==='false'?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})()" }} />
      </head>
      <body>
        <a className="suki-skip-link" href="#suki-main">Lewati ke konten utama</a>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
