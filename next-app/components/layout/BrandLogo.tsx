'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BrandLogo() {
  const pathname = usePathname();
  const isSuits = pathname.startsWith('/properti') || pathname.startsWith('/dashboard/properties') || pathname.startsWith('/dashboard/inquiries') || pathname.startsWith('/admin/property-verification');
  const brandName = isSuits ? 'SUKI Suits' : 'SUKI Apps';
  return (
    <Link className="brand-lockup" href={isSuits ? '/properti' : '/'} aria-label={`${brandName} — by SULTRAKITA`}>
      <span className="brand-symbol" aria-hidden="true">
        {isSuits ? <Building2 size={23} strokeWidth={2.2} /> : <img src="/suki-logo-mark.png" alt="" />}
      </span>
      <span className="brand-wordmark">
        <strong>{brandName}</strong>
        <small>by SULTRAKITA</small>
      </span>
    </Link>
  );
}
