import type { ReactNode } from 'react';

/**
 * Cangkang halaman error ber-branding SukiApps.
 *
 * Dipakai oleh not-found.tsx, error.tsx, global-error.tsx, dan
 * maintenance/page.tsx. Styling inline penuh agar halaman tetap tampil
 * benar walau CSS global gagal dimuat (khususnya global-error).
 *
 * Prinsip: tanpa stack trace ke pengguna, copy Bahasa Indonesia yang
 * membantu, selalu ada jalan keluar (beranda / dukungan).
 */

const PALETTE = {
  bg: '#FAF9F6',
  card: '#ffffff',
  ink: '#1C1917',
  forest: '#0e6258',
  forestDark: '#143b35',
  muted: '#5b6f6a',
  line: '#E7E5E4',
  iconBg: '#e5f3ed',
} as const;

export interface ErrorAction {
  label: string;
  href: string;
  primary?: boolean;
}

export interface ErrorShellProps {
  /** Kode status besar, mis. "404". */
  code: string;
  title: string;
  description: ReactNode;
  actions: ErrorAction[];
  /** Bila diisi, render tombol <button> "Coba lagi" yang memanggil onRetry (untuk error boundary). */
  onRetry?: () => void;
  retryLabel?: string;
  /** Catatan kecil di bawah tombol, mis. info status/insiden. */
  footnote?: ReactNode;
}

export default function ErrorShell({ code, title, description, actions, onRetry, retryLabel = 'Coba lagi', footnote }: ErrorShellProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: PALETTE.bg,
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: PALETTE.ink,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          background: PALETTE.card,
          borderRadius: 24,
          padding: '44px 32px',
          boxShadow: '0 12px 40px rgba(18,33,31,.08)',
          border: `1px solid ${PALETTE.line}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/suki-logo-mark.svg" alt="Logo SukiApps" width={52} height={52} style={{ borderRadius: 14 }} />
        </div>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '.22em',
            color: PALETTE.forest,
          }}
        >
          {code}
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: PALETTE.forestDark, margin: '0 0 10px', lineHeight: 1.3 }}>
          {title}
        </h1>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: PALETTE.muted, margin: '0 0 24px' }}>{description}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                padding: '13px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                background: PALETTE.forest,
                color: '#fff',
                border: 'none',
                fontFamily: 'inherit',
              }}
            >
              {retryLabel}
            </button>
          )}
          {actions.map((action) => (
            <a
              key={action.href + action.label}
              href={action.href}
              style={{
                display: 'inline-block',
                padding: '13px 24px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                background: action.primary ? PALETTE.forest : 'transparent',
                color: action.primary ? '#fff' : PALETTE.forest,
                border: action.primary ? 'none' : `1px solid ${PALETTE.line}`,
              }}
            >
              {action.label}
            </a>
          ))}
        </div>
        {footnote && (
          <p style={{ margin: '22px 0 0', fontSize: 12, color: '#9aa5a1', lineHeight: 1.6 }}>{footnote}</p>
        )}
      </div>
    </main>
  );
}
