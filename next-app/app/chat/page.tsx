import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';
import ChatPageClient from './ChatPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ChatPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) redirect('/login?redirect=%2Fchat');
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=%2Fchat');
  return <ChatPageClient />;
}
