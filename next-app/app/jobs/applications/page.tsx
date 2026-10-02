import type { Metadata } from 'next';
import { getMyApplications, getMyJobAlerts } from '@/lib/actions/jobs';
import ApplicationsClient from './applications-client';

export const metadata: Metadata = { title: 'Lamaran Saya | SUKI Jobs', description: 'Pantau status lamaran kerja dan kelola notifikasi lowongan Anda di SUKI Jobs.' };

// Halaman personal: render per-request agar status lamaran sesuai sesi pengguna.
export const dynamic = 'force-dynamic';

export default async function JobApplicationsPage() {
  const [apps, alerts] = await Promise.all([getMyApplications(), getMyJobAlerts()]);
  return <ApplicationsClient initialApps={apps} initialAlerts={alerts} />;
}
