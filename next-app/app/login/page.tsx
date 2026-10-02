import { Suspense } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { AppLayout } from '@/components/layout/AppLayout';
import { isFacebookLoginEnabled } from '@/lib/settings/feature-flags';

// Halaman membaca feature flag runtime dari DB (site_settings) —
// WAJIB dynamic: jangan pernah prerender statis / di-cache edge,
// kalau tidak perubahan flag oleh admin tidak terlihat tanpa deploy ulang.
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Flag dibaca server-side dari site_settings (admin dapat mengubahnya dari
  // /admin/settings tanpa deploy ulang); fallback ke env bila DB tak terbaca.
  const facebookLoginEnabled = await isFacebookLoginEnabled();
  return (
    <AppLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#f6faf8]" />}><AuthGate initialMode="login" facebookLoginEnabled={facebookLoginEnabled} /></Suspense>
    </AppLayout>
  );
}
