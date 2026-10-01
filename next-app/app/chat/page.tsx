import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
// import ChatPageClient from './ChatPageClient'; // Fase 0: chat dinonaktifkan sementara.

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ChatPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect('/login?redirect=%2Fchat');
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=%2Fchat');

  // Fase 0 (2026-10-01): SUKI Chat dinonaktifkan sementara karena gateway WebSocket
  // belum tersedia di produksi (sebelumnya default ws://127.0.0.1:8090 + userId 'demo-user').
  // Kode chat TIDAK dihapus (ChatPageClient.tsx, components/chat/*, lib/realtime/*).
  // Cara mengaktifkan kembali: lihat ARCHITECTURE.md bagian "Chat realtime".
  // return <ChatPageClient />;

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--theme-bg, #f7fbf8)' }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', background: '#fff', borderRadius: 24, padding: '40px 28px', boxShadow: '0 12px 40px rgba(18,33,31,.08)' }}>
        <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 20, display: 'grid', placeItems: 'center', background: '#e5f3ed', color: '#0e6258' }}>
          <MessageCircle size={30} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#143b35', margin: '0 0 8px' }}>Fitur chat segera hadir</h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5b6f6a', margin: '0 0 20px' }}>
          Pesan langsung antar warga sedang kami siapkan agar aman dan nyaman digunakan.
          Sementara ini, hubungi penjual melalui tombol kontak di halaman listing atau lewat komunitas.
        </p>
        <Link href="/beranda" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 12, background: '#0e6258', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
