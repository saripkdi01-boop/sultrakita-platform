import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checkedAt = new Date().toISOString();
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return NextResponse.json(
      { ok: false, data: { api: 'up', db: 'unconfigured', storage: 'unknown', build: 'next', checkedAt } },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const supabase = await getServerSupabase();
    const { error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    return NextResponse.json(
      { ok: true, data: { api: 'up', db: 'up', storage: 'unknown', build: 'next', checkedAt } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, data: { api: 'up', db: 'down', storage: 'unknown', build: 'next', checkedAt } },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
