import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SultraKita — SUKI Marketplace | Ruang Warga Sulawesi Tenggara', description: 'Temukan produk, jasa, cerita, dan seller terpercaya dari Sulawesi Tenggara dalam satu ruang warga.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
