import { Suspense } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';

export default function SignupPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f7fbf8]" />}><AuthGate initialMode="signup" /></Suspense>;
}
