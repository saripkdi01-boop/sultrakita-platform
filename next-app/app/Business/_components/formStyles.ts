import type { CSSProperties } from 'react';

/** Style inline bersama untuk halaman auth /Business.
 *  Memakai variabel warna --sb-* dari kelas .suki-business-page di globals.css
 *  (jangan edit globals.css). */

export const containerNarrow: CSSProperties = {
  width: 'min(760px, calc(100% - 32px))',
  margin: '0 auto',
  padding: '44px 0 96px',
};

export const containerWide: CSSProperties = {
  width: 'min(1180px, calc(100% - 32px))',
  margin: '0 auto',
  padding: '44px 0 96px',
};

export const pageKicker: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  color: 'var(--sb-teal)',
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  margin: '0 0 14px',
};

export const pageTitle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 'clamp(28px, 5vw, 40px)',
  lineHeight: 1.1,
  letterSpacing: '-.03em',
  color: 'var(--sb-ink)',
};

export const pageSubtitle: CSSProperties = {
  margin: '0 0 28px',
  color: 'var(--sb-muted)',
  fontSize: 14,
  lineHeight: 1.75,
  maxWidth: 560,
};

export const card: CSSProperties = {
  background: 'var(--sb-surface)',
  border: '1px solid var(--sb-line)',
  boxShadow: 'var(--theme-shadow-md)',
  borderRadius: 20,
  padding: 24,
};

export const fieldLabel: CSSProperties = {
  display: 'grid',
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--sb-ink)',
};

export const fieldInput: CSSProperties = {
  width: '100%',
  minHeight: 48,
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid var(--sb-line)',
  background: 'var(--sb-surface)',
  color: 'var(--sb-ink)',
  fontSize: 15,
  fontFamily: 'inherit',
};

export const fieldTextarea: CSSProperties = {
  ...fieldInput,
  minHeight: 110,
  resize: 'vertical',
  lineHeight: 1.6,
};

export const fieldHint: CSSProperties = {
  fontSize: 12,
  fontWeight: 400,
  color: 'var(--sb-muted)',
};

export const fieldError: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--sb-danger)',
  lineHeight: 1.5,
};

export const errorBox: CSSProperties = {
  borderRadius: 14,
  border: '1px solid color-mix(in srgb, var(--sb-danger) 40%, transparent)',
  background: 'color-mix(in srgb, var(--sb-danger) 10%, var(--sb-surface))',
  color: 'var(--sb-danger)',
  padding: '13px 16px',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.6,
};

export const successBanner: CSSProperties = {
  borderRadius: 16,
  border: '1px solid color-mix(in srgb, var(--sb-success) 40%, transparent)',
  background: 'color-mix(in srgb, var(--sb-success) 12%, var(--sb-surface))',
  color: 'var(--sb-success)',
  padding: '14px 18px',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.6,
  marginBottom: 24,
};

export const backLink: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 800,
  color: 'var(--sb-forest)',
  marginBottom: 22,
};

export const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
