import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SUKI Suits — Properti Kendari & Sulawesi Tenggara', description: 'Temukan properti terkurasi dengan data yang lebih terpercaya di Sulawesi Tenggara.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }