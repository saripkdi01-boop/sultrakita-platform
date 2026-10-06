import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline — SUKI Apps',
  description: 'Kamu sedang offline. Beberapa halaman SUKI Apps yang pernah dibuka tetap bisa diakses.',
};

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#0e6258',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="SUKI Apps" width={72} height={72} style={{ borderRadius: 18 }} />
        <h1 style={{ margin: '16px 0 8px', fontSize: 22, fontWeight: 800, color: '#0e6258' }}>
          Kamu sedang offline
        </h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#4b5563' }}>
          Koneksi internet terputus. Halaman yang pernah kamu buka tetap bisa diakses,
          dan semuanya kembali normal saat online lagi.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '12px 28px',
            borderRadius: 999,
            background: '#0e6258',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Coba lagi
        </Link>
      </div>
    </main>
  );
}
