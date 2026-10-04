import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { ChatComingSoon } from './ChatComingSoon';
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
    <AppLayout>
      <ChatComingSoon />
    </AppLayout>
  );
}
