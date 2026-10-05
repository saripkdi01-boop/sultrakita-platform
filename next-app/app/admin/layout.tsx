import { redirect } from 'next/navigation';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireAdminUser } from '@/lib/supabase/server';
import { AdminNav, type AdminAlerts } from './AdminNav';

/**
 * Command Center v2 — alert counts untuk badge navigasi.
 * Dibaca dengan service-role SETELAH requireAdminUser() lolos, sehingga
 * angka "pending moderasi" mencakup baris yang disembunyikan RLS publik.
 * Gagal baca → null → badge tidak dirender (halaman tetap jalan).
 */
async function getAdminAlerts(): Promise<AdminAlerts> {
  const empty: AdminAlerts = { pendingModeration: null, unresolvedErrors: null, openTickets: null };
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return empty;
    const client: SupabaseClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const [moderation, errors, tickets] = await Promise.all([
      client
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('moderation_status', 'pending'),
      client
        .from('error_events')
        .select('id', { count: 'exact', head: true })
        .eq('resolved', false),
      client
        .from('support_tickets')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open'),
    ]);

    return {
      pendingModeration: moderation.error ? null : (moderation.count ?? 0),
      unresolvedErrors: errors.error ? null : (errors.count ?? 0),
      openTickets: tickets.error ? null : (tickets.count ?? 0),
    };
  } catch {
    return empty;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminUser();
    const alerts = await getAdminAlerts();
    return (
      <>
        <AdminNav alerts={alerts} />
        {children}
      </>
    );
  } catch {
    redirect('/login?redirect=/admin/dashboard');
  }
}
