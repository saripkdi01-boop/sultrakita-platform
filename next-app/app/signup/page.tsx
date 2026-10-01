import { Suspense } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SignupPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#f6faf8]" />}><AuthGate initialMode="signup" /></Suspense>
    </AppLayout>
  );
}
