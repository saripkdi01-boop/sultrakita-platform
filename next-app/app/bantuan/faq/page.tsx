import type { Metadata } from 'next';
import { FaqClient } from '@/components/bantuan/FaqClient';

export const metadata: Metadata = {
  title: 'FAQ — Pertanyaan Umum | SUKI Apps',
  description:
    'Jawaban pertanyaan umum SUKI Apps: cara daftar, cara jual di marketplace & properti, belanja aman, biaya, akun, dan privasi data.',
  alternates: { canonical: 'https://sukiapps.web.id/bantuan/faq' },
  openGraph: {
    title: 'FAQ — Pertanyaan Umum | SUKI Apps',
    description: 'Cara daftar, jual, beli aman, dan kelola privasi di SUKI Apps.',
    url: 'https://sukiapps.web.id/bantuan/faq',
    type: 'website',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
