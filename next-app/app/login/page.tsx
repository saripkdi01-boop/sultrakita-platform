import { Suspense } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { AppLayout } from '@/components/layout/AppLayout';

export default function LoginPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#f6faf8]" />}><AuthGate initialMode="login" /></Suspense>
    </AppLayout>
  );
}
