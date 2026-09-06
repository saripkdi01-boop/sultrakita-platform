import './globals.css';
import type { Metadata } from 'next';
import { PreferencesProvider } from '@/lib/preferences';

export const metadata: Metadata = { title: 'SultraKita — SUKI Marketplace | Ruang Warga Sulawesi Tenggara', description: 'Temukan produk, jasa, cerita, dan seller terpercaya dari Sulawesi Tenggara dalam satu ruang warga.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('sultrakita-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}})()" }} /></head><body><PreferencesProvider>{children}</PreferencesProvider></body></html>; }
