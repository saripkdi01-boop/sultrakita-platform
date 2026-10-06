import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { requireAdminUser } from '@/lib/supabase/server';
import { AdminNav } from '@/app/admin/AdminNav';
import { AdminHomeContent } from '@/app/admin/dashboard/_components/AdminHomeContent';

// URL admin yang diminta owner: sukiapps.web.id/dashboard/admin
// Merender Operations Center yang sama dengan /admin/dashboard
// (satu sumber komponen), diproteksi requireAdminUser + middleware.
export default async function DashboardAdminPage() {
  try {
    const { user, profile } = await requireAdminUser();
    const displayName = profile.display_name || profile.full_name || user.email || 'Admin';
    return (
      <AppLayout active="home">
        <AdminNav />
        <AdminHomeContent displayName={displayName} role={profile.role} />
      </AppLayout>
    );
  } catch {
    redirect('/login?redirect=/dashboard/admin');
  }
}
