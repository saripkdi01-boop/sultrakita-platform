import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireAdminUser } from '@/lib/supabase/server';
import { AdminHomeContent } from './_components/AdminHomeContent';

export default async function AdminDashboardPage() {
  try {
    const { user, profile } = await requireAdminUser();
    const displayName = profile.display_name || profile.full_name || user.email || 'Admin';
    return (
      <AppLayout active="home">
        <AdminHomeContent displayName={displayName} role={profile.role} />
      </AppLayout>
    );
  } catch {
    redirect('/login?redirect=/admin/dashboard');
  }
}
