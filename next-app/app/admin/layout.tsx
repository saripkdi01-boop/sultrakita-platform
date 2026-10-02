import { redirect } from 'next/navigation';
import { requireAdminUser } from '@/lib/supabase/server';
import { AdminNav } from './AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminUser();
    return (
      <>
        <AdminNav />
        {children}
      </>
    );
  } catch {
    redirect('/login?redirect=/admin/dashboard');
  }
}
