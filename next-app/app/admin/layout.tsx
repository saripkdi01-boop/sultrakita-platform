import { redirect } from 'next/navigation';
import { requireAdminUser } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminUser();
    return children;
  } catch {
    redirect('/login?redirect=/admin');
  }
}
